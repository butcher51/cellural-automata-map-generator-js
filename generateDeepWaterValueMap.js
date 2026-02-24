import { DEEP_WATER_GAP } from "./constants.js";

/**
 * Generates a deep water value map by eroding the water value map inward.
 * Each erosion iteration removes water cells that have any non-water cardinal
 * neighbor (or are at the map edge). After `gap` iterations, only cells that
 * are at least `gap` tiles deep inside a lake remain.
 *
 * @param {Array<Array<{tile: number, value: number}>>} waterValueMap
 * @param {number} [gap=DEEP_WATER_GAP] - Number of erosion iterations
 * @returns {Array<Array<{tile: number, value: number}>>} Deep water value map
 */
export function generateDeepWaterValueMap(waterValueMap, gap = DEEP_WATER_GAP) {
  const height = waterValueMap.length;
  if (height === 0) return [];
  const width = waterValueMap[0].length;

  // Start with a copy of the water values (1 = water, 0 = land)
  let current = waterValueMap.map((row) =>
    row.map((cell) => cell.value)
  );

  for (let iter = 0; iter < gap; iter++) {
    const next = current.map((row) => [...row]);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (current[y][x] !== 1) continue;

        // Check if at map edge or has non-water cardinal neighbor
        if (
          y === 0 ||
          y === height - 1 ||
          x === 0 ||
          x === width - 1 ||
          current[y - 1][x] !== 1 ||
          current[y + 1][x] !== 1 ||
          current[y][x - 1] !== 1 ||
          current[y][x + 1] !== 1
        ) {
          next[y][x] = 0;
        }
      }
    }

    current = next;
  }

  // Convert back to {tile: 0, value: 0|1} format
  return current.map((row) =>
    row.map((value) => ({ tile: 0, value }))
  );
}
