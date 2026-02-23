import { TREE_TILES, DEFAULT_TREE_TYPE } from "./treeTileConstants.js";
import { isBottomRightTreeTile, isBottomLeftTreeTile } from "./isBottomTreeTile.js";
import { getDominantFoliageType, generateFoliageTileMap } from "./generateFoliageTileMap.js";

const TREE_CONFIG = {
  tiles: TREE_TILES,
  defaultType: DEFAULT_TREE_TYPE,
  typeProperty: "treeType",
  isBottomRight: isBottomRightTreeTile,
  isBottomLeft: isBottomLeftTreeTile,
};

export function getDominantTreeType(valueMap, x, y) {
  return getDominantFoliageType(valueMap, x, y, "treeType", DEFAULT_TREE_TYPE);
}

export function generateTreeTileMap(valueMap) {
  return generateFoliageTileMap(valueMap, TREE_CONFIG);
}
