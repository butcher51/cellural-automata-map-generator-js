import { cleanupWaterArtifacts } from "./cleanupWaterArtifacts.js";
import { BACKGROUND_COLOR, BOX_SIZE, CAMERA_SPEED, ZOOM as DEFAULT_ZOOM, ITERATIONS, MAP_SIZE } from "./constants.js";
import { generateDrawMap } from "./generateDrawMap.js";
import { generateGroundTileMap } from "./generateGroundMap.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import { generateWaterTileMap } from "./generateWaterTileMap.js";
import { generateWaterValueMap } from "./generateWaterValueMap.js";
import { applyOrganicIterations, clampCamera, clearDrawingFlags, generateNoiseMap, getCellsInBrushArea, pixelToGridCoordinate, setCellValue, updateCamera } from "./map-utils.js";
import { paintCellAtPosition } from "./paintCellAtPosition.js";
import { renderMap } from "./renderMap.js";
import { initZoomPrevention } from "./zoomPrevention.js";

// Initialize zoom prevention
initZoomPrevention();

/**
 * Updates cursor preview based on mouse/touch position
 * @param {Event} event - Mouse or touch event with clientX/clientY
 */
function updateCursorPreview(event) {
  const rect = canvas.getBoundingClientRect();
  const pixelX = event.clientX - rect.left;
  const pixelY = event.clientY - rect.top;

  // Convert screen pixel to world pixel (add camera offset)
  const worldPixelX = pixelX + camera.x;
  const worldPixelY = pixelY + camera.y;

  // Convert to grid coordinates
  const { x, y } = pixelToGridCoordinate(worldPixelX, worldPixelY, BOX_SIZE * zoom);

  // Validate bounds
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
    cursorGridX = null;
    cursorGridY = null;
    cursorPreviewCells = [];
    return;
  }

  cursorGridX = x;
  cursorGridY = y;

  // Get brush size based on tool
  const brushSize = currentTool === "water" ? 3 : 2;

  // Calculate preview cells
  cursorPreviewCells = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);
}

/**
 * Clears trees from water regions and their borders
 * @param {Array} treeValueMap - The tree value map
 * @param {Array} waterValueMap - The validated water value map
 * @returns {Array} Updated tree value map with trees cleared from water areas
 */
function clearTreesFromWater(treeValueMap, waterValueMap) {
  const height = waterValueMap.length;
  const width = waterValueMap[0]?.length || 0;

  let updatedTreeMap = treeValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Clear trees where water exists
      if (waterValueMap[y][x].value === 1) {
        updatedTreeMap = setCellValue(updatedTreeMap, x, y, 1);
      }
    }
  }

  return updatedTreeMap;
}

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
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  return viewportHeight - toolbar.offsetHeight;
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
let treeValueMap, waterValueMap, waterTileMap, groundTileMap, treeTileMap, drawMap;

drawMap = generateDrawMap();

groundTileMap = generateGroundTileMap();

treeValueMap = applyOrganicIterations(generateNoiseMap(MAP_SIZE), 10);

waterValueMap = generateWaterValueMap();

waterTileMap = generateWaterTileMap(waterValueMap, waterTileMap);

treeTileMap = generateTreeTileMap(treeValueMap);

// State for drag-to-paint interaction
let isDrawing = false;
let paintedCellsInStroke = new Set();

// State for two-finger gestures (pinch zoom and pan)
let initialPinchDistance = null;
let lastTouchMidpoint = null;
let initialZoom = null;

// State for right-click pan
let isPanning = false;
let lastPanMousePosition = null;

// Cursor preview state
let cursorGridX = null; // Grid X position of cursor (null if outside canvas)
let cursorGridY = null; // Grid Y position of cursor (null if outside canvas)
let cursorPreviewCells = []; // Array of {x, y} cells to preview

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

// Handle mobile viewport resize (e.g., when address bar hides/shows)
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = getCanvasHeight();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
}

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
  // Handle right-click pan
  if (event.button === 2) {
    isPanning = true;
    lastPanMousePosition = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = "grabbing";
    return;
  }

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
  // Handle panning (takes priority)
  if (isPanning && lastPanMousePosition) {
    const dx = event.clientX - lastPanMousePosition.x;
    const dy = event.clientY - lastPanMousePosition.y;

    // Screen delta maps directly to camera delta (1:1 relationship)
    camera.x -= dx;
    camera.y -= dy;

    // Update last position for continuous movement
    lastPanMousePosition = { x: event.clientX, y: event.clientY };
    return;
  }

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
function handleMouseUp(event) {
  // Handle pan end
  if (isPanning) {
    isPanning = false;
    lastPanMousePosition = null;
    canvas.style.cursor = "";
    return;
  }

  if (!isDrawing) {
    return;
  }

  isDrawing = false;
  paintedCellsInStroke = new Set();

  // Process water first
  waterValueMap = cleanupWaterArtifacts(waterValueMap);
  waterTileMap = generateWaterTileMap(waterValueMap, waterTileMap);

  // Then clear trees based on validated water
  treeValueMap = clearTreesFromWater(treeValueMap, waterValueMap);

  // Finally process trees
  treeValueMap = applyOrganicIterations(treeValueMap, ITERATIONS);
  treeTileMap = generateTreeTileMap(treeValueMap);

  clearDrawingFlags(drawMap);
}

// Calculate distance between two touch points
function getTouchDistance(touch1, touch2) {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate midpoint between two touch points
function getTouchMidpoint(touch1, touch2) {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

// Handle touch start to begin painting
function handleTouchStart(event) {
  event.preventDefault(); // Prevent scrolling while drawing

  if (event.touches.length === 2) {
    // Two fingers: start pinch zoom / pan gesture
    isDrawing = false; // Cancel any drawing
    clearDrawingFlags(drawMap); // Clear any partially drawn cells to prevent black boxes
    initialPinchDistance = getTouchDistance(event.touches[0], event.touches[1]);
    lastTouchMidpoint = getTouchMidpoint(event.touches[0], event.touches[1]);
    initialZoom = zoom;
    return;
  }

  if (event.touches.length === 1) {
    // Single finger: start drawing
    isDrawing = true;
    paintedCellsInStroke = new Set();

    // Update cursor preview for touch
    updateCursorPreview(event.touches[0]);

    paintCellAtPosition({
      canvas,
      currentTool,
      event: event.touches[0], // Pass touch point (has clientX/clientY)
      drawMap,
      treeValueMap,
      waterValueMap,
      camera,
      zoom,
      paintedCellsInStroke,
    });
  }
}

// Handle touch move to continue painting
function handleTouchMove(event) {
  event.preventDefault();

  if (event.touches.length === 2 && initialPinchDistance !== null) {
    // Two fingers: handle pinch zoom and pan
    const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
    const currentMidpoint = getTouchMidpoint(event.touches[0], event.touches[1]);

    // Calculate zoom based on pinch ratio
    const pinchRatio = currentDistance / initialPinchDistance;
    const newZoom = Math.round(initialZoom * pinchRatio);
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    // Calculate pan based on midpoint movement
    if (lastTouchMidpoint) {
      const dx = currentMidpoint.x - lastTouchMidpoint.x;
      const dy = currentMidpoint.y - lastTouchMidpoint.y;
      camera.x -= dx / zoom;
      camera.y -= dy / zoom;
    }
    lastTouchMidpoint = currentMidpoint;

    // Clear preview during two-finger gestures
    cursorPreviewCells = [];
    return;
  }

  // Single finger drawing
  if (!isDrawing || event.touches.length !== 1) {
    return;
  }

  // Update cursor preview for touch
  updateCursorPreview(event.touches[0]);

  paintCellAtPosition({
    canvas,
    currentTool,
    event: event.touches[0],
    drawMap,
    treeValueMap,
    waterValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
  });
}

// Handle touch end to finish painting
function handleTouchEnd(event) {
  event.preventDefault();

  // Reset two-finger gesture state when fingers lift
  if (event.touches.length < 2) {
    initialPinchDistance = null;
    lastTouchMidpoint = null;
    initialZoom = null;
  }

  // If no more touches, finish any drawing stroke
  if (event.touches.length === 0) {
    handleMouseUp();
  }
}

// Block browser context menu on canvas (for right-click erase)
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

// Attach mouse event listeners for drag-to-paint
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// Also handle mouse leaving canvas
canvas.addEventListener("mouseleave", (event) => {
  // Stop panning if cursor leaves canvas
  if (isPanning) {
    isPanning = false;
    lastPanMousePosition = null;
    canvas.style.cursor = "";
  }

  // Also handle painting cleanup
  handleMouseUp(event);
});

// Track cursor for brush preview (even when not drawing)
canvas.addEventListener("mousemove", (event) => {
  updateCursorPreview(event);
});

canvas.addEventListener("mouseleave", () => {
  // Clear preview when cursor leaves canvas
  cursorGridX = null;
  cursorGridY = null;
  cursorPreviewCells = [];
});

// Zoom controls
document.getElementById("zoom-in").addEventListener("click", () => {
  zoom = Math.min(zoom + 1, MAX_ZOOM);
});

document.getElementById("zoom-out").addEventListener("click", () => {
  zoom = Math.max(zoom - 1, MIN_ZOOM);
});

// Attach touch event listeners for touch-to-paint
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd);
canvas.addEventListener("touchcancel", handleTouchEnd);

// Animation loop
function animate() {
  if (!spriteLoaded) {
    return;
  } // Don't render until sprite is loaded

  // Update camera position based on pressed keys
  camera = updateCamera(camera, keys, CAMERA_SPEED, zoom);

  // Clamp camera to map boundaries
  camera = clampCamera(camera, MAP_SIZE, BOX_SIZE, zoom, canvas.width, canvas.height);

  // Clear canvas with background color
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render the map with sprite, camera offset, and zoom
  renderMap(treeValueMap, treeTileMap, groundTileMap, waterTileMap, drawMap, ctx, BOX_SIZE, numberSprite, tileMapSprite, camera, zoom, cursorPreviewCells);

  requestAnimationFrame(animate);
}

// Note: animate() is now called from numberSprite.onload instead of immediately
