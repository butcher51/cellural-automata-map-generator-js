import { GROUND_TILES, SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

/*
// gray cliff
export const CLIFF_BORDER_TOP = 185;
export const CLIFF_BORDER_RIGHT = 285;
export const CLIFF_BORDER_LEFT = 280;

// Surface outside corners (convex)
export const CLIFF_BORDER_CORNER_TOP_LEFT = 184;
export const CLIFF_BORDER_CORNER_TOP_RIGHT = 186;

// Surface inside corners (concave)
export const CLIFF_BORDER_INSIDE_TOP_LEFT = 187;
export const CLIFF_BORDER_INSIDE_TOP_RIGHT = 189;

export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT_TOP = 256;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_TOP = 261;
export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT_MID = 280;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_MID = 285;

// Wall tiles: 3 rows (top, mid, bottom) × 3 variants (left, center, right)
// Wall top row (distFromBottom = 2)
export const CLIFF_WALL_TOP_LEFT = 304;
export const CLIFF_WALL_TOP_CENTER = 305;
export const CLIFF_WALL_TOP_RIGHT = 309;

// Wall middle row (distFromBottom = 1)
export const CLIFF_WALL_MID_LEFT = 328;
export const CLIFF_WALL_MID_CENTER = 329;
export const CLIFF_WALL_MID_RIGHT = 333;

// Wall bottom row (distFromBottom = 0)
export const CLIFF_WALL_BOTTOM_LEFT = 352;
export const CLIFF_WALL_BOTTOM_CENTER = 353;
export const CLIFF_WALL_BOTTOM_RIGHT = 357;
*/

// braun
// Surface edge tiles (same as old cliff implementation)
export const CLIFF_BORDER_TOP = 14;
export const CLIFF_BORDER_RIGHT = 41;
export const CLIFF_BORDER_LEFT = 35;

// Surface outside corners (convex)
export const CLIFF_BORDER_CORNER_TOP_LEFT = 13;
export const CLIFF_BORDER_CORNER_TOP_RIGHT = 15;

// Surface inside corners (concave)
export const CLIFF_BORDER_INSIDE_TOP_LEFT = 37;
export const CLIFF_BORDER_INSIDE_TOP_RIGHT = 39;

export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT_TOP = 11;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_TOP = 17;
export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT_MID = 35;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_MID = 41;

// Wall tiles: 3 rows (top, mid, bottom) × 3 variants (left, center, right)
// Wall top row (distFromBottom = 2)
export const CLIFF_WALL_TOP_LEFT = 59;
export const CLIFF_WALL_TOP_CENTER = 61;
export const CLIFF_WALL_TOP_RIGHT = 65;

// Wall middle row (distFromBottom = 1)
export const CLIFF_WALL_MID_LEFT = 83;
export const CLIFF_WALL_MID_CENTER = 85;
export const CLIFF_WALL_MID_RIGHT = 89;

// Wall bottom row (distFromBottom = 0)
export const CLIFF_WALL_BOTTOM_LEFT = 107;
export const CLIFF_WALL_BOTTOM_CENTER = 109;
export const CLIFF_WALL_BOTTOM_RIGHT = 113;

// const PATTERNS5x5 = {
//   CLIFF_WALL_MID_RIGHT: [
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 0, 1],
//     [0, 0, 1, 1, 1],
//   ],
//   CLIFF_WALL_MID_LEFT: [
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 0, 1, 1, 1],
//     [1, 1, 1, 0, 0],
//   ],
//   CLIFF_WALL_TOP_RIGHT: [
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 0, 1],
//   ],
//   CLIFF_WALL_TOP_LEFT: [
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 1, 1, 1, 1],
//     [1, 0, 1, 1, 1],
//   ],
// };

/**
 * Standard border detection for cliff surface tiles (same logic as water).
 */
function getCliffSurfaceTile(valueMap, x, y, existingTileMap, random) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  const isLand = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return false;
    }
    return valueMap[ny]?.[nx]?.value !== 1;
  };

  // if (matchPattern(valueMap, PATTERNS5x5.CLIFF_WALL_MID_RIGHT, x, y)) return CLIFF_WALL_MID_RIGHT;
  // if (matchPattern(valueMap, PATTERNS5x5.CLIFF_WALL_MID_LEFT, x, y)) return CLIFF_WALL_MID_LEFT;

  // if (matchPattern(valueMap, PATTERNS5x5.CLIFF_WALL_TOP_RIGHT, x, y)) return CLIFF_WALL_TOP_RIGHT;
  // if (matchPattern(valueMap, PATTERNS5x5.CLIFF_WALL_TOP_LEFT, x, y)) return CLIFF_WALL_TOP_LEFT;

  const top = isLand(x, y - 1);
  const bottomTop = isLand(x, y + 1);
  const bottomMid = isLand(x, y + 2);
  const bottomBottom = isLand(x, y + 3);
  const left = isLand(x - 1, y);
  const right = isLand(x + 1, y);

  const topLeft = isLand(x - 1, y - 1);
  const topRight = isLand(x + 1, y - 1);
  const bottomLeftTop = isLand(x - 1, y + 1);
  const bottomRightTop = isLand(x + 1, y + 1);
  const bottomLeftMid = isLand(x - 1, y + 2);
  const bottomRightMid = isLand(x + 1, y + 2);
  const bottomLeftBottom = isLand(x - 1, y + 3);
  const bottomRightBottom = isLand(x + 1, y + 3);

  if (bottomRightTop && !top && !left && !bottomTop && bottomRightTop && bottomMid) return CLIFF_WALL_MID_RIGHT;
  if (bottomLeftTop && !top && !right && !bottomTop && bottomLeftTop && bottomMid) return CLIFF_WALL_MID_LEFT;

  if (bottomLeftBottom && !bottomLeftMid && !left && !right && !top && !bottomMid && !bottomBottom) return CLIFF_BORDER_INSIDE_BOTTOM_LEFT_TOP;
  if (bottomLeftMid && !left && !right && !top && !bottomMid && !bottomBottom && !bottomTop) return CLIFF_BORDER_INSIDE_BOTTOM_LEFT_MID;

  if (bottomRightBottom && !bottomRightMid && !left && !right && !top && !bottomMid && !bottomBottom) return CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_TOP;
  if (bottomRightMid && !left && !right && !top && !bottomMid && !bottomBottom && !bottomTop) return CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_MID;

  if (!top && !topRight && !right && !bottomTop && !bottomMid && bottomLeftMid && bottomLeftBottom && bottomBottom) return CLIFF_WALL_TOP_LEFT;
  if (!top && !topLeft && !left && !bottomTop && !bottomMid && bottomRightMid && bottomRightBottom && bottomBottom) return CLIFF_WALL_TOP_RIGHT;

  // Outside corners (2 adjacent cardinals are land)
  if (top && left) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && right) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (bottomTop && left) return CLIFF_WALL_BOTTOM_LEFT;
  if (bottomTop && right) return CLIFF_WALL_BOTTOM_RIGHT;

  // Diagonal corners (1 cardinal is land AND opposite diagonal is land)
  if (right && !top && !bottomTop && !left && bottomLeftTop) return CLIFF_WALL_BOTTOM_RIGHT;
  if (right && !top && !bottomTop && !left && topLeft) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (left && !top && !bottomTop && !right && bottomRightTop) return CLIFF_WALL_BOTTOM_LEFT;
  if (left && !top && !bottomTop && !right && topRight) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottomTop && bottomLeftTop) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottomTop && bottomRightTop) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (bottomTop && !left && !right && !top && topLeft) return CLIFF_WALL_BOTTOM_LEFT;
  if (bottomTop && !left && !right && !top && topRight) return CLIFF_WALL_BOTTOM_RIGHT;

  // Edge tiles (1 cardinal is land)
  if (top) return CLIFF_BORDER_TOP;
  if (bottomTop) return CLIFF_WALL_BOTTOM_CENTER;
  if (bottomMid) return CLIFF_WALL_MID_CENTER;
  if (bottomBottom) return CLIFF_WALL_TOP_CENTER;
  if (left) return CLIFF_BORDER_LEFT;
  if (right) return CLIFF_BORDER_RIGHT;

  // Inside corners (all cardinals are cliff, but diagonal is land)
  if (topLeft) return CLIFF_BORDER_INSIDE_TOP_LEFT;
  if (topRight) return CLIFF_BORDER_INSIDE_TOP_RIGHT;
  if (bottomLeftTop) return CLIFF_BORDER_INSIDE_BOTTOM_LEFT_TOP;
  if (bottomRightTop) return CLIFF_BORDER_INSIDE_BOTTOM_RIGHT_TOP;

  if (existingTileMap?.[y]?.[x]?.tileIndex && GROUND_TILES.find((t) => t.index === existingTileMap[y][x].tileIndex)) {
    return existingTileMap[y][x].tileIndex;
  }
  // Interior tile
  return getRandomTile(GROUND_TILES, random);
}

export function generateCliffTileMap(valueMap, existingTileMap) {
  const random = createRandom(SEED);
  const tileMap = [];
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      if (valueMap[y][x].value === 1) {
        let tile = getCliffSurfaceTile(valueMap, x, y, existingTileMap, random);

        tileMap[y][x] = {
          tileIndex: tile,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
