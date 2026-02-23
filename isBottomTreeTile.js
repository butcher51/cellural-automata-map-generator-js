import { TREE_TILES } from "./treeTileConstants.js";
import { createBottomTileCheckers } from "./isBottomFoliageTile.js";

const { isBottomRight, isBottomLeft } = createBottomTileCheckers(TREE_TILES);

export const isBottomRightTreeTile = isBottomRight;
export const isBottomLeftTreeTile = isBottomLeft;
