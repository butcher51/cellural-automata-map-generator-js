import { GROUND_TILES, MAP_SIZE, SEED } from "./constants.js";
import { getRandomTile } from "./getRandomTile.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

const random = createRandom(SEED);

export function generateGroundTileMap() {
  const tileMap = [];
  let tile;

  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      tile = getRandomTile(GROUND_TILES, random);
      tileMap[y][x] = { tile, spritePosition: getTileSpritePosition(tile) };
    }
  }
  return tileMap;
}
