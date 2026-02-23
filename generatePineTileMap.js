import { PINE_TILES, DEFAULT_PINE_TYPE } from "./pineTileConstants.js";
import { isBottomRightPineTile, isBottomLeftPineTile } from "./isBottomPineTile.js";
import { getDominantFoliageType, generateFoliageTileMap } from "./generateFoliageTileMap.js";

const PINE_CONFIG = {
  tiles: PINE_TILES,
  defaultType: DEFAULT_PINE_TYPE,
  typeProperty: "pineType",
  isBottomRight: isBottomRightPineTile,
  isBottomLeft: isBottomLeftPineTile,
};

export function getDominantPineType(valueMap, x, y) {
  return getDominantFoliageType(valueMap, x, y, "pineType", DEFAULT_PINE_TYPE);
}

export function generatePineTileMap(valueMap) {
  return generateFoliageTileMap(valueMap, PINE_CONFIG);
}
