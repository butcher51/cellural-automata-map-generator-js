import { describe, it, expect, vi } from "vitest";

vi.mock("./constants.js", () => ({ MAP_SIZE: 4 }));

import { generateDeadTreeTileMap, getDominantDeadTreeType } from "./generateDeadTreeTileMap.js";

function makeValueMap(size, defaultValue, deadTreeTypeOverrides = {}) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      const cell = { value: defaultValue };
      const key = `${x},${y}`;
      if (key in deadTreeTypeOverrides) {
        cell.deadTreeType = deadTreeTypeOverrides[key];
      }
      map[y][x] = cell;
    }
  }
  return map;
}

describe("getDominantDeadTreeType", () => {
  it("returns 1 when no cells have deadTreeType set", () => {
    const map = makeValueMap(4, 0);
    expect(getDominantDeadTreeType(map, 1, 1)).toBe(1);
  });

  it("returns the deadTreeType when all 4 neighbors have the same type", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 1,
      "1,0": 1,
      "0,1": 1,
      "1,1": 1,
    });
    expect(getDominantDeadTreeType(map, 1, 1)).toBe(1);
  });

  it("defaults absent deadTreeType to 1 when counting", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 2,
    });
    expect(getDominantDeadTreeType(map, 1, 1)).toBe(1);
  });

  it("handles edge cells (x=0, y=0) gracefully", () => {
    const map = makeValueMap(4, 0, {
      "0,0": 1,
    });
    expect(getDominantDeadTreeType(map, 0, 0)).toBe(1);
  });
});

describe("generateDeadTreeTileMap", () => {
  it("generates a tile map with entries for a fully-populated value map", () => {
    const map = makeValueMap(4, 0);
    const tileMap = generateDeadTreeTileMap(map);

    let hasEntries = false;
    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x] && tileMap[y][x].tile !== undefined) {
          hasEntries = true;
        }
      }
    }
    expect(hasEntries).toBe(true);
  });

  it("generates no dead tree tiles for an empty value map (all value=1)", () => {
    const map = makeValueMap(4, 1);
    const tileMap = generateDeadTreeTileMap(map);

    for (let y = 0; y < 4; y++) {
      if (!tileMap[y]) continue;
      for (let x = 0; x < 4; x++) {
        if (tileMap[y][x]) {
          expect(tileMap[y][x].tile).toBe(0);
        }
      }
    }
  });
});
