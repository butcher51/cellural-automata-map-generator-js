import { MAP_SIZE } from "./constants.js";

export function generateCliffValueMap() {
  let map = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      map[y][x] = { tile: 0, value: 0 };
    }
  }

  // addT(map, 10, 10);

  return map;
}

function addT(map, x, y) {
  // T-shape pattern: 12 tiles wide, 7 tiles tall
  const tPattern = [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ];

  for (let row = 0; row < tPattern.length; row++) {
    for (let col = 0; col < tPattern[row].length; col++) {
      const currentY = y + row;
      const currentX = x + col;
      map[currentY][currentX] = { tile: 0, value: tPattern[row][col] };
    }
  }

  return map;
}
