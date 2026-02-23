import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { sumNeighborValues } from "./sumNeighborValues.js";

export function getDominantFoliageType(valueMap, x, y, typeProperty, defaultType) {
  const counts = {};
  const neighbors = [
    [x - 1, y - 1],
    [x, y - 1],
    [x - 1, y],
    [x, y],
  ];

  for (const [nx, ny] of neighbors) {
    let type = defaultType;
    if (ny >= 0 && ny < valueMap.length && nx >= 0 && nx < (valueMap[ny]?.length || 0)) {
      type = valueMap[ny][nx][typeProperty] || defaultType;
    }
    counts[type] = (counts[type] || 0) + 1;
  }

  let dominant = defaultType;
  let maxCount = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = Number(type);
    }
  }

  return dominant;
}

export function generateFoliageTileMap(valueMap, config) {
  const { tiles, defaultType, typeProperty, isBottomRight, isBottomLeft } = config;
  const tileMap = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    const start = y % 2 === 0 ? 0 : 1;
    for (let x = start; x < MAP_SIZE; x += 2) {
      const sum = sumNeighborValues(valueMap, x, y);
      const dominantType = getDominantFoliageType(valueMap, x, y, typeProperty, defaultType);
      const typeTiles = tiles[dominantType] || tiles[defaultType];

      if (sum > 3) {
        if (y > 0 && x > 0) {
          tileMap[y - 1][x - 1] = {
            sum,
            tile: isBottomRight(tileMap[y - 1][x - 1]?.tile) ? typeTiles.topLeftAdjacent : typeTiles.topLeft,
          };
        }
        if (y > 0 && x < MAP_SIZE) {
          tileMap[y - 1][x] = {
            sum,
            tile: isBottomLeft(tileMap[y - 1][x]?.tile) ? typeTiles.topRightAdjacent : typeTiles.topRight,
          };
        }
        if (x > 0) {
          tileMap[y][x - 1] = { sum, tile: typeTiles.bottomLeft };
        }
        if (x < MAP_SIZE) {
          tileMap[y][x] = { sum, tile: typeTiles.bottomRight };
        }
      } else {
        if (y > 0 && x > 0) {
          tileMap[y - 1][x - 1] = {
            sum,
            tile: tileMap[y - 1][x - 1]?.tile || 0,
          };
        }
        if (y > 0 && x < MAP_SIZE) {
          tileMap[y - 1][x] = { sum, tile: tileMap[y - 1][x]?.tile || 0 };
        }
        if (x > 0) {
          tileMap[y][x - 1] = { sum, tile: tileMap[y][x - 1]?.tile || 0 };
        }
        if (x < MAP_SIZE) {
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
        tileMap[y][x].spritePosition = getTileSpritePosition(tileMap[y][x].tile);
      }
    }
  }

  return tileMap;
}
