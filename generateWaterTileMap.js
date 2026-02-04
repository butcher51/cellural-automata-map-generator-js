import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";

export function generateWaterTileMap(valueMap) {
  const tileMap = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      if (valueMap[y][x].value === 1) {
        tileMap[y][x] = { tile: 1, spritePosition: getTileSpritePosition(847) };
      }
    }
  }
  return tileMap;
}
