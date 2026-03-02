import { createFoliageToolUtils } from "./foliageToolUtils.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";

export const DEFAULT_LINE_TILE_TYPE = 1;

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
  1: {
    horizontal: 916,
    vertical: 916,
    cornerLeftTop: 916,
    cornerLeftBottom: 916,
    cornerRightTop: 916,
    cornerRightBottom: 916,
    endTop: 916,
    endBottom: 916,
    endLeft: 916,
    endRight: 916,
    tTop: 916,
    tBottom: 916,
    tLeft: 916,
    tRight: 916,
    middle: 916,
  },
  2: {
    horizontal: 922,
    vertical: 922,
    cornerLeftTop: 922,
    cornerLeftBottom: 922,
    cornerRightTop: 922,
    cornerRightBottom: 922,
    endTop: 922,
    endBottom: 922,
    endLeft: 922,
    endRight: 922,
    tTop: 922,
    tBottom: 922,
    tLeft: 922,
    tRight: 922,
    middle: 922,
  },
  3: {
    horizontal: 928,
    vertical: 928,
    cornerLeftTop: 928,
    cornerLeftBottom: 928,
    cornerRightTop: 928,
    cornerRightBottom: 928,
    endTop: 928,
    endBottom: 928,
    endLeft: 928,
    endRight: 928,
    tTop: 928,
    tBottom: 928,
    tLeft: 928,
    tRight: 928,
    middle: 928,
  },
  4: {
    horizontal: 934,
    vertical: 934,
    cornerLeftTop: 934,
    cornerLeftBottom: 934,
    cornerRightTop: 934,
    cornerRightBottom: 934,
    endTop: 934,
    endBottom: 934,
    endLeft: 934,
    endRight: 934,
    tTop: 934,
    tBottom: 934,
    tLeft: 934,
    tRight: 934,
    middle: 934,
  },
});

const { isTool, getType } = createFoliageToolUtils(
  "lineTile",
  ["1", "2", "3", "4"],
  DEFAULT_LINE_TILE_TYPE,
);

export const isLineTileTool = isTool;
export const getLineTileType = getType;
