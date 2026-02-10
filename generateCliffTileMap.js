import { SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

// Reuse the same water tile IDs for now (user will change manually later)

// Edge tiles
export const CLIFF_BORDER_TOP = 201;
export const CLIFF_BORDER_RIGHT = 251;
export const CLIFF_BORDER_BOTTOM = 297;
export const CLIFF_BORDER_LEFT = 247;

// Outside corners (convex)
export const CLIFF_BORDER_CORNER_TOP_LEFT = 200;
export const CLIFF_BORDER_CORNER_TOP_RIGHT = 202;
export const CLIFF_BORDER_CORNER_BOTTOM_LEFT = 296;
export const CLIFF_BORDER_CORNER_BOTTOM_RIGHT = 298;

// Inside corners (concave)
export const CLIFF_BORDER_INSIDE_TOP_LEFT = 224;
export const CLIFF_BORDER_INSIDE_TOP_RIGHT = 226;
export const CLIFF_BORDER_INSIDE_BOTTOM_LEFT = 272;
export const CLIFF_BORDER_INSIDE_BOTTOM_RIGHT = 274;

export const CLIFF_INTERIOR_TILES = [
  { index: 0, chance: 1 },
  { index: 1, chance: 0.1 },
  { index: 2, chance: 0.1 },
  { index: 3, chance: 0.1 },
];

// Grouped exports for convenience
export const CLIFF_EDGE_TILES = [CLIFF_BORDER_TOP, CLIFF_BORDER_RIGHT, CLIFF_BORDER_BOTTOM, CLIFF_BORDER_LEFT];
export const CLIFF_CORNER_TILES = [CLIFF_BORDER_CORNER_TOP_LEFT, CLIFF_BORDER_CORNER_TOP_RIGHT, CLIFF_BORDER_CORNER_BOTTOM_LEFT, CLIFF_BORDER_CORNER_BOTTOM_RIGHT];
export const CLIFF_INSIDE_CORNER_TILES = [CLIFF_BORDER_INSIDE_TOP_LEFT, CLIFF_BORDER_INSIDE_TOP_RIGHT, CLIFF_BORDER_INSIDE_BOTTOM_LEFT, CLIFF_BORDER_INSIDE_BOTTOM_RIGHT];

const random = createRandom(SEED);

function getCliffBorderTile(valueMap, x, y, existingTileMap) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  // Helper to check if neighbor is NOT cliff (is land or out of bounds)
  const isLand = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return true;
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
    return CLIFF_BORDER_CORNER_TOP_LEFT;
  }
  if (top && right) {
    return CLIFF_BORDER_CORNER_TOP_RIGHT;
  }
  if (bottom && left) {
    return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (bottom && right) {
    return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;
  }

  // Diagonal corners (1 cardinal is land AND opposite diagonal is land)
  // This handles cases where two cliff regions touch at a corner
  // CRITICAL: Only apply when exactly 1 cardinal is land (not 2+)
  if (right && !top && !bottom && !left && bottomLeft) {
    return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;
  }
  if (right && !top && !bottom && !left && topLeft) {
    return CLIFF_BORDER_CORNER_TOP_RIGHT;
  }
  if (left && !top && !bottom && !right && bottomRight) {
    return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (left && !top && !bottom && !right && topRight) {
    return CLIFF_BORDER_CORNER_TOP_LEFT;
  }
  if (top && !left && !right && !bottom && bottomLeft) {
    return CLIFF_BORDER_CORNER_TOP_LEFT;
  }
  if (top && !left && !right && !bottom && bottomRight) {
    return CLIFF_BORDER_CORNER_TOP_RIGHT;
  }
  if (bottom && !left && !right && !top && topLeft) {
    return CLIFF_BORDER_CORNER_BOTTOM_LEFT;
  }
  if (bottom && !left && !right && !top && topRight) {
    return CLIFF_BORDER_CORNER_BOTTOM_RIGHT;
  }

  // Edge tiles (1 cardinal is land)
  if (top) {
    return CLIFF_BORDER_TOP;
  }
  if (bottom) {
    return CLIFF_BORDER_BOTTOM;
  }
  if (left) {
    return CLIFF_BORDER_LEFT;
  }
  if (right) {
    return CLIFF_BORDER_RIGHT;
  }

  // Inside corners (all cardinals are water, but diagonal is land)
  if (topLeft) {
    return CLIFF_BORDER_INSIDE_TOP_LEFT;
  }
  if (topRight) {
    return CLIFF_BORDER_INSIDE_TOP_RIGHT;
  }
  if (bottomLeft) {
    return CLIFF_BORDER_INSIDE_BOTTOM_LEFT;
  }
  if (bottomRight) {
    return CLIFF_BORDER_INSIDE_BOTTOM_RIGHT;
  }

  if (existingTileMap[y][x] && existingTileMap[y][x].tileIndex && CLIFF_INTERIOR_TILES.find((t) => t.index === existingTileMap[y][x].tileIndex)) {
    return existingTileMap[y][x].tileIndex;
  }
  // Interior tile (no borders)
  return getRandomTile(CLIFF_INTERIOR_TILES, random);
}

export function generateCliffTileMap(valueMap, existingTileMap) {
  const tileMap = [];
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      if (valueMap[y][x].value === 1) {
        const tile = getCliffBorderTile(valueMap, x, y, existingTileMap);
        tileMap[y][x] = {
          tileIndex: tile,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
