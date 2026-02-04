import { MAP_SIZE } from "./constants.js";

export function generateWaterValueMap() {
  const map = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      map[y][x] = { tile: 0, value: 0 };
    }
  }
  return map;
}
