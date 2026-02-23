import { DEAD_TREE_TILES, DEFAULT_DEAD_TREE_TYPE } from "./deadTreeTileConstants.js";
import { isBottomRightDeadTreeTile, isBottomLeftDeadTreeTile } from "./isBottomDeadTreeTile.js";
import { getDominantFoliageType, generateFoliageTileMap } from "./generateFoliageTileMap.js";

const DEAD_TREE_CONFIG = {
  tiles: DEAD_TREE_TILES,
  defaultType: DEFAULT_DEAD_TREE_TYPE,
  typeProperty: "deadTreeType",
  isBottomRight: isBottomRightDeadTreeTile,
  isBottomLeft: isBottomLeftDeadTreeTile,
};

export function getDominantDeadTreeType(valueMap, x, y) {
  return getDominantFoliageType(valueMap, x, y, "deadTreeType", DEFAULT_DEAD_TREE_TYPE);
}

export function generateDeadTreeTileMap(valueMap) {
  return generateFoliageTileMap(valueMap, DEAD_TREE_CONFIG);
}
