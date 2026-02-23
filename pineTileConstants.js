import { createFoliageToolUtils } from "./foliageToolUtils.js";

export const DEFAULT_PINE_TYPE = 1;

export const PINE_TILES = {
  1: {
    topLeft: 1831,
    topRight: 1832,
    bottomLeft: 1855,
    bottomRight: 1856,
    topLeftAdjacent: 1882,
    topRightAdjacent: 1883,
  },
};

const { isTool, getType } = createFoliageToolUtils("pine", ["1"], DEFAULT_PINE_TYPE);

export const isPineTool = isTool;
export const getPineType = getType;
