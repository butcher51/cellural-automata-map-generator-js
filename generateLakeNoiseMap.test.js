import { describe, it, expect, vi } from "vitest";
import { generateLakeNoiseMap } from "./generateLakeNoiseMap.js";

vi.mock("./constants.js", () => ({
  SEED: 42,
}));

describe("generateLakeNoiseMap", () => {
  it("should create a map with correct dimensions", () => {
    const map = generateLakeNoiseMap(10, 0.35, 10000);
    expect(map).toHaveLength(10);
    for (const row of map) {
      expect(row).toHaveLength(10);
    }
  });

  it("should only contain cells with value 0 or 1", () => {
    const map = generateLakeNoiseMap(20, 0.35, 10000);
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        expect([0, 1]).toContain(map[y][x].value);
      }
    }
  });

  it("should produce density roughly matching the density parameter", () => {
    const size = 100;
    const density = 0.35;
    const map = generateLakeNoiseMap(size, density, 10000);
    let filledCount = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) filledCount++;
      }
    }
    const actualDensity = filledCount / (size * size);
    // Allow 10% tolerance
    expect(actualDensity).toBeGreaterThan(density - 0.1);
    expect(actualDensity).toBeLessThan(density + 0.1);
  });

  it("should be reproducible with the same seed", () => {
    const map1 = generateLakeNoiseMap(10, 0.35, 10000);
    const map2 = generateLakeNoiseMap(10, 0.35, 10000);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(map1[y][x].value).toBe(map2[y][x].value);
      }
    }
  });

  it("should produce different results with different seed offsets", () => {
    const map1 = generateLakeNoiseMap(20, 0.5, 10000);
    const map2 = generateLakeNoiseMap(20, 0.5, 20000);
    let hasDifference = false;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (map1[y][x].value !== map2[y][x].value) {
          hasDifference = true;
          break;
        }
      }
      if (hasDifference) break;
    }
    expect(hasDifference).toBe(true);
  });

  it("should create independent cell objects", () => {
    const map = generateLakeNoiseMap(5, 0.5, 10000);
    map[0][0].value = 99;
    expect(map[0][1].value).not.toBe(99);
    expect(map[1][0].value).not.toBe(99);
  });

  it("should handle size of 1", () => {
    const map = generateLakeNoiseMap(1, 0.5, 10000);
    expect(map).toHaveLength(1);
    expect(map[0]).toHaveLength(1);
    expect([0, 1]).toContain(map[0][0].value);
  });

  it("should produce all zeros with density 0", () => {
    const map = generateLakeNoiseMap(10, 0, 10000);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(map[y][x].value).toBe(0);
      }
    }
  });

  it("should produce all ones with density 1", () => {
    const map = generateLakeNoiseMap(10, 1, 10000);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(map[y][x].value).toBe(1);
      }
    }
  });
});
