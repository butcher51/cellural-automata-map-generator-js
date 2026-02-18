import { describe, it, expect, vi } from "vitest";
import { generateWaterValueMap } from "./generateWaterValueMap.js";

vi.mock("./constants.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MAP_SIZE: 50,
    LAKE_NOISE_DENSITY: 0.35,
    LAKE_CA_ITERATIONS: 12,
    LAKE_SEED_OFFSET: 10000,
    SEED: 42,
  };
});

describe("generateWaterValueMap", () => {
  it("should create a map with correct dimensions", () => {
    const map = generateWaterValueMap();
    expect(map).toHaveLength(50);
    for (const row of map) {
      expect(row).toHaveLength(50);
    }
  });

  it("should have cells with tile and value properties", () => {
    const map = generateWaterValueMap();
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        expect(map[y][x]).toHaveProperty("tile");
        expect(map[y][x]).toHaveProperty("value");
      }
    }
  });

  it("should only contain values of 0 or 1", () => {
    const map = generateWaterValueMap();
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        expect([0, 1]).toContain(map[y][x].value);
      }
    }
  });

  it("should have tile values of 0", () => {
    const map = generateWaterValueMap();
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        expect(map[y][x].tile).toBe(0);
      }
    }
  });

  it("should contain some water cells (value 1)", () => {
    const map = generateWaterValueMap();
    let hasWater = false;
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        if (map[y][x].value === 1) {
          hasWater = true;
          break;
        }
      }
      if (hasWater) break;
    }
    expect(hasWater).toBe(true);
  });

  it("should be reproducible with the same seed", () => {
    const map1 = generateWaterValueMap();
    const map2 = generateWaterValueMap();
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        expect(map1[y][x].value).toBe(map2[y][x].value);
      }
    }
  });
});
