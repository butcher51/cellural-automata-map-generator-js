import { setManualTile } from "./setManualTile.js";
import { MAP_SIZE } from "./constants.js";

export function stampManualTileSelection(manualTileMap, x, y, selection) {
  if (!selection || !selection.tiles) return;
  const tiles = selection.tiles;
  for (let dy = 0; dy < tiles.length; dy++) {
    for (let dx = 0; dx < tiles[0].length; dx++) {
      const tx = x + dx;
      const ty = y + dy;
      if (tx >= 0 && tx < MAP_SIZE && ty >= 0 && ty < MAP_SIZE) {
        setManualTile(manualTileMap, tx, ty, tiles[dy][dx]);
      }
    }
  }
}
