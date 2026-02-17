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

const VALID_PINE_TOOLS = new Set(["pine-1"]);

export function isPineTool(tool) {
  return VALID_PINE_TOOLS.has(tool);
}

export function getPineType(tool) {
  if (!isPineTool(tool)) return DEFAULT_PINE_TYPE;
  return parseInt(tool.split("-")[1], 10);
}
