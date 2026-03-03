import { TILESETS, TILE_SIZE } from "./tilesetConfig.js";

export function getTileSpritePosition(tileIndex) {
  let remaining = tileIndex - 1; // to 0-based
  for (let i = 0; i < TILESETS.length; i++) {
    if (remaining < TILESETS[i].totalTiles) {
      const col = remaining % TILESETS[i].tilesPerRow;
      const row = Math.floor(remaining / TILESETS[i].tilesPerRow);
      return { spriteX: col * TILE_SIZE, spriteY: row * TILE_SIZE, tilesetIndex: i };
    }
    remaining -= TILESETS[i].totalTiles;
  }
  return { spriteX: 0, spriteY: 0, tilesetIndex: 0 }; // fallback
}
