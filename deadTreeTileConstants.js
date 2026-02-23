import { createFoliageToolUtils } from "./foliageToolUtils.js";

export const DEFAULT_DEAD_TREE_TYPE = 1;

export const DEAD_TREE_TILES = {
  1: {
    topLeft: 1711,
    topRight: 1712,
    bottomLeft: 1735,
    bottomRight: 1736,
    topLeftAdjacent: 1762,
    topRightAdjacent: 1763,
  },
};

const { isTool, getType } = createFoliageToolUtils("deadTree", ["1"], DEFAULT_DEAD_TREE_TYPE);

export const isDeadTreeTool = isTool;
export const getDeadTreeType = getType;
