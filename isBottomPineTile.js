import { PINE_TILES } from "./pineTileConstants.js";

// Build sets of bottom pine tile indices for efficient lookup
const bottomRightPineTiles = new Set();
const bottomLeftPineTiles = new Set();

// Populate sets from PINE_TILES configuration
for (const pineType in PINE_TILES) {
  const tiles = PINE_TILES[pineType];
  bottomRightPineTiles.add(tiles.bottomRight);
  bottomLeftPineTiles.add(tiles.bottomLeft);
}

export function isBottomRightPineTile(tile) {
  return bottomRightPineTiles.has(tile);
}

export function isBottomLeftPineTile(tile) {
  return bottomLeftPineTiles.has(tile);
}
