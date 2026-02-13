import { describe, it, expect, vi } from "vitest";

// Mock constants before importing the module under test
vi.mock("./constants.js", () => ({ MAP_SIZE: 4 }));

import { generateTreeTileMap, getDominantTreeType } from "./generateTreeTileMap.js";

/**
 * Helper: create a MAP_SIZE x MAP_SIZE value map filled with a given value.
 * Optionally set treeType on cells.
 */
function makeValueMap(size, defaultValue, treeTypeOverrides = {}) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      const cell = { value: defaultValue };
      const key = `${x},${y}`;
      if (key in treeTypeOverrides) {
        cell.treeType = treeTypeOverrides[key];
      }
      map[y][x] = cell;
    }
  }
  return map;
}

describe("getDominantTreeType", () => {
  it("returns 1 when no cells have treeType set", () => {
    const map = makeValueMap(4, 0);
    expect(getDominantTreeType(map, 1, 1)).toBe(1);
  });

  it("returns the treeType when all 4 neighbors have the same type", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 3,
      "1,0": 3,
      "0,1": 3,
      "1,1": 3,
    });
    expect(getDominantTreeType(map, 1, 1)).toBe(3);
  });

  it("returns the most common treeType in a 2x2 neighborhood", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 2,
      "1,0": 2,
      "0,1": 3,
      "1,1": 2,
    });
    // x=1, y=1 -> neighborhood is (0,0), (1,0), (0,1), (1,1) -> 3x type 2, 1x type 3
    expect(getDominantTreeType(map, 1, 1)).toBe(2);
  });

  it("defaults absent treeType to 1 when counting", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 2,
      // (1,0), (0,1), (1,1) have no treeType -> default 1
    });
    // 1x type 2, 3x type 1 -> dominant is 1
    expect(getDominantTreeType(map, 1, 1)).toBe(1);
  });

  it("handles edge cells (x=0, y=0) gracefully", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 4,
    });
    // At x=0, y=0 the neighborhood top-left/top-right/bottom-left are out of bounds
    // Only (0,0) is valid -> type 4 should be returned (out-of-bounds default to type 1)
    // Actually: neighborhood for (x,y) is (x-1,y-1), (x,y-1), (x-1,y), (x,y)
    // At (0,0): (-1,-1) OOB->1, (0,-1) OOB->1, (-1,0) OOB->1, (0,0)->4
    // counts: {1: 3, 4: 1} -> dominant is 1
    expect(getDominantTreeType(map, 0, 0)).toBe(1);
  });
});

describe("generateTreeTileMap", () => {
  it("generates a tile map with trees for a fully-tree value map", () => {
    // All cells value=0 means tree present everywhere
    const map = makeValueMap(4, 0);
    const tileMap = generateTreeTileMap(map);

    // Should produce non-empty tile entries
    let hasTiles = false;
    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x] && tileMap[y][x].tile > 0) {
          hasTiles = true;
        }
      }
    }
    expect(hasTiles).toBe(true);
  });

  it("generates no tree tiles for an empty value map (all value=1)", () => {
    // All cells value=1 means no trees
    const map = makeValueMap(4, 1);
    const tileMap = generateTreeTileMap(map);

    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x]) {
          expect(tileMap[y][x].tile).toBe(0);
        }
      }
    }
  });

  it("uses TREE_TILES indices from the dominant tree type", () => {
    // All cells are tree type 2 with value 0
    const overrides = {};
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        overrides[`${x},${y}`] = 2;
      }
    }
    const map = makeValueMap(4, 0, overrides);
    const tileMap = generateTreeTileMap(map);

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

    // All indices should be from the TREE_TILES[2] set
    // (which is currently the same as type 1: 1225, 1226, 1249, 1250, 1282, 1283)
    const validTiles = new Set([1225, 1226, 1249, 1250, 1282, 1283]);
    for (const idx of tileIndices) {
      expect(validTiles.has(idx)).toBe(true);
    }
  });
});
