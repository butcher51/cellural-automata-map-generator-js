/**
 * Finds and preserves only 3x3 blocks in the given water value map.
 *
 * What it does:
 * - Scans the entire map for all possible 3x3 positions
 * - Marks cells that are part of valid 3x3 blocks (all 9 cells have value: 1)
 * - Returns a new map with only marked cells preserved (value: 1), others set to value: 0
 * - First valid block at each position gets marked, overlapping candidates are skipped
 */

/**
 * Checks if a complete 3x3 block of value-1 cells exists at the given position
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate (top-left of 3x3 block)
 * @param {number} startY - Starting Y coordinate (top-left of 3x3 block)
 * @returns {boolean} True if all 9 cells in the 3x3 area have value: 1
 */
function has3x3BlockAt(tileMap, startX, startY) {
  const height = tileMap.length;
  const width = tileMap[0].length;

  // Check bounds
  if (startX + 2 >= width || startY + 2 >= height) {
    return false;
  }

  // Check all 9 cells have value: 1
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      if (tileMap[startY + dy][startX + dx].value !== 1) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Checks if any cells in the 3x3 block are already marked
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @returns {boolean} True if any cell has partOf3x3: true
 */
function hasOverlapWithMarkedCells(tileMap, startX, startY) {
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      if (tileMap[startY + dy][startX + dx].partOf3x3 === true) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Marks all 9 cells in a 3x3 block with partOf3x3: true
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 */
function mark3x3Block(tileMap, startX, startY) {
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      tileMap[startY + dy][startX + dx].partOf3x3 = true;
    }
  }
}

/**
 * Creates a filtered map containing only marked cells
 * @param {Array<Array<Object>>} tileMap - 2D tile map with marked cells
 * @param {number} height - Map height
 * @param {number} width - Map width
 * @returns {Array<Array<Object>>} New map with only marked cells (value: 1), others (value: 0, tile: 0)
 */
function filterMapToMarkedCells(tileMap, height, width) {
  // Create map filled with {value: 0, tile: 0}
  const filteredMap = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ value: 0, tile: 0 }))
  );

  // Copy marked cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tileMap[y][x].partOf3x3 === true) {
        // Preserve extra properties, set value: 1, remove partOf3x3 flag
        const { partOf3x3, ...otherProps } = tileMap[y][x];
        filteredMap[y][x] = { ...otherProps, value: 1 };
      }
    }
  }

  return filteredMap;
}

/**
 * Finds and preserves only 3x3 blocks in the water value map.
 *
 * Algorithm:
 * - Pass 1: Scan all possible 3x3 positions and mark valid blocks
 * - Pass 2: Filter map to only include marked cells
 *
 * @param {Array<Array<Object>>} waterValueMap - 2D array of cells with {value, tile, ...}
 * @returns {Array<Array<Object>>} New map with same dimensions, only 3x3 blocks preserved
 */
export function findThreeByThreeGroups(waterValueMap) {
  // Input validation
  if (!waterValueMap) {
    return waterValueMap; // Return null/undefined as-is
  }

  if (waterValueMap.length === 0) {
    return waterValueMap; // Return empty array as-is
  }

  if (waterValueMap[0].length === 0) {
    return waterValueMap; // No columns
  }

  const height = waterValueMap.length;
  const width = waterValueMap[0].length;

  // Deep copy to avoid mutation
  const markedMap = waterValueMap.map(row =>
    row.map(cell => ({ ...cell }))
  );

  // PASS 1: Scan and mark 3x3 blocks
  for (let y = 0; y <= height - 3; y++) {
    for (let x = 0; x <= width - 3; x++) {
      // Check validity and mark if no overlap
      if (has3x3BlockAt(markedMap, x, y) &&
          !hasOverlapWithMarkedCells(markedMap, x, y)) {
        mark3x3Block(markedMap, x, y);
      }
    }
  }

  // PASS 2: Filter to marked cells
  const filteredMap = filterMapToMarkedCells(markedMap, height, width);

  return filteredMap;
}
