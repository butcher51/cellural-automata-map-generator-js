import { describe, expect, it } from "vitest";
import { generateCliffValueMap } from "./generateCliffValueMap.js";

describe("generateCliffValueMap", () => {
  it("should return an array", () => {
    const result = generateCliffValueMap();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return a 2D array of correct dimensions", () => {
    const result = generateCliffValueMap();
    expect(result.length).toBeGreaterThan(0);
    for (const row of result) {
      expect(row.length).toBe(result.length);
    }
  });

  it("should initialize all cells with tile: 0 and value: 0", () => {
    const result = generateCliffValueMap();
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        expect(result[y][x]).toEqual({ tile: 0, value: 0 });
      }
    }
  });

  it("should return independent arrays (not shared references)", () => {
    const result = generateCliffValueMap();
    // Modifying one cell should not affect others
    result[0][0].value = 1;
    expect(result[0][1].value).toBe(0);
    expect(result[1][0].value).toBe(0);
  });

  it("should return independent rows (not shared references)", () => {
    const result = generateCliffValueMap();
    result[0][0] = { tile: 99, value: 99 };
    expect(result[1][0]).toEqual({ tile: 0, value: 0 });
  });
});
