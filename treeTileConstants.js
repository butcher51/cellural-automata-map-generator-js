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

const VALID_TREE_TOOLS = new Set(["tree-1", "tree-2", "tree-3", "tree-4"]);

export function isTreeTool(tool) {
  return VALID_TREE_TOOLS.has(tool);
}

export function getTreeType(tool) {
  if (!isTreeTool(tool)) return DEFAULT_TREE_TYPE;
  return parseInt(tool.split("-")[1], 10);
}
