import { isIslandBorderCell } from "./map-utils.js";

/**
 * Returns true if any diagonal neighbor of (x, y) is non-cliff (value !== 1) or out of bounds.
 * Used to exclude inside corner cells from being considered interior.
 */
function hasNonCliffDiagonal(cliffValueMap, x, y) {
  const height = cliffValueMap.length;
  const width = cliffValueMap[0].length;
  const diagonals = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dx, dy] of diagonals) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height || cliffValueMap[ny][nx].value !== 1) {
      return true;
    }
  }
  return false;
}

/**
 * Returns positions of cliff interior cells (value === 1 and NOT a border cell).
 * Interior cells have all 8 neighbors (4 cardinal + 4 diagonal) also being cliff cells
 * and are not at map edge. This ensures inside corner cliff tiles are not covered
 * by upper layer ground tiles.
 * @param {Array} cliffValueMap - 2D array of {value: 0|1} cells
 * @returns {Array<{x: number, y: number}>} Array of interior cell positions
 */
export function getCliffInteriorCells(cliffValueMap) {
  if (!cliffValueMap || cliffValueMap.length === 0) {
    return [];
  }

  const height = cliffValueMap.length;
  const width = cliffValueMap[0]?.length || 0;
  const interiorCells = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cliffValueMap[y][x].value === 1 && !isIslandBorderCell(cliffValueMap, x, y) && !hasNonCliffDiagonal(cliffValueMap, x, y)) {
        interiorCells.push({ x, y });
      }
    }
  }

  return interiorCells;
}
