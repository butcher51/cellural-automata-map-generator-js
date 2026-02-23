import { MAP_SIZE } from "./constants.js";

export function sumNeighborValues(valueMap, x, y) {
  let sum = 0,
    value = 0;

  // top-left
  if (y > 0 && x > 0) {
    value = valueMap[y - 1][x - 1].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  // top-right
  if (y > 0 && x < MAP_SIZE) {
    value = valueMap[y - 1][x].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  // bottom-left
  if (x > 0) {
    value = valueMap[y][x - 1].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  // bottom-right
  if (x < MAP_SIZE) {
    value = valueMap[y][x].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  return sum;
}
