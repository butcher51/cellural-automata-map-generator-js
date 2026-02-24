import { SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

// Edge tiles (placeholder - same as water for now)
export const DEEP_WATER_BORDER_TOP = 770;
export const DEEP_WATER_BORDER_RIGHT = 795;
export const DEEP_WATER_BORDER_BOTTOM = 818;
export const DEEP_WATER_BORDER_LEFT = 793;

// Outside corners (placeholder - same as water for now)
export const DEEP_WATER_BORDER_CORNER_TOP_LEFT = 769;
export const DEEP_WATER_BORDER_CORNER_TOP_RIGHT = 771;
export const DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT = 817;
export const DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT = 819;

// Inside corners (placeholder - same as water for now)
export const DEEP_WATER_BORDER_INSIDE_TOP_LEFT = 794;
export const DEEP_WATER_BORDER_INSIDE_TOP_RIGHT = 794;
export const DEEP_WATER_BORDER_INSIDE_BOTTOM_LEFT = 794;
export const DEEP_WATER_BORDER_INSIDE_BOTTOM_RIGHT = 794;

export const DEEP_WATER_INTERIOR_TILES = [
  { index: 865, chance: 1 },
  { index: 871, chance: 0.2 },
  { index: 879, chance: 0.1 },
  { index: 880, chance: 0.05 },
  { index: 883, chance: 0.01 },
  { index: 884, chance: 0.01 },
  { index: 885, chance: 0.1 },
];

// Grouped exports for convenience
export const DEEP_WATER_EDGE_TILES = [
  DEEP_WATER_BORDER_TOP,
  DEEP_WATER_BORDER_RIGHT,
  DEEP_WATER_BORDER_BOTTOM,
  DEEP_WATER_BORDER_LEFT,
];
export const DEEP_WATER_CORNER_TILES = [
  DEEP_WATER_BORDER_CORNER_TOP_LEFT,
  DEEP_WATER_BORDER_CORNER_TOP_RIGHT,
  DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT,
  DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT,
];
export const DEEP_WATER_INSIDE_CORNER_TILES = [
  DEEP_WATER_BORDER_INSIDE_TOP_LEFT,
  DEEP_WATER_BORDER_INSIDE_TOP_RIGHT,
  DEEP_WATER_BORDER_INSIDE_BOTTOM_LEFT,
  DEEP_WATER_BORDER_INSIDE_BOTTOM_RIGHT,
];

function getDeepWaterBorderTile(valueMap, x, y, existingTileMap, random) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  const isLand = (nx, ny) => {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return false;
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

  // Outside corners
  if (top && left) return DEEP_WATER_BORDER_CORNER_TOP_LEFT;
  if (top && right) return DEEP_WATER_BORDER_CORNER_TOP_RIGHT;
  if (bottom && left) return DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT;
  if (bottom && right) return DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT;

  // Diagonal corners
  if (right && !top && !bottom && !left && bottomLeft)
    return DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT;
  if (right && !top && !bottom && !left && topLeft)
    return DEEP_WATER_BORDER_CORNER_TOP_RIGHT;
  if (left && !top && !bottom && !right && bottomRight)
    return DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT;
  if (left && !top && !bottom && !right && topRight)
    return DEEP_WATER_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottom && bottomLeft)
    return DEEP_WATER_BORDER_CORNER_TOP_LEFT;
  if (top && !left && !right && !bottom && bottomRight)
    return DEEP_WATER_BORDER_CORNER_TOP_RIGHT;
  if (bottom && !left && !right && !top && topLeft)
    return DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT;
  if (bottom && !left && !right && !top && topRight)
    return DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT;

  // Edge tiles
  if (top) return DEEP_WATER_BORDER_TOP;
  if (bottom) return DEEP_WATER_BORDER_BOTTOM;
  if (left) return DEEP_WATER_BORDER_LEFT;
  if (right) return DEEP_WATER_BORDER_RIGHT;

  // Inside corners
  if (topLeft) return DEEP_WATER_BORDER_INSIDE_TOP_LEFT;
  if (topRight) return DEEP_WATER_BORDER_INSIDE_TOP_RIGHT;
  if (bottomLeft) return DEEP_WATER_BORDER_INSIDE_BOTTOM_LEFT;
  if (bottomRight) return DEEP_WATER_BORDER_INSIDE_BOTTOM_RIGHT;

  if (
    existingTileMap?.[y]?.[x]?.tileIndex &&
    DEEP_WATER_INTERIOR_TILES.find(
      (t) => t.index === existingTileMap[y][x].tileIndex,
    )
  ) {
    return existingTileMap[y][x].tileIndex;
  }

  return getRandomTile(DEEP_WATER_INTERIOR_TILES, random);
}

export function generateDeepWaterTileMap(valueMap, existingTileMap) {
  const random = createRandom(SEED);
  const tileMap = [];
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      if (valueMap[y][x].value === 1) {
        const tile = getDeepWaterBorderTile(
          valueMap,
          x,
          y,
          existingTileMap,
          random,
        );
        tileMap[y][x] = {
          tileIndex: tile,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
