import { MAP_SIZE, SEED } from "./constants.js";
import { getTileSpritePosition } from "./getTileSpritePosition.js";
import { createRandom } from "./seed.js";

export function generateGroundTileMap(valueMap) {
  const tileMap = [];
  let tile;

  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      tile = getGroundTile();
      tileMap[y][x] = { tile, spritePosition: getTileSpritePosition(tile) };
    }
  }
  return tileMap;
}

const groundTiles = [
  { index: 1, chance: 1 },
  { index: 2, chance: 0.5 },
  { index: 3, chance: 0.1 },
  { index: 4, chance: 0.1 },
  { index: 24 + 1, chance: 0.1 },
  { index: 24 + 2, chance: 0.1 },
  { index: 24 + 3, chance: 0.1 },
  { index: 24 + 4, chance: 0.1 },
  { index: 48 + 1, chance: 0.1 },
  { index: 48 + 2, chance: 0.1 },
  { index: 48 + 3, chance: 0.01 },
  { index: 48 + 4, chance: 0.01 },
  { index: 72 + 1, chance: 0.01 },
  { index: 72 + 2, chance: 0.01 },
  { index: 72 + 3, chance: 0.01 },
  { index: 72 + 4, chance: 0.01 },
  { index: 96 + 1, chance: 0.01 },
  { index: 96 + 2, chance: 0.01 },
  { index: 96 + 3, chance: 0.01 },
  { index: 96 + 4, chance: 0.01 },
];

const random = createRandom(SEED);

function getGroundTile() {
  return groundTiles.reduce((selected, tile) => {
    if (random() < tile.chance) {
      return tile.index;
    }
    return selected;
  }, 1);
}
