// Pure utility functions for map generation
import { FLOOR_TO_WALL_THRESHOLD, WALL_SURVIVAL_THRESHOLD } from "./constants.js";

// Create a deep copy of a 2D map array
// Returns a new map with independent cell objects (no shared references)
export function deepCopyMap(map) {
  return map.map(row => row.map(cell => ({ ...cell })));
}

// Convert pixel coordinates to grid coordinates
// Returns the grid cell {x, y} that contains the pixel
export function pixelToGridCoordinate(pixelX, pixelY, boxSize) {
  return {
    x: Math.floor(pixelX / boxSize),
    y: Math.floor(pixelY / boxSize),
  };
}

// Get all cells that should be painted for a given brush size
// Returns array of {x, y} coordinates within brush area and map bounds
// brushSize: 1 = single cell, 2 = 2x2 area, 3 = 3x3 area, etc.
// Brush is centered on (centerX, centerY)
export function getCellsInBrushArea(centerX, centerY, brushSize, mapSize) {
  const cells = [];
  const halfBrush = Math.floor(brushSize / 2);

  // Calculate brush boundaries
  const startX = centerX - halfBrush;
  const startY = centerY - halfBrush;
  const endX = startX + brushSize;
  const endY = startY + brushSize;

  // Iterate through brush area and collect valid cells
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      // Only include cells within map bounds
      if (x >= 0 && x < mapSize && y >= 0 && y < mapSize) {
        cells.push({ x, y });
      }
    }
  }

  return cells;
}

// Toggle cell value (0→1, 1→0) at given coordinates
// Sets isBeingDrawn flag to true to indicate cell is being actively drawn
// Returns a new map (immutable operation)
export function toggleCellValue(map, x, y) {
  // Validate bounds
  if (!map || map.length === 0) {
    return map;
  }
  if (y < 0 || y >= map.length) {
    return map;
  }
  if (x < 0 || !map[y] || x >= map[y].length) {
    return map;
  }

  // Deep copy the map
  const newMap = deepCopyMap(map);

  // Toggle the value and mark as being drawn
  newMap[y][x].value = newMap[y][x].value === 0 ? 1 : 0;
  newMap[y][x].isBeingDrawn = true;

  return newMap;
}

// Set cell to specific value (0 or 1) at given coordinates
// Sets isBeingDrawn flag to true to indicate cell is being actively drawn
// Returns a new map (immutable operation)
export function setCellValue(map, x, y, value) {
  // Validate bounds
  if (!map || map.length === 0) {
    return map;
  }
  if (y < 0 || y >= map.length) {
    return map;
  }
  if (x < 0 || !map[y] || x >= map[y].length) {
    return map;
  }

  // Validate value (must be 0 or 1)
  if (value !== 0 && value !== 1) {
    return map;
  }

  // Deep copy the map
  const newMap = deepCopyMap(map);

  // Set the value and mark as being drawn
  newMap[y][x].value = value;
  newMap[y][x].isBeingDrawn = true;

  return newMap;
}

// Apply N iterations of cellular automaton to existing map
// Clears all isBeingDrawn flags after iterations complete
// Returns a new map with iterations applied (immutable operation)
export function applyOrganicIterations(map, iterations) {
  const currentMap = deepCopyMap(map);

  // Run N iterations of: calculate friends → apply cave rules
  for (let i = 0; i < iterations; i++) {
    calculateAllFriendCounts(currentMap);
    applyCaveRules(currentMap);
  }

  // Clear all drawing flags
  for (let y = 0; y < currentMap.length; y++) {
    for (let x = 0; x < currentMap[y].length; x++) {
      currentMap[y][x].isBeingDrawn = false;
    }
  }


  // Final friend count calculation for rendering
  calculateAllFriendCounts(currentMap);

  return currentMap;
}

// Generate a 2D array of cell objects
// Each cell is an object with a value property (0 or 1) and isBeingDrawn flag (false)
export function generateNoiseMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = {
        value: Math.floor(Math.random() * 2),
        isBeingDrawn: false,
      };
    }
  }
  return map;
}

// Get the background color for a cell based on its friend count
// Used to visualize neighbor density during cave generation
// Red (0-3 neighbors): Likely to become/stay floor
// Green (4+ neighbors): Likely to become/stay wall
export function getCellColor(cell) {
  // Handle invalid cells
  if (!cell || typeof cell !== "object" || cell.friendCount === undefined) {
    return "#000000";
  }

  const friendCount = cell.friendCount;

  // Floor cells (less than WALL_SURVIVAL_THRESHOLD neighbors): Red
  // Wall cells (WALL_SURVIVAL_THRESHOLD or more neighbors): Green
  if (friendCount < WALL_SURVIVAL_THRESHOLD) {
    return "#aa0000"; // Red
  } else {
    return "#00aa00"; // Green
  }
}

// Get the color for a cell based on drawing state and friend count
// When isBeingDrawn is true: returns simple black/white based on value
// When isBeingDrawn is false: returns red/green based on friendCount (neighbor density)
export function getCellColorWithDrawingState(cell) {
  // Handle invalid cells
  if (!cell || typeof cell !== "object") {
    return "#000000";
  }

  // If cell is being drawn, show simple black/white colors
  if (cell.isBeingDrawn === true) {
    return cell.value === 0 ? "#000000" : "#ffffff";
  }

  // Otherwise, use neighbor-based colors (defaults to this if isBeingDrawn is missing/false)
  // Handle missing friendCount
  if (cell.friendCount === undefined) {
    return "#000000";
  }

  // Red (sparse): friendCount < 4
  // Green (dense): friendCount >= 4
  return cell.value !== 1 ? "#aa0000" : "#00aa00";
}

// Count the number of neighboring cells with value 1 for a single cell
// Checks all 8 directions (orthogonal + diagonal)
// Returns 0-8 based on neighbors with value === 1
export function countNeighborFriends(map, x, y) {
  // Validate inputs
  if (!map || map.length === 0) {
    return 0;
  }
  if (y < 0 || y >= map.length) {
    return 0;
  }
  if (x < 0 || !map[y] || x >= map[y].length) {
    return 0;
  }

  // 8 neighbor directions (excluding center [0,0])
  const directions = [
    [-1, -1], [0, -1], [1, -1],  // Top row
    [-1,  0],          [1,  0],  // Middle row
    [-1,  1], [0,  1], [1,  1],   // Bottom row
  ];

  let count = 0;

  for (const [dx, dy] of directions) {
    const neighborY = y + dy;
    const neighborX = x + dx;

    // Check bounds
    if (neighborY >= 0 && neighborY < map.length &&
            neighborX >= 0 && neighborX < map[neighborY].length) {
      const neighbor = map[neighborY][neighborX];
      if (neighbor && neighbor.value === 1) {
        count++;
      }
    }
  }

  return count;
}

// Process entire map and add friendCount property to each cell
// Mutates the map in-place by adding friendCount to each cell object
export function calculateAllFriendCounts(map) {
  if (!map || map.length === 0) {
    return;
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].friendCount = countNeighborFriends(map, x, y);
    }
  }
}

// Apply cave generation rules based on current cell state
// Walls (value = 1): survive if they have >= WALL_SURVIVAL_THRESHOLD wall neighbors
// Floors (value = 0): become walls if they have >= FLOOR_TO_WALL_THRESHOLD wall neighbors
// Otherwise: cells become floors (0)
// Mutates the map in-place, requires friendCount to be pre-calculated
export function applyCaveRules(map) {
  if (!map || map.length === 0) {
    return;
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      if (cell && cell.friendCount !== undefined) {
        // Apply different threshold based on current cell state
        const threshold = cell.value === 1
          ? WALL_SURVIVAL_THRESHOLD
          : FLOOR_TO_WALL_THRESHOLD;

        cell.value = cell.friendCount >= threshold ? 1 : 0;
      }
    }
  }
}

// Generate a cave map using iterative cellular automaton
// iterations: number of generation cycles to run (0 = just random generation)
export function generateOrganicMap(size, iterations) {
  // Start with random map
  const initialMap = generateNoiseMap(size);

  // Apply organic iterations to the initial random map
  return applyOrganicIterations(initialMap, iterations);
}

// Update camera position based on pressed keys
// Returns new camera position { x, y }
export function updateCamera(camera, keys, speed, zoom) {
  let x = camera.x;
  let y = camera.y;
  const adjustedSpeed = speed * zoom;

  if (keys.w || keys.W) {
    y -= adjustedSpeed;
  }
  if (keys.s || keys.S) {
    y += adjustedSpeed;
  }
  if (keys.a || keys.A) {
    x -= adjustedSpeed;
  }
  if (keys.d || keys.D) {
    x += adjustedSpeed;
  }

  return { x, y };
}

// Clamp camera to map boundaries
// Returns clamped camera position { x, y }
export function clampCamera(camera, mapSize, boxSize, zoom, viewportWidth, viewportHeight) {
  const worldWidth = mapSize * boxSize * zoom;
  const worldHeight = mapSize * boxSize * zoom;

  const maxX = Math.max(0, worldWidth - viewportWidth);
  const maxY = Math.max(0, worldHeight - viewportHeight);

  return {
    x: Math.max(0, Math.min(camera.x, maxX)),
    y: Math.max(0, Math.min(camera.y, maxY)),
  };
}
