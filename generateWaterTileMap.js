import { MAP_SIZE } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";

// Edge tiles
const WATER_BORDER_TOP = 194;
const WATER_BORDER_RIGHT = 219;
const WATER_BORDER_BOTTOM = 266;
const WATER_BORDER_LEFT = 217;

// Outside corners (convex)
const WATER_BORDER_CORNER_TOP_LEFT = 193;
const WATER_BORDER_CORNER_TOP_RIGHT = 195;
const WATER_BORDER_CORNER_BOTTOM_LEFT = 265;
const WATER_BORDER_CORNER_BOTTOM_RIGHT = 267;

// Inside corners (concave)
const WATER_BORDER_INSIDE_TOP_LEFT = 155;
const WATER_BORDER_INSIDE_TOP_RIGHT = 155;
const WATER_BORDER_INSIDE_BOTTOM_LEFT = 155;
const WATER_BORDER_INSIDE_BOTTOM_RIGHT = 155;

const WATER_INTERIOR_TILE = 847;

function getWaterBorderTile(valueMap, x, y) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  // Helper to check if neighbor is NOT water (is land or out of bounds)
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

  // Interior tile (no borders)
  return WATER_INTERIOR_TILE;
}

export function generateWaterTileMap(valueMap) {
  const tileMap = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      if (valueMap[y][x].value === 1) {
        const tile = getWaterBorderTile(valueMap, x, y);
        tileMap[y][x] = {
          tile: 1,
          spritePosition: getTileSpritePosition(tile),
        };
      }
    }
  }
  return tileMap;
}
