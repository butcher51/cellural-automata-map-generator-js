import { createFoliageToolUtils } from "./foliageToolUtils.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";

export const DEFAULT_LINE_TILE_TYPE = 1;

export const LINE_TILE_TILES = {
  1: { spritePosition: getTileSpritePosition(965) },
  2: { spritePosition: getTileSpritePosition(971) },
  3: { spritePosition: getTileSpritePosition(977) },
  4: { spritePosition: getTileSpritePosition(983) },
};

const { isTool, getType } = createFoliageToolUtils("lineTile", ["1", "2", "3", "4"], DEFAULT_LINE_TILE_TYPE);

export const isLineTileTool = isTool;
export const getLineTileType = getType;
