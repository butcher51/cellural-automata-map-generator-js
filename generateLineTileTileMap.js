import { LINE_TILE_TILES } from "./lineTileTileConstants.js";
import { getLineTileShape } from "./getLineTileShape.js";

/**
 * Converts a lineTileValueMap to a tile map for rendering.
 * Where value === 1: produces { tile: lineTileType, isLineTile: true, spritePosition }
 * Where value === 0: produces { tile: 0, spritePosition: null }
 * @param {Array} lineTileValueMap - 2D array of { value, lineTileType? } cells
 * @returns {Array} 2D tile map
 */
export function generateLineTileTileMap(lineTileValueMap) {
  const height = lineTileValueMap.length;
  const width = lineTileValueMap[0]?.length || 0;
  const tileMap = [];

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      const cell = lineTileValueMap[y][x];
      if (cell.value === 1) {
        const type = cell.lineTileType || 1;
        const shape = getLineTileShape(lineTileValueMap, x, y);
        const tileData = LINE_TILE_TILES[type]?.[shape];
        tileMap[y][x] = {
          tile: type,
          isLineTile: true,
          spritePosition: tileData?.spritePosition || null,
        };
      } else {
        tileMap[y][x] = {
          tile: 0,
          spritePosition: null,
        };
      }
    }
  }

  return tileMap;
}
