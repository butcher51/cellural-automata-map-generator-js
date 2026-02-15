/**
 * Finds and preserves only 3x5 blocks in the given value map.
 *
 * What it does:
 * - Scans the entire map for all possible 3x5 positions
 * - Marks cells that are part of valid 3x5 blocks (all 15 cells have value: 1)
 * - Returns a new map with only marked cells preserved (value: 1), others set to value: 0
 * - First valid block at each position gets marked, overlapping candidates are skipped
 */

/**
 * Checks if a complete 3x5 block of value-1 cells exists at the given position
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate (top-left of 3x5 block)
 * @param {number} startY - Starting Y coordinate (top-left of 3x5 block)
 * @returns {boolean} True if all 15 cells in the 3x5 area have value: 1
 */
function has3x5BlockAt(tileMap, startX, startY) {
  const height = tileMap.length;
  const width = tileMap[0].length;

  // Check bounds
  if (startX + 2 >= width || startY + 4 >= height) {
    return false;
  }

  // Check all 15 cells have value: 1
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      if (tileMap[startY + dy][startX + dx].value !== 1) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Checks if the 3x5 block has a small overlap (1-2 cells) with already marked blocks
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @returns {boolean} True if exactly 1 or 2 cells overlap (prevents marking).
 *                    False if 0 or 3+ cells overlap (allows marking for dense packing)
 */
function hasOverlapWithMarkedCells(tileMap, startX, startY) {
  let overlapCount = 0;

  // Count overlapping cells
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      if (tileMap[startY + dy][startX + dx].partOf3x5 === true) {
        overlapCount++;
      }
    }
  }

  // Return true only if exactly 1 or 2 cells overlap
  // This prevents small overlaps but allows heavy overlaps (dense packing)
  return overlapCount === 1 || overlapCount === 2;
}

/**
 * Marks all 15 cells in a 3x5 block with partOf3x5: true
 * @param {Array<Array<Object>>} tileMap - 2D tile map
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 */
function mark3x5Block(tileMap, startX, startY) {
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      tileMap[startY + dy][startX + dx].partOf3x5 = true;
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
  const filteredMap = Array.from({ length: height }, () => Array.from({ length: width }, () => ({ value: 0, tile: 0 })));

  // Copy marked cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tileMap[y][x].partOf3x5 === true) {
        // Preserve extra properties, set value: 1, remove partOf3x5 flag
        const { partOf3x5, ...otherProps } = tileMap[y][x];
        filteredMap[y][x] = { ...otherProps, value: 1 };
      }
    }
  }

  return filteredMap;
}

/**
 * Finds and preserves only 3x5 blocks in the value map.
 *
 * Algorithm:
 * - Pass 1: Scan all possible 3x5 positions and mark valid blocks
 * - Pass 2: Filter map to only include marked cells
 *
 * @param {Array<Array<Object>>} valueMap - 2D array of cells with {value, tile, ...}
 * @returns {Array<Array<Object>>} New map with same dimensions, only 3x5 blocks preserved
 */
export function findThreeByFiveGroups(valueMap) {
  // Input validation
  if (!valueMap) {
    return valueMap; // Return null/undefined as-is
  }

  if (valueMap.length === 0) {
    return valueMap; // Return empty array as-is
  }

  if (valueMap[0].length === 0) {
    return valueMap; // No columns
  }

  const height = valueMap.length;
  const width = valueMap[0].length;

  // Deep copy to avoid mutation
  const markedMap = valueMap.map((row) => row.map((cell) => ({ ...cell })));

  // PASS 1: Scan and mark 3x5 blocks
  for (let y = 0; y <= height - 5; y++) {
    for (let x = 0; x <= width - 3; x++) {
      // Check validity and mark if overlap is not 1-2 cells
      if (has3x5BlockAt(markedMap, x, y) && !hasOverlapWithMarkedCells(markedMap, x, y)) {
        mark3x5Block(markedMap, x, y);
      }
    }
  }

  // PASS 2: Filter to marked cells
  const filteredMap = filterMapToMarkedCells(markedMap, height, width);

  return filteredMap;
}
