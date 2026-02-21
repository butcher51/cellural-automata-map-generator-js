import {
  LAKE_CA_ITERATIONS,
  LAKE_CLUSTER_RADIUS,
  LAKE_COUNT,
  LAKE_SEED_OFFSET,
  MAP_SIZE,
} from "./constants.js";
import { generateClusteredLakeNoiseMap } from "./generateClusteredLakeNoiseMap.js";
import { applyOrganicIterations } from "./map-utils.js";

export function generateWaterValueMap() {
  const noiseMap = generateClusteredLakeNoiseMap(
    MAP_SIZE,
    LAKE_COUNT,
    LAKE_CLUSTER_RADIUS,
    LAKE_SEED_OFFSET,
  );
  const organicMap = applyOrganicIterations(noiseMap, LAKE_CA_ITERATIONS);

  const map = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      map[y][x] = { tile: 0, value: organicMap[y][x].value };
    }
  }
  return map;
}
