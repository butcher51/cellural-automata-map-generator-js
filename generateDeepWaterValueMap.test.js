import { describe, expect, it } from "vitest";
import { generateDeepWaterValueMap } from "./generateDeepWaterValueMap.js";

// Helper to create a value map from a 2D pattern of 0s and 1s
function createMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ tile: 0, value: v })));
}

// Helper to extract just the values from a value map
function extractValues(valueMap) {
  return valueMap.map((row) => row.map((cell) => cell.value));
}

describe("generateDeepWaterValueMap", () => {
  describe("Basic structure", () => {
    it("should return a map with {tile: 0, value: 0|1} structure", () => {
      const waterMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          expect(result[y][x]).toHaveProperty("tile", 0);
          expect(result[y][x]).toHaveProperty("value");
          expect([0, 1]).toContain(result[y][x].value);
        }
      }
    });

    it("should preserve map dimensions", () => {
      const waterMap = createMap([
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(4);
    });
  });

  describe("Empty and small inputs", () => {
    it("should handle empty input", () => {
      const result = generateDeepWaterValueMap([], 1);
      expect(result).toEqual([]);
    });

    it("should handle single-cell water input", () => {
      const waterMap = createMap([[1]]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      expect(result[0][0].value).toBe(0);
    });

    it("should handle single-cell land input", () => {
      const waterMap = createMap([[0]]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      expect(result[0][0].value).toBe(0);
    });
  });

  describe("Erosion behavior", () => {
    it("should produce no deep water for lake smaller than 2*gap+1", () => {
      // 3x3 water with gap=2 -> need 5x5 minimum for any deep water
      const waterMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 2);
      const values = extractValues(result);

      expect(values).toEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });

    it("should leave only center cell for 3x3 water with gap=1", () => {
      const waterMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      expect(values).toEqual([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]);
    });

    it("should leave only center cell for 9x9 water with gap=4", () => {
      // 9x9 all water, gap=4 -> only cell (4,4) should remain
      const waterMap = createMap(
        Array.from({ length: 9 }, () => Array(9).fill(1))
      );
      const result = generateDeepWaterValueMap(waterMap, 4);
      const values = extractValues(result);

      // Only center cell should be deep water
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (y === 4 && x === 4) {
            expect(values[y][x]).toBe(1);
          } else {
            expect(values[y][x]).toBe(0);
          }
        }
      }
    });

    it("should return same as water when gap=0 (no erosion)", () => {
      const waterMap = createMap([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 0);
      const values = extractValues(result);

      expect(values).toEqual([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]);
    });

    it("should treat OOB as non-water (edge cells always erode)", () => {
      // A strip of water along the edge should erode away with gap=1
      const waterMap = createMap([
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // Top row: all cells are at map edge, so they erode
      expect(values[0]).toEqual([0, 0, 0]);
    });

    it("should erode L-shaped lakes correctly", () => {
      // L-shape: only cells far enough from all edges survive
      const waterMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0],
        [1, 1, 1, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // After 1 iteration of erosion:
      // - Edge cells of water body erode
      // - Cells adjacent to land erode
      // - Cells adjacent to map edge erode
      // The inner corner cells near the L bend should also erode
      expect(values[0][0]).toBe(0); // map edge
      expect(values[1][1]).toBe(1); // interior
      // (2,2): cardinal neighbors are (1,2)=water, (3,2)=water, (2,1)=water, (2,3)=water
      // All cardinal neighbors are water, so it survives gap=1 erosion
      expect(values[2][2]).toBe(1);
    });

    it("should erode progressively with multiple iterations", () => {
      // 5x5 all water, gap=1 -> 3x3 inner region survives
      const waterMap = createMap(
        Array.from({ length: 5 }, () => Array(5).fill(1))
      );
      const result1 = generateDeepWaterValueMap(waterMap, 1);
      const values1 = extractValues(result1);

      // 3x3 interior should survive
      let count1 = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (values1[y][x] === 1) count1++;
        }
      }
      expect(count1).toBe(9); // 3x3 = 9

      // 5x5 all water, gap=2 -> only center cell survives
      const result2 = generateDeepWaterValueMap(waterMap, 2);
      const values2 = extractValues(result2);

      let count2 = 0;
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (values2[y][x] === 1) count2++;
        }
      }
      expect(count2).toBe(1); // only center
      expect(values2[2][2]).toBe(1);
    });
  });

  describe("Immutability", () => {
    it("should not mutate the input water value map", () => {
      const waterMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const original = JSON.parse(JSON.stringify(waterMap));

      generateDeepWaterValueMap(waterMap, 1);

      expect(waterMap).toEqual(original);
    });
  });

  describe("Default gap parameter", () => {
    it("should use DEEP_WATER_GAP from constants when gap not provided", () => {
      // DEEP_WATER_GAP = 4, so a 9x9 lake should have exactly 1 deep water cell
      const waterMap = createMap(
        Array.from({ length: 9 }, () => Array(9).fill(1))
      );
      const result = generateDeepWaterValueMap(waterMap);
      const values = extractValues(result);

      let count = 0;
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (values[y][x] === 1) count++;
        }
      }
      expect(count).toBe(1);
      expect(values[4][4]).toBe(1);
    });
  });

  describe("Non-water cells remain non-water", () => {
    it("should never create deep water where there is no water", () => {
      const waterMap = createMap([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 0);
      const values = extractValues(result);

      expect(values).toEqual([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });
  });
});
