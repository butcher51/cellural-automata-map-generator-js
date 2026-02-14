import { SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

// Surface edge tiles (same as old cliff implementation)
export const CLIFF_BORDER_TOP = 201;
export const CLIFF_BORDER_RIGHT = 251;
export const CLIFF_BORDER_BOTTOM = 297;
export const CLIFF_BORDER_LEFT = 247;

// Surface outside corners (convex)
export const CLIFF_BORDER_CORNER_TOP_LEFT = 200;
export const CLIFF_BORDER_CORNER_TOP_RIGHT = 202;
export const CLIFF_BORDER_CORNER_BOTTOM_LEFT = 296;
export const CLIFF_BORDER_CORNER_BOTTOM_RIGHT = 298;

// Surface inside corners (concave)
export const CLIFF_BORDER_INSIDE_TOP_LEFT = 224;
export const CLIFF_BORDER_INSIDE_TOP_RIGHT = 226;
export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT = 272;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT = 274;

// Surface interior tiles (mostly transparent, shows ground beneath)
export const CLIFF_INTERIOR_TILES = [
  { index: 0, chance: 1 },
  { index: 1, chance: 0.1 },
  { index: 2, chance: 0.1 },
  { index: 3, chance: 0.1 },
];

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

/**
 * Count consecutive cliff cells below this cell (including this cell at distance 0).
 * Distance 0 = this is the bottom-most cliff cell.
 * Distance 1 = one cliff cell below this one.
 * etc.
 */
function countDistFromBottom(valueMap, x, y) {
  const height = valueMap.length;
  let dist = 0;
  for (let ny = y + 1; ny < height; ny++) {
    if (valueMap[ny]?.[x]?.value !== 1) {
      break;
    }
    dist++;
  }
  return dist;
}

/**
 * Standard border detection for cliff surface tiles (same logic as water).
 * Used when distFromBottom >= 3.
 */
function getCliffSurfaceTile(valueMap, x, y, existingTileMap, random) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  const isLand = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return true;
    }
    return valueMap[ny]?.[nx]?.value !== 1;
  };

  const top = isLand(x, y - 1);
  const bottom = isLand(x, y + 1);
  const left = isLand(x - 1, y);
  const right = isLand(x + 1, y);

  const topLeft = isLand(x - 1, y - 1);
  const topRight = isLand(x + 1, y - 1);
  const bottomLeft = isLand(x - 1, y + 1);
  const bottomRight = isLand(x + 1, y + 1);

  // Outside corners (2 adjacent cardinals are land)
  if (top && left) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && right) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (bottom && left) return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  if (bottom && right) return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;

  // Diagonal corners (1 cardinal is land AND opposite diagonal is land)
  if (right && !top && !bottom && !left && bottomLeft) return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;
  if (right && !top && !bottom && !left && topLeft) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (left && !top && !bottom && !right && bottomRight) return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  if (left && !top && !bottom && !right && topRight) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottom && bottomLeft) return CLIFF_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottom && bottomRight) return CLIFF_BORDER_CORNER_TOP_RIGHT;
  if (bottom && !left && !right && !top && topLeft) return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  if (bottom && !left && !right && !top && topRight) return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;

  // Edge tiles (1 cardinal is land)
  if (top) return CLIFF_BORDER_TOP;
  if (bottom) return CLIFF_BORDER_BOTTOM;
  if (left) return CLIFF_BORDER_LEFT;
  if (right) return CLIFF_BORDER_RIGHT;

  // Inside corners (all cardinals are cliff, but diagonal is land)
  if (topLeft) return CLIFF_BORDER_INSIDE_TOP_LEFT;
  if (topRight) return CLIFF_BORDER_INSIDE_TOP_RIGHT;
  if (bottomLeft) return CLIFF_BORDER_INSIDE_BOTTOM_LEFT;
  if (bottomRight) return CLIFF_BORDER_INSIDE_BOTTOM_RIGHT;

  if (existingTileMap[y][x] && existingTileMap[y][x].tileIndex && CLIFF_INTERIOR_TILES.find((t) => t.index === existingTileMap[y][x].tileIndex)) {
    return existingTileMap[y][x].tileIndex;
  }
  // Interior tile
  return getRandomTile(CLIFF_INTERIOR_TILES, random);
}

/**
 * Determine wall tile based on row (distFromBottom) and horizontal position.
 * Wall tiles have left/center/right variants based on horizontal cliff neighbors.
 */
function getCliffWallTile(valueMap, x, y, distFromBottom) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  const isNotCliff = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return true;
    }
    return valueMap[ny]?.[nx]?.value !== 1;
  };

  const leftIsNotCliff = isNotCliff(x - 1, y);
  const rightIsNotCliff = isNotCliff(x + 1, y);

  // Determine horizontal variant
  let variant; // 'left', 'center', or 'right'
  if (leftIsNotCliff && !rightIsNotCliff) {
    variant = "left";
  } else if (!leftIsNotCliff && rightIsNotCliff) {
    variant = "right";
  } else {
    variant = "center";
  }

  // Map to wall tile based on row and variant
  if (distFromBottom === 2) {
    // Wall top row
    if (variant === "left") return CLIFF_WALL_TOP_LEFT;
    if (variant === "right") return CLIFF_WALL_TOP_RIGHT;
    return CLIFF_WALL_TOP_CENTER;
  } else if (distFromBottom === 1) {
    // Wall mid row
    if (variant === "left") return CLIFF_WALL_MID_LEFT;
    if (variant === "right") return CLIFF_WALL_MID_RIGHT;
    return CLIFF_WALL_MID_CENTER;
  } else {
    // Wall bottom row (distFromBottom === 0)
    if (variant === "left") return CLIFF_WALL_BOTTOM_LEFT;
    if (variant === "right") return CLIFF_WALL_BOTTOM_RIGHT;
    return CLIFF_WALL_BOTTOM_CENTER;
  }
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
        const distFromBottom = countDistFromBottom(valueMap, x, y);

        let tile;
        if (distFromBottom >= 3) {
          // Surface tile: use standard border detection
          tile = getCliffSurfaceTile(valueMap, x, y, existingTileMap, random);
        } else {
          // Wall tile: use row + horizontal variant
          tile = getCliffWallTile(valueMap, x, y, distFromBottom);
        }

        tileMap[y][x] = {
          tileIndex: tile,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
