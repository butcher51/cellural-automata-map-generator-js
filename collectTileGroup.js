/**
 *
 * It will collect the tile group, which is a group of tiles with the same value and are connected to each other.
 * Corner connection is not allowed, only horizontal and vertical connection is allowed.
 *
 * Example
 * Input:
 * [
 *  [ { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 } ],
 *  [ { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 } ],
 *  [ { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 } ],
 *  [ { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 } ]
 * ]
 *
 * Output:
 * [
 *   [
 *     [ { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 } ],
 *     [ { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 } ],
 *     [ { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 } ],
 *     [ { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 } ]
 *   ],
 *   [
 *     [ { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 } ],
 *     [ { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 } ],
 *     [ { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 } ],
 *     [ { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 } ]
 *   ],
 * ]
 *
 * @param {*} tileMap 2d array, contain object { value: 0|1 }
 * @returns
 */
/**
 * Checks if coordinates are within map bounds
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if valid
 */
function isValidCell(tileMap, x, y) {
  return y >= 0 && y < tileMap.length && x >= 0 && x < tileMap[0].length;
}

/**
 * Gets the 4 cardinal neighbor coordinates
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Array<{x: number, y: number}>} Array of 4 neighbor coordinates
 */
function getCardinalNeighbors(x, y) {
  return [
    { x, y: y - 1 }, // up
    { x, y: y + 1 }, // down
    { x: x - 1, y }, // left
    { x: x + 1, y }  // right
  ];
}

/**
 * Performs BFS flood-fill from a starting point to collect all connected value-1 tiles
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {Set<string>} globalVisited - Set of visited cell keys
 * @returns {Array<{x: number, y: number}>} Array of coordinates in the region
 */
function floodFillRegion(tileMap, startX, startY, globalVisited) {
  const regionCoords = [];
  const queue = [[startX, startY]];
  const localVisited = new Set();

  const key = `${startX},${startY}`;
  localVisited.add(key);
  globalVisited.add(key);

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    regionCoords.push({ x, y });

    const neighbors = getCardinalNeighbors(x, y);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      if (localVisited.has(neighborKey)) {
        continue;
      }

      if (!isValidCell(tileMap, neighbor.x, neighbor.y)) {
        continue;
      }

      if (tileMap[neighbor.y][neighbor.x].value !== 1) {
        continue;
      }

      localVisited.add(neighborKey);
      globalVisited.add(neighborKey);
      queue.push([neighbor.x, neighbor.y]);
    }
  }

  return regionCoords;
}

/**
 * Creates a group map with only the specified region visible
 * @param {Array<Array<Object>>} tileMap - Original 2D tile map
 * @param {Array<{x: number, y: number}>} regionCoords - Coordinates of cells in the region
 * @returns {Array<Array<Object>>} New 2D map with only the region
 */
function createGroupMap(tileMap, regionCoords) {
  const height = tileMap.length;
  const width = tileMap[0].length;

  // Create map filled with {value: 0}
  const groupMap = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ value: 0 }))
  );

  // Copy cells from original map for region coordinates
  for (const { x, y } of regionCoords) {
    groupMap[y][x] = { ...tileMap[y][x] };
  }

  return groupMap;
}

export function collectTileGroup(tileMap) {
  if (!tileMap || tileMap.length === 0) {
    return [];
  }

  // Check for empty columns
  if (tileMap[0].length === 0) {
    return [];
  }

  const height = tileMap.length;
  const width = tileMap[0].length;
  const globalVisited = new Set();
  const groups = [];

  // Scan map in row-major order
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;

      // Skip if already visited or not value-1
      if (globalVisited.has(key) || tileMap[y][x].value !== 1) {
        continue;
      }

      // Found unvisited value-1 cell, start flood-fill
      const regionCoords = floodFillRegion(tileMap, x, y, globalVisited);

      // Create group map for this region
      const groupMap = createGroupMap(tileMap, regionCoords);
      groups.push(groupMap);
    }
  }

  return groups;
}
