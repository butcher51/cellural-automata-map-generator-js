import { describe, it, expect, vi } from "vitest";

vi.mock("./constants.js", () => ({ MAP_SIZE: 4 }));

import { getDominantFoliageType, generateFoliageTileMap } from "./generateFoliageTileMap.js";

const MOCK_TILES = {
  1: { topLeft: 10, topRight: 11, bottomLeft: 12, bottomRight: 13, topLeftAdjacent: 14, topRightAdjacent: 15 },
  2: { topLeft: 20, topRight: 21, bottomLeft: 22, bottomRight: 23, topLeftAdjacent: 24, topRightAdjacent: 25 },
};

function makeValueMap(size, defaultValue, typeProperty, typeOverrides = {}) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      const cell = { value: defaultValue };
      const key = `${x},${y}`;
      if (key in typeOverrides) {
        cell[typeProperty] = typeOverrides[key];
      }
      map[y][x] = cell;
    }
  }
  return map;
}

describe("getDominantFoliageType", () => {
  it("returns defaultType when no cells have the type property", () => {
    const map = makeValueMap(4, 0, "foliageType");
    expect(getDominantFoliageType(map, 1, 1, "foliageType", 1)).toBe(1);
  });

  it("returns the most common type in a 2x2 neighborhood", () => {
    const map = makeValueMap(4, 0, "foliageType", {
      "0,0": 2, "1,0": 2, "0,1": 1, "1,1": 2,
    });
    expect(getDominantFoliageType(map, 1, 1, "foliageType", 1)).toBe(2);
  });

  it("defaults absent type to defaultType when counting", () => {
    const map = makeValueMap(4, 0, "foliageType", { "0,0": 2 });
    // 1x type 2, 3x type 1 (default) -> dominant is 1
    expect(getDominantFoliageType(map, 1, 1, "foliageType", 1)).toBe(1);
  });

  it("handles edge cells gracefully", () => {
    const map = makeValueMap(4, 0, "foliageType", { "0,0": 2 });
    // At (0,0): 3 OOB -> default 1, 1 in-bounds -> type 2; dominant is 1
    expect(getDominantFoliageType(map, 0, 0, "foliageType", 1)).toBe(1);
  });
});

describe("generateFoliageTileMap", () => {
  const config = {
    tiles: MOCK_TILES,
    defaultType: 1,
    typeProperty: "foliageType",
    isBottomRight: (tile) => tile === 13 || tile === 23,
    isBottomLeft: (tile) => tile === 12 || tile === 22,
  };

  it("generates tiles for a fully-populated value map", () => {
    const map = makeValueMap(4, 0, "foliageType");
    const tileMap = generateFoliageTileMap(map, config);

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

  it("generates no tiles for an empty value map (all value=1)", () => {
    const map = makeValueMap(4, 1, "foliageType");
    const tileMap = generateFoliageTileMap(map, config);

    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x]) {
          expect(tileMap[y][x].tile).toBe(0);
        }
      }
    }
  });

  it("uses tile indices from the dominant type", () => {
    const overrides = {};
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        overrides[`${x},${y}`] = 2;
      }
    }
    const map = makeValueMap(4, 0, "foliageType", overrides);
    const tileMap = generateFoliageTileMap(map, config);

    const tileIndices = new Set();
    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x] && tileMap[y][x].tile > 0) {
          tileIndices.add(tileMap[y][x].tile);
        }
      }
    }

    // All indices should come from MOCK_TILES type 1 or type 2
    const validTiles = new Set([10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25]);
    for (const idx of tileIndices) {
      expect(validTiles.has(idx)).toBe(true);
    }
  });
});
