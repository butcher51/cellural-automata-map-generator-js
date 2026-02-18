import { SEED } from "./constants.js";
import { createRandom } from "./seed.js";

export function generateLakeNoiseMap(size, density, seedOffset) {
  const random = createRandom(SEED + seedOffset);

  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = {
        value: random() < density ? 1 : 0,
      };
    }
  }
  return map;
}
