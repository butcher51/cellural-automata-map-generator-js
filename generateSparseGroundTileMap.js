import { GROUND_TILES, SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

/**
 * Creates a mapSize x mapSize array, null everywhere except at specified cell positions
 * which get ground tiles. Reuses tiles from existingGroundTileMap where available.
 * @param {Array<{x: number, y: number}>} cells - Positions to place ground tiles
 * @param {number} mapSize - Width and height of the map
 * @param {Array|null} existingGroundTileMap - Optional existing map to preserve tiles from
 * @returns {Array} 2D array of ground tile objects or null
 */
export function generateSparseGroundTileMap(cells, mapSize, existingGroundTileMap = null) {
  const random = createRandom(SEED);

  // Initialize null grid
  const tileMap = [];
  for (let y = 0; y < mapSize; y++) {
    tileMap[y] = [];
    for (let x = 0; x < mapSize; x++) {
      tileMap[y][x] = null;
    }
  }

  // Place ground tiles at specified positions
  for (const cell of cells) {
    const { x, y } = cell;

    // Skip out-of-bounds
    if (x < 0 || x >= mapSize || y < 0 || y >= mapSize) {
      continue;
    }

    // Reuse existing tile if available
    if (existingGroundTileMap && existingGroundTileMap[y]?.[x] != null) {
      tileMap[y][x] = existingGroundTileMap[y][x];
    } else {
      // Generate new random ground tile
      const tile = getRandomTile(GROUND_TILES, random);
      tileMap[y][x] = { tile, spritePosition: getTileSpritePosition(tile) };
    }
  }

  return tileMap;
}
