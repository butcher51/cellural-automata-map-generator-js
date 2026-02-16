import { SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

// Edge tiles
export const WATER_BORDER_TOP = 194;
export const WATER_BORDER_RIGHT = 219;
export const WATER_BORDER_BOTTOM = 266;
export const WATER_BORDER_LEFT = 217;

// Outside corners (convex)
export const WATER_BORDER_CORNER_TOP_LEFT = 193;
export const WATER_BORDER_CORNER_TOP_RIGHT = 195;
export const WATER_BORDER_CORNER_BOTTOM_LEFT = 265;
export const WATER_BORDER_CORNER_BOTTOM_RIGHT = 267;

// Inside corners (concave)
export const WATER_BORDER_INSIDE_TOP_LEFT = 441;
export const WATER_BORDER_INSIDE_TOP_RIGHT = 443;
export const WATER_BORDER_INSIDE_BOTTOM_LEFT = 489;
export const WATER_BORDER_INSIDE_BOTTOM_RIGHT = 491;

export const WATER_INTERIOR_TILES = [
  { index: 841, chance: 1 },
  { index: 847, chance: 0.5 },
  { index: 855, chance: 0.1 },
  { index: 856, chance: 0.05 },
  { index: 859, chance: 0.01 },
  { index: 860, chance: 0.01 },
  { index: 861, chance: 0.1 },
];

// Grouped exports for convenience
export const WATER_EDGE_TILES = [WATER_BORDER_TOP, WATER_BORDER_RIGHT, WATER_BORDER_BOTTOM, WATER_BORDER_LEFT];
export const WATER_CORNER_TILES = [WATER_BORDER_CORNER_TOP_LEFT, WATER_BORDER_CORNER_TOP_RIGHT, WATER_BORDER_CORNER_BOTTOM_LEFT, WATER_BORDER_CORNER_BOTTOM_RIGHT];
export const WATER_INSIDE_CORNER_TILES = [WATER_BORDER_INSIDE_TOP_LEFT, WATER_BORDER_INSIDE_TOP_RIGHT, WATER_BORDER_INSIDE_BOTTOM_LEFT, WATER_BORDER_INSIDE_BOTTOM_RIGHT];

function getWaterBorderTile(valueMap, x, y, existingTileMap, random) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  // Helper to check if neighbor is NOT water (is land or out of bounds)
  const isLand = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return false;
    }
    return valueMap[ny]?.[nx]?.value !== 1;
  };

  // Check cardinal directions
  const top = isLand(x, y - 1);
  const bottom = isLand(x, y + 1);
  const left = isLand(x - 1, y);
  const right = isLand(x + 1, y);

  // Check diagonals
  const topLeft = isLand(x - 1, y - 1);
  const topRight = isLand(x + 1, y - 1);
  const bottomLeft = isLand(x - 1, y + 1);
  const bottomRight = isLand(x + 1, y + 1);

  // Outside corners (2 adjacent cardinals are land)
  if (top && left) {
    return WATER_BORDER_CORNER_TOP_LEFT;
  }
  if (top && right) {
    return WATER_BORDER_CORNER_TOP_RIGHT;
  }
  if (bottom && left) {
    return WATER_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (bottom && right) {
    return WATER_BORDER_CORNER_BOTTOM_RIGHT;
  }

  // Diagonal corners (1 cardinal is land AND opposite diagonal is land)
  // This handles cases where two water regions touch at a corner
  // CRITICAL: Only apply when exactly 1 cardinal is land (not 2+)
  if (right && !top && !bottom && !left && bottomLeft) {
    return WATER_BORDER_CORNER_BOTTOM_RIGHT;
  }
  if (right && !top && !bottom && !left && topLeft) {
    return WATER_BORDER_CORNER_TOP_RIGHT;
  }
  if (left && !top && !bottom && !right && bottomRight) {
    return WATER_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (left && !top && !bottom && !right && topRight) {
    return WATER_BORDER_CORNER_TOP_LEFT;
  }
  if (top && !left && !right && !bottom && bottomLeft) {
    return WATER_BORDER_CORNER_TOP_LEFT;
  }
  if (top && !left && !right && !bottom && bottomRight) {
    return WATER_BORDER_CORNER_TOP_RIGHT;
  }
  if (bottom && !left && !right && !top && topLeft) {
    return WATER_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (bottom && !left && !right && !top && topRight) {
    return WATER_BORDER_CORNER_BOTTOM_RIGHT;
  }

  // Edge tiles (1 cardinal is land)
  if (top) {
    return WATER_BORDER_TOP;
  }
  if (bottom) {
    return WATER_BORDER_BOTTOM;
  }
  if (left) {
    return WATER_BORDER_LEFT;
  }
  if (right) {
    return WATER_BORDER_RIGHT;
  }

  // Inside corners (all cardinals are water, but diagonal is land)
  if (topLeft) {
    return WATER_BORDER_INSIDE_TOP_LEFT;
  }
  if (topRight) {
    return WATER_BORDER_INSIDE_TOP_RIGHT;
  }
  if (bottomLeft) {
    return WATER_BORDER_INSIDE_BOTTOM_LEFT;
  }
  if (bottomRight) {
    return WATER_BORDER_INSIDE_BOTTOM_RIGHT;
  }

  if (existingTileMap?.[y]?.[x]?.tileIndex && WATER_INTERIOR_TILES.find((t) => t.index === existingTileMap[y][x].tileIndex)) {
    return existingTileMap[y][x].tileIndex;
  }
  // Interior tile (no borders)
  return getRandomTile(WATER_INTERIOR_TILES, random);
}

export function generateWaterTileMap(valueMap, existingTileMap) {
  const random = createRandom(SEED);
  const tileMap = [];
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      if (valueMap[y][x].value === 1) {
        const tile = getWaterBorderTile(valueMap, x, y, existingTileMap, random);
        tileMap[y][x] = {
          tileIndex: tile,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
