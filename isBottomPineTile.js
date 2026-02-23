import { PINE_TILES } from "./pineTileConstants.js";
import { createBottomTileCheckers } from "./isBottomFoliageTile.js";

const { isBottomRight, isBottomLeft } = createBottomTileCheckers(PINE_TILES);

export const isBottomRightPineTile = isBottomRight;
export const isBottomLeftPineTile = isBottomLeft;
