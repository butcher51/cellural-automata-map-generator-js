import { setCellValue } from "./map-utils.js";

/**
 * Paints a line of cells onto value maps.
 * Sets lineTileValueMap to 1 with lineTileType metadata at each cell.
 * Clears conflicting terrain (water, cliff, trees, pines, dead trees).
 * @param {Array<{x: number, y: number}>} cells - Array of cells to paint
 * @param {number} lineTileType - The lineTile type (1-4)
 * @param {object} maps - Object containing all value maps and groundTileMap
 * @returns {object} Updated maps
 */
export function paintLineTileLine(cells, lineTileType, maps) {
  let {
    lineTileValueMap,
    treeValueMap,
    pineValueMap,
    deadTreeValueMap,
    waterValueMap,
    cliffValueMap,
    groundTileMap,
  } = maps;

  const mapSize = lineTileValueMap.length;

  for (const cell of cells) {
    const { x, y } = cell;

    // Skip out-of-bounds
    if (x < 0 || x >= mapSize || y < 0 || y >= mapSize) continue;

    // Skip null ground
    if (groundTileMap && groundTileMap[y]?.[x] == null) continue;

    // Set lineTile
    lineTileValueMap = setCellValue(lineTileValueMap, x, y, 1);
    lineTileValueMap[y][x].lineTileType = lineTileType;

    // Clear conflicting terrain
    waterValueMap = setCellValue(waterValueMap, x, y, 0);
    cliffValueMap = setCellValue(cliffValueMap, x, y, 0);
    treeValueMap = setCellValue(treeValueMap, x, y, 1);
    pineValueMap = setCellValue(pineValueMap, x, y, 1);
    deadTreeValueMap = setCellValue(deadTreeValueMap, x, y, 1);
  }

  return {
    lineTileValueMap,
    treeValueMap,
    pineValueMap,
    deadTreeValueMap,
    waterValueMap,
    cliffValueMap,
  };
}
