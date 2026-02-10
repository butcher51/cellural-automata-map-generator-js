import { describe, it, expect } from "vitest";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";

describe("generateEmptyValueMap", () => {
  it("creates a map of the given size", () => {
    const map = generateEmptyValueMap(5);
    expect(map).toHaveLength(5);
    for (const row of map) {
      expect(row).toHaveLength(5);
    }
  });

  it("all cells have value 0", () => {
    const map = generateEmptyValueMap(3);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toEqual({ value: 0 });
      }
    }
  });

  it("creates independent cell objects (no shared references)", () => {
    const map = generateEmptyValueMap(3);
    map[0][0].value = 1;
    expect(map[0][1].value).toBe(0);
    expect(map[1][0].value).toBe(0);
  });

  it("handles size 0", () => {
    const map = generateEmptyValueMap(0);
    expect(map).toEqual([]);
  });

  it("handles size 1", () => {
    const map = generateEmptyValueMap(1);
    expect(map).toHaveLength(1);
    expect(map[0]).toHaveLength(1);
    expect(map[0][0]).toEqual({ value: 0 });
  });

  it("uses custom defaultValue when provided", () => {
    const map = generateEmptyValueMap(3, 1);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toEqual({ value: 1 });
      }
    }
  });
});
