import { DEAD_TREE_TILES } from "./deadTreeTileConstants.js";
import { createBottomTileCheckers } from "./isBottomFoliageTile.js";

const { isBottomRight, isBottomLeft } = createBottomTileCheckers(DEAD_TREE_TILES);

export const isBottomRightDeadTreeTile = isBottomRight;
export const isBottomLeftDeadTreeTile = isBottomLeft;
