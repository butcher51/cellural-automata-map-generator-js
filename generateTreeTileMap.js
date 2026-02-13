import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { TREE_TILES, DEFAULT_TREE_TYPE } from "./treeTileConstants.js";
import { isBottomRightTreeTile, isBottomLeftTreeTile } from "./isBottomTreeTile.js";

/**
 * Returns the most common treeType in the 2x2 neighborhood at (x, y).
 * The neighborhood is: (x-1, y-1), (x, y-1), (x-1, y), (x, y).
 * Cells without treeType or out-of-bounds default to DEFAULT_TREE_TYPE.
 */
export function getDominantTreeType(valueMap, x, y) {
  const counts = {};
  const neighbors = [
    [x - 1, y - 1],
    [x, y - 1],
    [x - 1, y],
    [x, y],
  ];

  for (const [nx, ny] of neighbors) {
    let type = DEFAULT_TREE_TYPE;
    if (ny >= 0 && ny < valueMap.length && nx >= 0 && nx < (valueMap[ny]?.length || 0)) {
      type = valueMap[ny][nx].treeType || DEFAULT_TREE_TYPE;
    }
    counts[type] = (counts[type] || 0) + 1;
  }

  let dominant = DEFAULT_TREE_TYPE;
  let maxCount = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = Number(type);
    }
  }

  return dominant;
}

export function generateTreeTileMap(valueMap) {
  const tileMap = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    const start = y % 2 === 0 ? 0 : 1;
    for (let x = start; x < MAP_SIZE; x += 2) {
      const sum = sumNeighborValues(valueMap, x, y);
      const dominantType = getDominantTreeType(valueMap, x, y);
      const tiles = TREE_TILES[dominantType] || TREE_TILES[DEFAULT_TREE_TYPE];

      if (sum > 3) {
        if (y > 0 && x > 0) {
          tileMap[y - 1][x - 1] = {
            sum,
            tile: isBottomRightTreeTile(tileMap[y - 1][x - 1]?.tile) ? tiles.topLeftAdjacent : tiles.topLeft,
          };
        }
        if (y > 0 && x < MAP_SIZE) {
          tileMap[y - 1][x] = {
            sum,
            tile: isBottomLeftTreeTile(tileMap[y - 1][x]?.tile) ? tiles.topRightAdjacent : tiles.topRight,
          };
        }
        if (x > 0) {
          tileMap[y][x - 1] = { sum, tile: tiles.bottomLeft };
        }
        if (x < MAP_SIZE) {
          tileMap[y][x] = { sum, tile: tiles.bottomRight };
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
