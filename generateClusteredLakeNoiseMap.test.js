import { describe, it, expect, vi } from "vitest";
import { generateClusteredLakeNoiseMap } from "./generateClusteredLakeNoiseMap.js";

vi.mock("./constants.js", () => ({
  SEED: 42,
}));

describe("generateClusteredLakeNoiseMap", () => {
  // Basic structure tests
  it("should create a map with correct dimensions", () => {
    const map = generateClusteredLakeNoiseMap(10, 2, 3, 10000);
    expect(map).toHaveLength(10);
    for (const row of map) {
      expect(row).toHaveLength(10);
    }
  });

  it("should only contain cells with value 0 or 1", () => {
    const map = generateClusteredLakeNoiseMap(20, 2, 3, 10000);
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        expect([0, 1]).toContain(map[y][x].value);
      }
    }
  });

  it("should create independent cell objects", () => {
    const map = generateClusteredLakeNoiseMap(10, 2, 3, 10000);
    map[0][0].value = 99;
    expect(map[0][1].value).not.toBe(99);
    expect(map[1][0].value).not.toBe(99);
  });

  it("should return 2D array in correct format with {value: 0|1}", () => {
    const map = generateClusteredLakeNoiseMap(5, 1, 3, 10000);
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(map[y][x]).toHaveProperty("value");
        expect(typeof map[y][x].value).toBe("number");
      }
    }
  });

  // Seeding tests
  it("should create clusters of water around seed points", () => {
    const size = 50;
    const lakeCount = 2;
    const clusterRadius = 5;
    const map = generateClusteredLakeNoiseMap(size, lakeCount, clusterRadius, 10000);

    let waterCount = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) waterCount++;
      }
    }
    expect(waterCount).toBeGreaterThan(0);
  });

  it("should respect map boundaries (no overflow)", () => {
    const map = generateClusteredLakeNoiseMap(20, 3, 10, 10000);
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        expect([0, 1]).toContain(map[y][x].value);
      }
    }
  });

  // Edge cases
  it("should produce empty map when lakeCount = 0", () => {
    const map = generateClusteredLakeNoiseMap(10, 0, 3, 10000);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(map[y][x].value).toBe(0);
      }
    }
  });

  it("should produce single cluster when lakeCount = 1", () => {
    const size = 30;
    const map = generateClusteredLakeNoiseMap(size, 1, 4, 10000);
    let waterCount = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) waterCount++;
      }
    }
    expect(waterCount).toBeGreaterThan(0);
  });

  it("should handle clusterRadius = 0", () => {
    const map = generateClusteredLakeNoiseMap(20, 2, 0, 10000);
    let waterCount = 0;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (map[y][x].value === 1) waterCount++;
      }
    }
    // With radius 0, only seed points themselves (at most lakeCount cells)
    expect(waterCount).toBeLessThanOrEqual(2);
  });

  it("should handle large clusterRadius", () => {
    const size = 50;
    const map = generateClusteredLakeNoiseMap(size, 1, 25, 10000);
    let waterCount = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) waterCount++;
      }
    }
    // Large radius should fill significant area
    const waterDensity = waterCount / (size * size);
    expect(waterDensity).toBeGreaterThan(0.1);
  });

  it("should handle small map sizes (10x10)", () => {
    const map = generateClusteredLakeNoiseMap(10, 1, 2, 10000);
    expect(map).toHaveLength(10);
    for (const row of map) {
      expect(row).toHaveLength(10);
    }
  });

  // Reproducibility tests
  it("should be reproducible with the same seed offset", () => {
    const map1 = generateClusteredLakeNoiseMap(20, 2, 4, 10000);
    const map2 = generateClusteredLakeNoiseMap(20, 2, 4, 10000);
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        expect(map1[y][x].value).toBe(map2[y][x].value);
      }
    }
  });

  it("should produce different results with different seed offsets", () => {
    const map1 = generateClusteredLakeNoiseMap(20, 2, 4, 10000);
    const map2 = generateClusteredLakeNoiseMap(20, 2, 4, 20000);
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

  // Cluster quality tests
  it("should create compact irregular clusters", () => {
    const size = 60;
    const map = generateClusteredLakeNoiseMap(size, 1, 8, 10000);

    // Find bounding box
    let minX = size, maxX = 0, minY = size, maxY = 0;
    let waterCount = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          waterCount++;
        }
      }
    }

    // Blobs should be compact (not extremely elongated)
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const aspectRatio = Math.max(width, height) / Math.min(width, height);
    expect(aspectRatio).toBeLessThan(3); // More lenient than circular test
    expect(waterCount).toBeGreaterThan(20); // Should have reasonable size
  });

  it("should produce water in multiple locations when lakeCount > 1", () => {
    const size = 60;
    const map = generateClusteredLakeNoiseMap(size, 3, 4, 10000);

    // Count water cells per quadrant (rough clustering detection)
    const quadrants = [0, 0, 0, 0]; // [TL, TR, BL, BR]
    const half = size / 2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (map[y][x].value === 1) {
          const quadrant = (y < half ? 0 : 2) + (x < half ? 0 : 1);
          quadrants[quadrant]++;
        }
      }
    }

    // With 3 lakes, at least 2 quadrants should have water
    const nonEmptyQuadrants = quadrants.filter(q => q > 0).length;
    expect(nonEmptyQuadrants).toBeGreaterThanOrEqual(2);
  });
});
