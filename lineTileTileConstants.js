import { getTileSpritePosition } from "./getTileSpritePosition.js";

export const DEFAULT_LINE_TILE_TYPE = "road";

export const LINE_TILE_SHAPES = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  CORNER_LEFT_TOP: "cornerLeftTop",
  CORNER_LEFT_BOTTOM: "cornerLeftBottom",
  CORNER_RIGHT_TOP: "cornerRightTop",
  CORNER_RIGHT_BOTTOM: "cornerRightBottom",
  END_TOP: "endTop",
  END_BOTTOM: "endBottom",
  END_LEFT: "endLeft",
  END_RIGHT: "endRight",
  T_TOP: "tTop",
  T_BOTTOM: "tBottom",
  T_LEFT: "tLeft",
  T_RIGHT: "tRight",
  MIDDLE: "middle",
};

function buildLineTileTiles(tiles) {
  const result = {};
  for (const [type, shapes] of Object.entries(tiles)) {
    result[type] = {};
    for (const [shape, index] of Object.entries(shapes)) {
      result[type][shape] = { spritePosition: getTileSpritePosition(index) };
    }
  }
  return result;
}

export const LINE_TILE_TILES = buildLineTileTiles({
  road: {
    horizontal: 913,
    vertical: 914,
    cornerLeftTop: 987,
    cornerLeftBottom: 939,
    cornerRightTop: 985,
    cornerRightBottom: 937,
    endTop: 989,
    endBottom: 941,
    endLeft: 966,
    endRight: 964,
    tTop: 986,
    tBottom: 938,
    tLeft: 963,
    tRight: 961,
    middle: 965,
  },
  wallLeft: {
    horizontal: 2262,
    vertical: 2285,
    cornerLeftTop: 2406,
    cornerLeftBottom: 2358,
    cornerRightTop: 2309,
    cornerRightBottom: 2261,
    endTop: 2405,
    endBottom: 2357,
    endLeft: 2285,
    endRight: 2262,
    tTop: 0,
    tBottom: 0,
    tLeft: 0,
    tRight: 0,
    middle: 0,
  },
  wallRight: {
    horizontal: 2263,
    vertical: 2288,
    cornerLeftTop: 2312,
    cornerLeftBottom: 2264,
    cornerRightTop: 2407,
    cornerRightBottom: 2359,
    endTop: 0,
    endBottom: 0,
    endLeft: 0,
    endRight: 0,
    tTop: 0,
    tBottom: 0,
    tLeft: 0,
    tRight: 0,
    middle: 0,
  },
});

const VALID_LINE_TILE_TOOLS = new Set([
  "lineTile-road",
  "lineTile-wallLeft",
  "lineTile-wallRight",
]);

export function isLineTileTool(tool) {
  return VALID_LINE_TILE_TOOLS.has(tool);
}

export function getLineTileType(tool) {
  if (!isLineTileTool(tool)) return DEFAULT_LINE_TILE_TYPE;
  return tool.split("-")[1];
}
