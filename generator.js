import {
  BACKGROUND_COLOR,
  BOX_SIZE,
  CAMERA_SPEED,
  ZOOM as DEFAULT_ZOOM,
  ITERATIONS,
  MAP_SIZE,
} from "./constants.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import {
  applyOrganicIterations,
  clampCamera,
  generateNoiseMap,
  getCellsInBrushArea,
  pixelToGridCoordinate,
  setCellValue,
  updateCamera,
} from "./map-utils.js";
import { renderMap } from "./renderMap.js";
import { initZoomPrevention } from "./zoomPrevention.js";

// Initialize zoom prevention
initZoomPrevention();

// Camera state
let camera = {
  x: 0, y: 0, 
};

// Zoom state (mutable, can be changed at runtime)
let zoom = DEFAULT_ZOOM;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

// Track currently pressed keys
const keys = {
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Re-disable image smoothing (canvas resize resets this setting)
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Fill canvas with blank color
ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize the map with organic cave patterns
let valueMap, tileMap;

valueMap = applyOrganicIterations(generateNoiseMap(MAP_SIZE), ITERATIONS);

generateMap();

function generateMap() {

  valueMap = applyOrganicIterations(valueMap, ITERATIONS);

  tileMap = generateTreeTileMap(valueMap);
}


// State for drag-to-paint interaction
let isDrawing = false;
let paintedCellsInStroke = new Set();
let paintTargetValue = null; // null when not painting, 0 or 1 during stroke

// Load number sprite sheet (100x10 PNG: nine 10x10 digits 0-8)
const numberSprite = new Image();
numberSprite.src = "./numbers.png";

const tileMapSprite = new Image();
tileMapSprite.src = "./assets/overworld.png";

// Wait for both images to load before starting animation
let spriteLoaded = false;

Promise.allSettled([
  new Promise((resolve, reject) => {
    numberSprite.onload = resolve;
    numberSprite.onerror = reject;
  }),
  new Promise((resolve, reject) => {
    tileMapSprite.onload = resolve;
    tileMapSprite.onerror = reject;
  }),
]).then(() => {
  spriteLoaded = true;
  animate();
});

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Re-disable image smoothing (canvas resize resets this setting)
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Keyboard event listeners for camera movement and zoom
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Zoom controls: + to zoom in, - to zoom out
  if (e.key === "+" || e.key === "=") {
    zoom = Math.min(zoom + 1, MAX_ZOOM);
  } else if (e.key === "-" || e.key === "_") {
    zoom = Math.max(zoom - 1, MIN_ZOOM);
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Helper function to paint cells during drag with 2x2 brush
function paintCellAtPosition(event) {
  // Safety: ensure we have a target value
  if (paintTargetValue === null) {
    return;
  }

  // Get click coordinates relative to canvas
  const rect = canvas.getBoundingClientRect();
  const pixelX = event.clientX - rect.left;
  const pixelY = event.clientY - rect.top;

  // Convert screen pixel to world pixel (add camera offset)
  const worldPixelX = pixelX + camera.x;
  const worldPixelY = pixelY + camera.y;

  // Convert to grid coordinates (center of brush) using scaled box size
  const { x, y } = pixelToGridCoordinate(
    worldPixelX,
    worldPixelY,
    BOX_SIZE * zoom,
  );

  // Validate center cell bounds
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
    return;
  }

  // Get all cells in 2x2 brush area
  const brushSize = 2;
  const cellsToPaint = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);

  // Paint each cell (avoid redundant sets within a single stroke)
  for (const cell of cellsToPaint) {
    const cellKey = `${cell.x},${cell.y}`;
    if (!paintedCellsInStroke.has(cellKey)) {
      valueMap = setCellValue(valueMap, cell.x, cell.y, paintTargetValue);
      paintedCellsInStroke.add(cellKey);
    }
  }
}

// Handle mouse down to start painting
function handleMouseDown(event) {
  isDrawing = true;
  paintedCellsInStroke = new Set();

  // Left click (button 0) = draw (1), Right click (button 2) = erase (0)
  paintTargetValue = event.button === 2 ? 0 : 1;

  // Paint the initial cells with brush
  paintCellAtPosition(event);
}

// Handle mouse move to continue painting
function handleMouseMove(event) {
  if (!isDrawing) {
    return;
  }

  // Continue painting while dragging
  paintCellAtPosition(event);
}

// Handle mouse up to finish painting and rerun iterations
function handleMouseUp(event) {
  if (!isDrawing) {
    return;
  }

  isDrawing = false;
  paintedCellsInStroke = new Set();
  paintTargetValue = null; // Clear target value

  // NOW rerun cellular automaton iterations (clears isBeingDrawn flags)
  generateMap();
}

// Block browser context menu on canvas (for right-click erase)
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

// Attach mouse event listeners for drag-to-paint
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// Also handle mouse leaving canvas
canvas.addEventListener("mouseleave", handleMouseUp);

// Animation loop
function animate() {
  if (!spriteLoaded) {
    return;
  } // Don't render until sprite is loaded

  // Update camera position based on pressed keys
  camera = updateCamera(camera, keys, CAMERA_SPEED, zoom);

  // Clamp camera to map boundaries
  camera = clampCamera(
    camera,
    MAP_SIZE,
    BOX_SIZE,
    zoom,
    canvas.width,
    canvas.height,
  );

  // Clear canvas with background color
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render the map with sprite, camera offset, and zoom
  renderMap(valueMap, tileMap, ctx, BOX_SIZE, numberSprite, tileMapSprite, camera, zoom);

  requestAnimationFrame(animate);
}

// Note: animate() is now called from numberSprite.onload instead of immediately
