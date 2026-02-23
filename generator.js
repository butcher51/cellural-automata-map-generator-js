import { cleanupCliffArtifacts } from "./cleanupCliffArtifacts.js";
import { cleanupWaterArtifacts } from "./cleanupWaterArtifacts.js";
import {
  BACKGROUND_COLOR,
  BOX_SIZE,
  CAMERA_SPEED,
  ZOOM as DEFAULT_ZOOM,
  ITERATIONS,
  MAP_SIZE,
  setSeed,
} from "./constants.js";
import { generateCliffTileMap } from "./generateCliffTileMap.js";
import { generateCliffValueMap } from "./generateCliffValueMap.js";
import { generateDrawMap } from "./generateDrawMap.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";
import { generateGroundTileMap } from "./generateGroundMap.js";
import { generateDeadTreeTileMap } from "./generateDeadTreeTileMap.js";
import { generatePineTileMap } from "./generatePineTileMap.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import { generateWaterTileMap } from "./generateWaterTileMap.js";
import { generateWaterValueMap } from "./generateWaterValueMap.js";
import { createLayer } from "./layer.js";
import {
  applyOrganicIterations,
  clampCamera,
  clearDrawingFlags,
  generateNoiseMap,
  getCellsInBrushArea,
  getCellsInRectBrushArea,
  pixelToGridCoordinate,
  setCellValue,
  updateCamera,
} from "./map-utils.js";
import { paintCellAtPosition } from "./paintCellAtPosition.js";
import { render } from "./render.js";
import { syncLayerStack } from "./syncLayerStack.js";
import { initZoomPrevention } from "./zoomPrevention.js";

// State for drag-to-paint interaction
let isDrawing = false;
let paintedCellsInStroke = new Set();
let strokeTargetLayerIndex = 0;

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
  const { x, y } = pixelToGridCoordinate(
    worldPixelX,
    worldPixelY,
    BOX_SIZE * zoom,
  );

  // Validate bounds
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
    cursorGridX = null;
    cursorGridY = null;
    cursorPreviewCells = [];
    return;
  }

  cursorGridX = x;
  cursorGridY = y;

  // Calculate preview cells based on tool
  if (currentTool === "cliff") {
    cursorPreviewCells = getCellsInRectBrushArea(x, y, 3, 5, MAP_SIZE);
  } else {
    const brushSize = currentTool === "water" ? 3 : 2;
    cursorPreviewCells = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);
  }
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

/**
 * Clears trees from cliff regions
 * @param {Array} treeValueMap - The tree value map
 * @param {Array} cliffValueMap - The validated cliff value map
 * @returns {Array} Updated tree value map with trees cleared from cliff areas
 */
function clearTreesFromCliffs(treeValueMap, cliffValueMap) {
  const height = cliffValueMap.length;
  const width = cliffValueMap[0]?.length || 0;

  let updatedTreeMap = treeValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cliffValueMap[y][x].value === 1) {
        updatedTreeMap = setCellValue(updatedTreeMap, x, y, 1);
      }
    }
  }

  return updatedTreeMap;
}

/**
 * Clears water from cliff regions
 * @param {Array} waterValueMap - The water value map
 * @param {Array} cliffValueMap - The validated cliff value map
 * @returns {Array} Updated water value map with water cleared from cliff areas
 */
function clearWaterFromCliffs(waterValueMap, cliffValueMap) {
  const height = cliffValueMap.length;
  const width = cliffValueMap[0]?.length || 0;

  let updatedWaterMap = waterValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cliffValueMap[y][x].value === 1) {
        updatedWaterMap = setCellValue(updatedWaterMap, x, y, 0);
      }
    }
  }

  return updatedWaterMap;
}

/**
 * Clears pines from water regions and their borders
 * @param {Array} pineValueMap - The pine value map
 * @param {Array} waterValueMap - The validated water value map
 * @returns {Array} Updated pine value map with pines cleared from water areas
 */
function clearPinesFromWater(pineValueMap, waterValueMap) {
  const height = waterValueMap.length;
  const width = waterValueMap[0]?.length || 0;

  let updatedPineMap = pineValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Clear pines where water exists
      if (waterValueMap[y][x].value === 1) {
        updatedPineMap = setCellValue(updatedPineMap, x, y, 1);
      }
    }
  }

  return updatedPineMap;
}

/**
 * Clears pines from cliff regions
 * @param {Array} pineValueMap - The pine value map
 * @param {Array} cliffValueMap - The validated cliff value map
 * @returns {Array} Updated pine value map with pines cleared from cliff areas
 */
/**
 * Clears dead trees from water regions and their borders
 */
function clearDeadTreesFromWater(deadTreeValueMap, waterValueMap) {
  const height = waterValueMap.length;
  const width = waterValueMap[0]?.length || 0;

  let updatedMap = deadTreeValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (waterValueMap[y][x].value === 1) {
        updatedMap = setCellValue(updatedMap, x, y, 1);
      }
    }
  }

  return updatedMap;
}

/**
 * Clears dead trees from cliff regions
 */
function clearDeadTreesFromCliffs(deadTreeValueMap, cliffValueMap) {
  const height = cliffValueMap.length;
  const width = cliffValueMap[0]?.length || 0;

  let updatedMap = deadTreeValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cliffValueMap[y][x].value === 1) {
        updatedMap = setCellValue(updatedMap, x, y, 1);
      }
    }
  }

  return updatedMap;
}

function clearPinesFromCliffs(pineValueMap, cliffValueMap) {
  const height = cliffValueMap.length;
  const width = cliffValueMap[0]?.length || 0;

  let updatedPineMap = pineValueMap;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cliffValueMap[y][x].value === 1) {
        updatedPineMap = setCellValue(updatedPineMap, x, y, 1);
      }
    }
  }

  return updatedPineMap;
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
let currentTool = "tree-1";

// Tool button elements
const tree1Button = document.getElementById("tree-1-tool");
const tree2Button = document.getElementById("tree-2-tool");
const tree3Button = document.getElementById("tree-3-tool");
const tree4Button = document.getElementById("tree-4-tool");
const pine1Button = document.getElementById("pine-1-tool");
const deadTree1Button = document.getElementById("deadTree-1-tool");
const waterToolButton = document.getElementById("water-tool");
const cliffToolButton = document.getElementById("cliff-tool");
const eraserToolButton = document.getElementById("eraser-tool");

// Tool selection handlers
function setActiveTool(tool) {
  currentTool = tool;
  tree1Button.classList.toggle("active", tool === "tree-1");
  tree2Button.classList.toggle("active", tool === "tree-2");
  tree3Button.classList.toggle("active", tool === "tree-3");
  tree4Button.classList.toggle("active", tool === "tree-4");
  pine1Button.classList.toggle("active", tool === "pine-1");
  deadTree1Button.classList.toggle("active", tool === "deadTree-1");
  waterToolButton.classList.toggle("active", tool === "water");
  cliffToolButton.classList.toggle("active", tool === "cliff");
  eraserToolButton.classList.toggle("active", tool === "eraser");
}

tree1Button.addEventListener("click", () => setActiveTool("tree-1"));
tree2Button.addEventListener("click", () => setActiveTool("tree-2"));
tree3Button.addEventListener("click", () => setActiveTool("tree-3"));
tree4Button.addEventListener("click", () => setActiveTool("tree-4"));
pine1Button.addEventListener("click", () => setActiveTool("pine-1"));
deadTree1Button.addEventListener("click", () => setActiveTool("deadTree-1"));
waterToolButton.addEventListener("click", () => setActiveTool("water"));
cliffToolButton.addEventListener("click", () => setActiveTool("cliff"));
eraserToolButton.addEventListener("click", () => setActiveTool("eraser"));

// Helper function to get available canvas height
function getCanvasHeight() {
  const viewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  return viewportHeight - toolbar.offsetHeight;
}

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
let layers = [];
let activeLayerIndex = 0;
let drawMap;

function getActiveLayer() {
  return layers[activeLayerIndex];
}

drawMap = generateDrawMap();

// Create the base layer and populate its maps
const baseLayer = createLayer("layer-0", "Base Layer", 0);

baseLayer.groundTileMap = generateGroundTileMap();

baseLayer.treeValueMap = applyOrganicIterations(generateNoiseMap(MAP_SIZE), 10);

baseLayer.waterValueMap = generateWaterValueMap();
baseLayer.waterValueMap = cleanupWaterArtifacts(baseLayer.waterValueMap);

baseLayer.waterTileMap = generateWaterTileMap(
  baseLayer.waterValueMap,
  baseLayer.waterTileMap,
);

baseLayer.cliffValueMap = generateCliffValueMap();

baseLayer.cliffTileMap = generateCliffTileMap(
  baseLayer.cliffValueMap,
  baseLayer.cliffTileMap || [],
);

baseLayer.pineValueMap = generateEmptyValueMap(MAP_SIZE, 1); // All 1s = no pines initially
baseLayer.deadTreeValueMap = generateEmptyValueMap(MAP_SIZE, 1); // All 1s = no dead trees initially

// Clear trees, pines, and dead trees from water areas
baseLayer.treeValueMap = clearTreesFromWater(
  baseLayer.treeValueMap,
  baseLayer.waterValueMap,
);
baseLayer.pineValueMap = clearPinesFromWater(
  baseLayer.pineValueMap,
  baseLayer.waterValueMap,
);
baseLayer.deadTreeValueMap = clearDeadTreesFromWater(
  baseLayer.deadTreeValueMap,
  baseLayer.waterValueMap,
);

baseLayer.pineTileMap = generatePineTileMap(baseLayer.pineValueMap);
baseLayer.deadTreeTileMap = generateDeadTreeTileMap(baseLayer.deadTreeValueMap);

baseLayer.treeTileMap = generateTreeTileMap(baseLayer.treeValueMap);

layers.push(baseLayer);

// Debug panel for layer stack
function updateLayerDebugPanel() {
  const list = document.getElementById("layer-list");
  if (!list) return;
  list.innerHTML = "";
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const entry = document.createElement("div");
    entry.className =
      "layer-entry" + (i === strokeTargetLayerIndex ? " active" : "");

    const label = document.createElement("span");
    label.textContent = `${layer.name} (order: ${layer.order})`;
    entry.appendChild(label);

    if (i > 0) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "layer-delete-btn";
      deleteBtn.textContent = "x";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        layers.splice(i);
        strokeTargetLayerIndex = 0;
        updateLayerDebugPanel();
      });
      entry.appendChild(deleteBtn);
    }

    entry.addEventListener("click", () => {
      strokeTargetLayerIndex = i;
      updateLayerDebugPanel();
    });
    list.appendChild(entry);
  }
}
updateLayerDebugPanel();

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
  const layer = layers[strokeTargetLayerIndex];
  const result = paintCellAtPosition({
    canvas,
    currentTool,
    event,
    drawMap,
    treeValueMap: layer.treeValueMap,
    waterValueMap: layer.waterValueMap,
    cliffValueMap: layer.cliffValueMap,
    pineValueMap: layer.pineValueMap,
    deadTreeValueMap: layer.deadTreeValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
    groundTileMap: layer.groundTileMap,
  });
  layer.pineValueMap = result.pineValueMap;
  layer.deadTreeValueMap = result.deadTreeValueMap;
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

  // Paint using the stroke target layer
  const layer = layers[strokeTargetLayerIndex];
  const result = paintCellAtPosition({
    canvas,
    currentTool,
    event,
    drawMap,
    treeValueMap: layer.treeValueMap,
    waterValueMap: layer.waterValueMap,
    cliffValueMap: layer.cliffValueMap,
    pineValueMap: layer.pineValueMap,
    deadTreeValueMap: layer.deadTreeValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
    groundTileMap: layer.groundTileMap,
  });
  layer.pineValueMap = result.pineValueMap;
  layer.deadTreeValueMap = result.deadTreeValueMap;
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

  const layer = layers[strokeTargetLayerIndex];

  // Process cliffs
  layer.cliffValueMap = cleanupCliffArtifacts(layer.cliffValueMap);
  layer.cliffTileMap = generateCliffTileMap(
    layer.cliffValueMap,
    layer.cliffTileMap || [],
  );

  // Process water
  layer.waterValueMap = cleanupWaterArtifacts(layer.waterValueMap);
  layer.waterTileMap = generateWaterTileMap(
    layer.waterValueMap,
    layer.waterTileMap,
  );

  // Clear trees and water from cliff areas
  layer.treeValueMap = clearTreesFromCliffs(
    layer.treeValueMap,
    layer.cliffValueMap,
  );
  layer.waterValueMap = clearWaterFromCliffs(
    layer.waterValueMap,
    layer.cliffValueMap,
  );
  layer.waterTileMap = generateWaterTileMap(
    layer.waterValueMap,
    layer.waterTileMap,
  );

  // Clear trees based on validated water
  layer.treeValueMap = clearTreesFromWater(
    layer.treeValueMap,
    layer.waterValueMap,
  );

  // Finally process trees
  layer.treeValueMap = applyOrganicIterations(layer.treeValueMap, ITERATIONS);
  layer.treeTileMap = generateTreeTileMap(layer.treeValueMap);

  // Clear pines from incompatible terrain
  layer.pineValueMap = clearPinesFromCliffs(
    layer.pineValueMap,
    layer.cliffValueMap,
  );
  layer.pineValueMap = clearPinesFromWater(
    layer.pineValueMap,
    layer.waterValueMap,
  );

  // Process pines with organic iterations
  layer.pineValueMap = applyOrganicIterations(layer.pineValueMap, ITERATIONS);
  layer.pineTileMap = generatePineTileMap(layer.pineValueMap);

  // Clear dead trees from incompatible terrain
  layer.deadTreeValueMap = clearDeadTreesFromCliffs(
    layer.deadTreeValueMap,
    layer.cliffValueMap,
  );
  layer.deadTreeValueMap = clearDeadTreesFromWater(
    layer.deadTreeValueMap,
    layer.waterValueMap,
  );

  // Process dead trees with organic iterations
  layer.deadTreeValueMap = applyOrganicIterations(layer.deadTreeValueMap, ITERATIONS);
  layer.deadTreeTileMap = generateDeadTreeTileMap(layer.deadTreeValueMap);

  // Sync layer stack
  layers = syncLayerStack(layers, strokeTargetLayerIndex);
  updateLayerDebugPanel();

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

    const layer = layers[strokeTargetLayerIndex];
    paintCellAtPosition({
      canvas,
      currentTool,
      event: event.touches[0], // Pass touch point (has clientX/clientY)
      drawMap,
      treeValueMap: layer.treeValueMap,
      waterValueMap: layer.waterValueMap,
      cliffValueMap: layer.cliffValueMap,
      pineValueMap: layer.pineValueMap,
      deadTreeValueMap: layer.deadTreeValueMap,
      camera,
      zoom,
      paintedCellsInStroke,
      groundTileMap: layer.groundTileMap,
    });
  }
}

// Handle touch move to continue painting
function handleTouchMove(event) {
  event.preventDefault();

  if (event.touches.length === 2 && initialPinchDistance !== null) {
    // Two fingers: handle pinch zoom and pan
    const currentDistance = getTouchDistance(
      event.touches[0],
      event.touches[1],
    );
    const currentMidpoint = getTouchMidpoint(
      event.touches[0],
      event.touches[1],
    );

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

  const layer = layers[strokeTargetLayerIndex];
  paintCellAtPosition({
    canvas,
    currentTool,
    event: event.touches[0],
    drawMap,
    treeValueMap: layer.treeValueMap,
    waterValueMap: layer.waterValueMap,
    cliffValueMap: layer.cliffValueMap,
    pineValueMap: layer.pineValueMap,
    deadTreeValueMap: layer.deadTreeValueMap,
    camera,
    zoom,
    paintedCellsInStroke,
    groundTileMap: layer.groundTileMap,
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

// Seed controls
const seedInput = document.getElementById("seed-input");
const newSeedButton = document.getElementById("new-seed-button");

function regenerateMap(newSeed) {
  setSeed(newSeed);
  seedInput.value = newSeed;

  drawMap = generateDrawMap();

  const baseLayer = createLayer("layer-0", "Base Layer", 0);
  baseLayer.groundTileMap = generateGroundTileMap();
  baseLayer.treeValueMap = applyOrganicIterations(
    generateNoiseMap(MAP_SIZE),
    10,
  );
  baseLayer.waterValueMap = generateWaterValueMap();
  baseLayer.waterValueMap = cleanupWaterArtifacts(baseLayer.waterValueMap);
  baseLayer.waterTileMap = generateWaterTileMap(
    baseLayer.waterValueMap,
    baseLayer.waterTileMap,
  );
  baseLayer.cliffValueMap = generateCliffValueMap();
  baseLayer.cliffTileMap = generateCliffTileMap(
    baseLayer.cliffValueMap,
    baseLayer.cliffTileMap || [],
  );
  baseLayer.pineValueMap = generateEmptyValueMap(MAP_SIZE, 1); // All 1s = no pines initially
  baseLayer.deadTreeValueMap = generateEmptyValueMap(MAP_SIZE, 1); // All 1s = no dead trees initially

  // Clear trees, pines, and dead trees from water areas
  baseLayer.treeValueMap = clearTreesFromWater(
    baseLayer.treeValueMap,
    baseLayer.waterValueMap,
  );
  baseLayer.pineValueMap = clearPinesFromWater(
    baseLayer.pineValueMap,
    baseLayer.waterValueMap,
  );
  baseLayer.deadTreeValueMap = clearDeadTreesFromWater(
    baseLayer.deadTreeValueMap,
    baseLayer.waterValueMap,
  );

  baseLayer.pineTileMap = generatePineTileMap(baseLayer.pineValueMap);
  baseLayer.deadTreeTileMap = generateDeadTreeTileMap(baseLayer.deadTreeValueMap);
  baseLayer.treeTileMap = generateTreeTileMap(baseLayer.treeValueMap);

  layers = [baseLayer];
  activeLayerIndex = 0;
  strokeTargetLayerIndex = 0;
  updateLayerDebugPanel();
}

newSeedButton.addEventListener("click", () => {
  const newSeed = Math.floor(Math.random() * 10000000);
  regenerateMap(newSeed);
});

seedInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const newSeed = parseInt(seedInput.value, 10);
    if (!isNaN(newSeed)) {
      regenerateMap(newSeed);
    }
  }
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
  render(
    layers,
    drawMap,
    ctx,
    BOX_SIZE,
    numberSprite,
    tileMapSprite,
    camera,
    zoom,
    cursorPreviewCells,
  );

  requestAnimationFrame(animate);
}

// Note: animate() is now called from numberSprite.onload instead of immediately
