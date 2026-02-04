import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";

// tree tiles:  4854, 4855
//              4878, 4879

export function generateTreeTileMap(valueMap) {
  const tileMap = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    const start = y % 2 === 0 ? 0 : 1;
    for (let x = start; x < MAP_SIZE; x += 2) {
      const sum = sumNeighborValues(valueMap, x, y);

      if (sum > 2) {
        if (y > 0 && x > 0) {
          tileMap[y - 1][x - 1] = {
            sum,
            tile: tileMap[y - 1][x - 1].tile === 1250 ? 1282 : 1225,
          };
        }
        if (y > 0 && x < MAP_SIZE - 1) {
          tileMap[y - 1][x] = {
            sum,
            tile: tileMap[y - 1][x].tile === 1249 ? 1283 : 1226,
          };
        }
        if (x > 0) {
          tileMap[y][x - 1] = { sum, tile: 1249 };
        }
        if (x < MAP_SIZE - 1) {
          tileMap[y][x] = { sum, tile: 1250 };
        }
      } else {
        if (y > 0 && x > 0) {
          tileMap[y - 1][x - 1] = {
            sum,
            tile: tileMap[y - 1][x - 1]?.tile || 0,
          };
        }
        if (y > 0 && x < MAP_SIZE - 1) {
          tileMap[y - 1][x] = { sum, tile: tileMap[y - 1][x]?.tile || 0 };
        }
        if (x > 0) {
          tileMap[y][x - 1] = { sum, tile: tileMap[y][x - 1]?.tile || 0 };
        }
        if (x < MAP_SIZE - 1) {
          tileMap[y][x] = { sum, tile: tileMap[y][x]?.tile || 0 };
        }
      }
    }
  }

  for (let y = 0; y < MAP_SIZE; y++) {
    if (!tileMap[y]) {
      continue;
    }
    for (let x = 0; x < MAP_SIZE; x++) {
      if (tileMap[y][x]) {
        tileMap[y][x].spritePosition = getTileSpritePosition(
          tileMap[y][x].tile,
        );
      }
    }
  }

  return tileMap;
}

function sumNeighborValues(valueMap, x, y) {
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
  if (y > 0 && x < MAP_SIZE - 1) {
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
  if (x < MAP_SIZE - 1) {
    value = valueMap[y][x].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  return sum;
}
