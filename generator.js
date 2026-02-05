import {
  BACKGROUND_COLOR,
  BOX_SIZE,
  CAMERA_SPEED,
  ZOOM as DEFAULT_ZOOM,
  ITERATIONS,
  MAP_SIZE,
} from "./constants.js";
import { generateDrawMap } from "./generateDrawMap.js";
import { generateGroundTileMap } from "./generateGroundMap.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import { generateWaterTileMap } from "./generateWaterTileMap.js";
import { generateWaterValueMap } from "./generateWaterValueMap.js";
import {
  applyOrganicIterations,
  clampCamera,
  clearDrawingFlags,
  generateNoiseMap,
  updateCamera,
} from "./map-utils.js";
import { paintCellAtPosition } from "./paintCellAtPosition.js";
import { renderMap } from "./renderMap.js";
import { initZoomPrevention } from "./zoomPrevention.js";

// Initialize zoom prevention
initZoomPrevention();

// Camera state
let camera = {
  x: 0,
  y: 0,
};

// Zoom state (mutable, can be changed at runtime)
let zoom = DEFAULT_ZOOM;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

// Track currently pressed keys.
const keys = {};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toolbar = document.getElementById("toolbar");

// Tool selection state
let currentTool = "tree"; // "tree" or "eraser"

// Tool button elements
const treeToolButton = document.getElementById("tree-tool");
const waterToolButton = document.getElementById("water-tool");
const eraserToolButton = document.getElementById("eraser-tool");

// Tool selection handlers
treeToolButton.addEventListener("click", () => {
  currentTool = "tree";
  treeToolButton.classList.add("active");
  waterToolButton.classList.remove("active");
  eraserToolButton.classList.remove("active");
});

waterToolButton.addEventListener("click", () => {
  currentTool = "water";
  waterToolButton.classList.add("active");
  treeToolButton.classList.remove("active");
  eraserToolButton.classList.remove("active");
});

eraserToolButton.addEventListener("click", () => {
  currentTool = "eraser";
  eraserToolButton.classList.add("active");
  waterToolButton.classList.remove("active");
  treeToolButton.classList.remove("active");
});

// Helper function to get available canvas height
function getCanvasHeight() {
  return window.innerHeight - toolbar.offsetHeight;
}

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

canvas.width = window.innerWidth;
canvas.height = getCanvasHeight();
// Re-disable image smoothing (canvas resize resets this setting)
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Fill canvas with blank color
ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize the map with organic cave patterns
let treeValueMap,
  waterValueMap,
  waterTileMap,
  groundTileMap,
  treeTileMap,
  drawMap;

drawMap = generateDrawMap();

treeValueMap = applyOrganicIterations(generateNoiseMap(MAP_SIZE), ITERATIONS);

groundTileMap = generateGroundTileMap();

waterValueMap = generateWaterValueMap();

waterTileMap = generateWaterTileMap(waterValueMap);

treeTileMap = generateTreeTileMap(treeValueMap);

// State for drag-to-paint interaction
let isDrawing = false;
let paintedCellsInStroke = new Set();

// Load number sprite sheet (100x10 PNG: nine 10x10 digits 0-8)
const numberSprite = new Image();
numberSprite.src = "./assets/numbers.png";

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
  canvas.height = getCanvasHeight();
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

// Handle mouse down to start painting
function handleMouseDown(event) {
  // Only respond to left click
  if (event.button !== 0) {
    return;
  }

  isDrawing = true;
  paintedCellsInStroke = new Set();

  // Paint the initial cells with brush
  paintCellAtPosition({
    canvas,
    currentTool,
    event,
    drawMap,
    treeValueMap,
    waterValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
  });
}

// Handle mouse move to continue painting
function handleMouseMove(event) {
  if (!isDrawing) {
    return;
  }

  // Paint the initial cells with brush
  paintCellAtPosition({
    canvas,
    currentTool,
    event,
    drawMap,
    treeValueMap,
    waterValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
  });
}

// Handle mouse up to finish painting and rerun iterations
function handleMouseUp() {
  if (!isDrawing) {
    return;
  }

  isDrawing = false;
  paintedCellsInStroke = new Set();

  // NOW rerun cellular automaton iterations (clears isBeingDrawn flags)
  //generateMap();
  treeValueMap = applyOrganicIterations(treeValueMap, ITERATIONS);

  treeTileMap = generateTreeTileMap(treeValueMap);

  waterTileMap = generateWaterTileMap(waterValueMap);

  clearDrawingFlags(drawMap);
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
  renderMap(
    treeValueMap,
    treeTileMap,
    groundTileMap,
    waterTileMap,
    drawMap,
    ctx,
    BOX_SIZE,
    numberSprite,
    tileMapSprite,
    camera,
    zoom,
  );

  requestAnimationFrame(animate);
}

// Note: animate() is now called from numberSprite.onload instead of immediately
