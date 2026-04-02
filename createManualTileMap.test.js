import { describe, it, expect } from "vitest";
import { createManualTileMap } from "./createManualTileMap.js";

describe("createManualTileMap", () => {
  it("creates a MAP_SIZE x MAP_SIZE grid of nulls by default", () => {
    const map = createManualTileMap(10);
    expect(map.length).toBe(10);
    for (let y = 0; y < 10; y++) {
      expect(map[y].length).toBe(10);
      for (let x = 0; x < 10; x++) {
        expect(map[y][x]).toBe(null);
      }
    }
  });

  it("creates correct dimensions for non-square-like sizes", () => {
    const map = createManualTileMap(5);
    expect(map.length).toBe(5);
    for (const row of map) {
      expect(row.length).toBe(5);
    }
  });

  it("all cells are null", () => {
    const map = createManualTileMap(3);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toBeNull();
      }
    }
  });

  it("rows are independent (modifying one row does not affect others)", () => {
    const map = createManualTileMap(3);
    map[0][0] = { tileIndex: 1 };
    expect(map[1][0]).toBeNull();
    expect(map[2][0]).toBeNull();
  });

  it("returns empty array for size 0", () => {
    const map = createManualTileMap(0);
    expect(map).toEqual([]);
  });

  it("creates 1x1 grid for size 1", () => {
    const map = createManualTileMap(1);
    expect(map.length).toBe(1);
    expect(map[0].length).toBe(1);
    expect(map[0][0]).toBeNull();
  });
});
