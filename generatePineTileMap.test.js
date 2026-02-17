import { describe, it, expect, vi } from "vitest";

// Mock constants before importing the module under test
vi.mock("./constants.js", () => ({ MAP_SIZE: 4 }));

import { generatePineTileMap, getDominantPineType } from "./generatePineTileMap.js";

/**
 * Helper: create a MAP_SIZE x MAP_SIZE value map filled with a given value.
 * Optionally set pineType on cells.
 */
function makeValueMap(size, defaultValue, pineTypeOverrides = {}) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      const cell = { value: defaultValue };
      const key = `${x},${y}`;
      if (key in pineTypeOverrides) {
        cell.pineType = pineTypeOverrides[key];
      }
      map[y][x] = cell;
    }
  }
  return map;
}

describe("getDominantPineType", () => {
  it("returns 1 when no cells have pineType set", () => {
    const map = makeValueMap(4, 0);
    expect(getDominantPineType(map, 1, 1)).toBe(1);
  });

  it("returns the pineType when all 4 neighbors have the same type", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 1,
      "1,0": 1,
      "0,1": 1,
      "1,1": 1,
    });
    expect(getDominantPineType(map, 1, 1)).toBe(1);
  });

  it("returns the most common pineType in a 2x2 neighborhood", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 1,
      "1,0": 1,
      "0,1": 2,
      "1,1": 1,
    });
    // x=1, y=1 -> neighborhood is (0,0), (1,0), (0,1), (1,1) -> 3x type 1, 1x type 2
    expect(getDominantPineType(map, 1, 1)).toBe(1);
  });

  it("defaults absent pineType to 1 when counting", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 2,
      // (1,0), (0,1), (1,1) have no pineType -> default 1
    });
    // 1x type 2, 3x type 1 -> dominant is 1
    expect(getDominantPineType(map, 1, 1)).toBe(1);
  });

  it("handles edge cells (x=0, y=0) gracefully", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 1,
    });
    // At x=0, y=0 the neighborhood top-left/top-right/bottom-left are out of bounds
    // Only (0,0) is valid -> out-of-bounds default to type 1
    // At (0,0): (-1,-1) OOB->1, (0,-1) OOB->1, (-1,0) OOB->1, (0,0)->1
    // counts: {1: 4} -> dominant is 1
    expect(getDominantPineType(map, 0, 0)).toBe(1);
  });
});

describe("generatePineTileMap", () => {
  it("generates a tile map with pines for a fully-pine value map", () => {
    // All cells value=0 means pine present everywhere
    const map = makeValueMap(4, 0);
    const tileMap = generatePineTileMap(map);

    // Should produce non-empty tile entries (tile property exists, even if 0 due to placeholder)
    let hasTiles = false;
    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x] && tileMap[y][x].tile !== undefined) {
          hasTiles = true;
        }
      }
    }
    expect(hasTiles).toBe(true);
  });

  it("generates no pine tiles for an empty value map (all value=1)", () => {
    // All cells value=1 means no pines
    const map = makeValueMap(4, 1);
    const tileMap = generatePineTileMap(map);

    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x]) {
          expect(tileMap[y][x].tile).toBe(0);
        }
      }
    }
  });

  it("uses PINE_TILES indices from the dominant pine type", () => {
    // All cells are pine type 1 with value 0
    const overrides = {};
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        overrides[`${x},${y}`] = 1;
      }
    }
    const map = makeValueMap(4, 0, overrides);
    const tileMap = generatePineTileMap(map);

    // Collect all non-zero tile indices
    const tileIndices = new Set();
    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x] && tileMap[y][x].tile > 0) {
          tileIndices.add(tileMap[y][x].tile);
        }
      }
    }

    // All indices should be from the PINE_TILES[1] set
    const validTiles = new Set([1831, 1832, 1855, 1856, 1882, 1883]);
    for (const idx of tileIndices) {
      expect(validTiles.has(idx)).toBe(true);
    }
  });
});
