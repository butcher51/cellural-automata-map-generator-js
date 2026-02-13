export const DEFAULT_TREE_TYPE = 1;

export const TREE_TILES = {
  1: {
    topLeft: 1225,
    topRight: 1226,
    bottomLeft: 1249,
    bottomRight: 1250,
    topLeftAdjacent: 1282,
    topRightAdjacent: 1283,
  },
  2: {
    topLeft: 1225,
    topRight: 1226,
    bottomLeft: 1249,
    bottomRight: 1250,
    topLeftAdjacent: 1282,
    topRightAdjacent: 1283,
  },
  3: {
    topLeft: 1225,
    topRight: 1226,
    bottomLeft: 1249,
    bottomRight: 1250,
    topLeftAdjacent: 1282,
    topRightAdjacent: 1283,
  },
  4: {
    topLeft: 1225,
    topRight: 1226,
    bottomLeft: 1249,
    bottomRight: 1250,
    topLeftAdjacent: 1282,
    topRightAdjacent: 1283,
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
