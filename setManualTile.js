import { getTileSpritePosition } from "./getTileSpritePosition.js";

/**
 * Places or clears a manual tile at (x, y) in the manual tile map.
 * Mutates the map in place.
 * @param {Array} manualTileMap - 2D array from createManualTileMap
 * @param {number} x - Grid x coordinate
 * @param {number} y - Grid y coordinate
 * @param {number|null} tileIndex - Tile index to place, or null to clear
 */
export function setManualTile(manualTileMap, x, y, tileIndex) {
  if (!manualTileMap || manualTileMap.length === 0) return;
  if (y < 0 || y >= manualTileMap.length) return;
  if (x < 0 || !manualTileMap[y] || x >= manualTileMap[y].length) return;

  if (tileIndex === null) {
    manualTileMap[y][x] = null;
    return;
  }

  manualTileMap[y][x] = {
    tileIndex,
    spritePosition: getTileSpritePosition(tileIndex),
  };
}
