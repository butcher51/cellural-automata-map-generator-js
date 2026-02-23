import { createFoliageToolUtils } from "./foliageToolUtils.js";

export const DEFAULT_TREE_TYPE = 1;

export const TREE_TILES = {
  1: {
    topLeft: 1231,
    topRight: 1232,
    bottomLeft: 1255,
    bottomRight: 1256,
    topLeftAdjacent: 1282,
    topRightAdjacent: 1283,
  },
  2: {
    topLeft: 1471,
    topRight: 1472,
    bottomLeft: 1495,
    bottomRight: 1496,
    topLeftAdjacent: 1522,
    topRightAdjacent: 1523,
  },
  3: {
    topLeft: 1477,
    topRight: 1478,
    bottomLeft: 1501,
    bottomRight: 1502,
    topLeftAdjacent: 1528,
    topRightAdjacent: 1529,
  },
  4: {
    topLeft: 1483,
    topRight: 1484,
    bottomLeft: 1507,
    bottomRight: 1508,
    topLeftAdjacent: 1534,
    topRightAdjacent: 1535,
  },
};

const { isTool, getType } = createFoliageToolUtils("tree", ["1", "2", "3", "4"], DEFAULT_TREE_TYPE);

export const isTreeTool = isTool;
export const getTreeType = getType;
