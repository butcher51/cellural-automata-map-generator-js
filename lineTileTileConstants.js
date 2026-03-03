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
  2: {
    horizontal: 919,
    vertical: 920,
    cornerLeftTop: 993,
    cornerLeftBottom: 945,
    cornerRightTop: 991,
    cornerRightBottom: 943,
    endTop: 995,
    endBottom: 947,
    endLeft: 972,
    endRight: 970,
    tTop: 992,
    tBottom: 944,
    tLeft: 967,
    tRight: 969,
    middle: 971,
  },
  3: {
    horizontal: 925,
    vertical: 926,
    cornerLeftTop: 999,
    cornerLeftBottom: 951,
    cornerRightTop: 997,
    cornerRightBottom: 949,
    endTop: 1001,
    endBottom: 953,
    endLeft: 978,
    endRight: 976,
    tTop: 998,
    tBottom: 950,
    tLeft: 975,
    tRight: 973,
    middle: 977,
  },
  4: {
    horizontal: 931,
    vertical: 932,
    cornerLeftTop: 1005,
    cornerLeftBottom: 957,
    cornerRightTop: 1003,
    cornerRightBottom: 1005,
    endTop: 1007,
    endBottom: 959,
    endLeft: 984,
    endRight: 982,
    tTop: 1004,
    tBottom: 956,
    tLeft: 984,
    tRight: 982,
    middle: 983,
  },
});

const { isTool, getType } = createFoliageToolUtils(
  "lineTile",
  ["1", "2", "3", "4"],
  DEFAULT_LINE_TILE_TYPE,
);

export const isLineTileTool = isTool;
export const getLineTileType = getType;
