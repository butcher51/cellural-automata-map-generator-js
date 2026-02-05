import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { isIslandBorderCell } from "./map-utils.js";

const ISLAND_BORDER_TILE = 75;
const ISLAND_INTERIOR_TILE = 847;

export function generateWaterTileMap(valueMap) {
  const tileMap = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      if (valueMap[y][x].value === 1) {
        const tile = isIslandBorderCell(valueMap, x, y)
          ? ISLAND_BORDER_TILE
          : ISLAND_INTERIOR_TILE;
        tileMap[y][x] = {
          tile: 1,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
