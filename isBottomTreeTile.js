import { TREE_TILES } from "./treeTileConstants.js";

const ALL_BOTTOM_RIGHT = new Set(Object.values(TREE_TILES).map(t => t.bottomRight));
const ALL_BOTTOM_LEFT = new Set(Object.values(TREE_TILES).map(t => t.bottomLeft));

export function isBottomRightTreeTile(tile) {
  return ALL_BOTTOM_RIGHT.has(tile);
}

export function isBottomLeftTreeTile(tile) {
  return ALL_BOTTOM_LEFT.has(tile);
}
