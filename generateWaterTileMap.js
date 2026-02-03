import { MAP_SIZE } from "./constants.js";

export function generateWaterTileMap(valueMap) {
  const tileMap = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      tileMap[y][x] = { tile: 0, spritePosition: { spriteX: 0, spriteY: 0 } };
    }
  }
  return tileMap;
}
