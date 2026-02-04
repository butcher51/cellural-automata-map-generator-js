import { MAP_SIZE } from "./constants.js";

export function generateDrawMap() {
  const map = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      map[y][x] = false;
    }
  }
  return map;
}
