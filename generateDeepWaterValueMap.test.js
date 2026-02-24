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
      // OOB = water, so all 4 cardinal neighbors are water -> survives erosion
      const waterMap = createMap([[1]]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      expect(result[0][0].value).toBe(1);
    });

    it("should handle single-cell land input", () => {
      const waterMap = createMap([[0]]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      expect(result[0][0].value).toBe(0);
    });
  });

  describe("Erosion behavior", () => {
    it("should produce no deep water for lake surrounded by land smaller than 2*gap+1", () => {
      // 3x3 water surrounded by land, gap=2 -> need 5x5 minimum for any deep water
      const waterMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 2);
      const values = extractValues(result);

      // All water cells should be eroded (lake too small for gap=2)
      expect(values).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    });

    it("should preserve all cells for 3x3 all-water with gap=1 (OOB=water)", () => {
      // All neighbors (including OOB) are water, so nothing erodes
      const waterMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      expect(values).toEqual([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
    });

    it("should preserve all cells for 9x9 all-water with gap=4 (OOB=water)", () => {
      // All water, OOB=water -> no erosion at all
      const waterMap = createMap(
        Array.from({ length: 9 }, () => Array(9).fill(1))
      );
      const result = generateDeepWaterValueMap(waterMap, 4);
      const values = extractValues(result);

      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          expect(values[y][x]).toBe(1);
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

    it("should erode from land boundary but not from map edge", () => {
      // Water strip along top edge with land below -> erodes from land, not from edge
      const waterMap = createMap([
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // Top row: cells have land neighbor below -> erode
      expect(values[0]).toEqual([0, 0, 0]);
    });

    it("should erode L-shaped lakes correctly with OOB=water", () => {
      const waterMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0],
        [1, 1, 1, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // (0,0): OOB neighbors are water, all in-bounds neighbors are water -> survives
      expect(values[0][0]).toBe(1);
      // (1,1): all cardinal neighbors are water -> survives
      expect(values[1][1]).toBe(1);
      // (2,2): all cardinal neighbors are water -> survives
      expect(values[2][2]).toBe(1);
      // (2,3): south neighbor (3,3)=0 land -> erodes
      expect(values[2][3]).toBe(0);
      // (3,2): east neighbor (3,3)=0 land -> erodes
      expect(values[3][2]).toBe(0);
    });

    it("should erode progressively from land boundaries", () => {
      // 7x7 water surrounded by land border
      const waterMap = createMap([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]);

      // gap=1 -> 3x3 interior survives (9 cells)
      const result1 = generateDeepWaterValueMap(waterMap, 1);
      const values1 = extractValues(result1);
      let count1 = 0;
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (values1[y][x] === 1) count1++;
        }
      }
      expect(count1).toBe(9);

      // gap=2 -> only center cell survives
      const result2 = generateDeepWaterValueMap(waterMap, 2);
      const values2 = extractValues(result2);
      let count2 = 0;
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (values2[y][x] === 1) count2++;
        }
      }
      expect(count2).toBe(1);
      expect(values2[3][3]).toBe(1);
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
      // DEEP_WATER_GAP = 4, 9x9 all-water with OOB=water -> all cells survive
      const waterMap = createMap(
        Array.from({ length: 9 }, () => Array(9).fill(1))
      );
      const result = generateDeepWaterValueMap(waterMap);
      const values = extractValues(result);

      // OOB = water, so no erosion happens on an all-water map
      let count = 0;
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (values[y][x] === 1) count++;
        }
      }
      expect(count).toBe(81); // all cells survive
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

  describe("Edge behavior (OOB treated as water)", () => {
    it("should preserve deep water at map corners and edges when water fills to edge", () => {
      // 5x5 all-water, gap=2 -> all cells survive (OOB=water)
      const waterMap = createMap(
        Array.from({ length: 5 }, () => Array(5).fill(1))
      );
      const result = generateDeepWaterValueMap(waterMap, 2);
      const values = extractValues(result);

      // Corner cells should survive (all OOB/water neighbors)
      expect(values[0][0]).toBe(1);
      expect(values[0][4]).toBe(1);
      expect(values[4][0]).toBe(1);
      expect(values[4][4]).toBe(1);
      // Edge midpoints
      expect(values[0][2]).toBe(1);
      expect(values[2][0]).toBe(1);
      // Center
      expect(values[2][2]).toBe(1);
    });

    it("should erode from land boundaries but not from map edges", () => {
      // Water fills left half, land on right
      const waterMap = createMap([
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // Column 0: left OOB=water, right neighbor=water -> survives
      expect(values[0][0]).toBe(1);
      expect(values[2][0]).toBe(1);
      expect(values[4][0]).toBe(1);
      // Column 1: right neighbor=land -> erodes
      expect(values[0][1]).toBe(0);
      expect(values[2][1]).toBe(0);
      expect(values[4][1]).toBe(0);
    });

    it("should handle water at one edge with land on opposite side (gap=2)", () => {
      // 5 rows: water top 4, land bottom row
      const waterMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 2);
      const values = extractValues(result);

      // Row 0,1: far from land (OOB=water above) -> survive
      expect(values[0][2]).toBe(1);
      expect(values[1][2]).toBe(1);
      // Row 2: exactly 2 away from land row 4 -> eroded (row 3 erodes first iter, row 2 second)
      expect(values[2][2]).toBe(0);
      // Row 3: adjacent to land -> erodes first iter
      expect(values[3][2]).toBe(0);
    });

    it("should handle L-shape touching map boundary", () => {
      // Water L-shape touching top and left edges
      const waterMap = createMap([
        [1, 1, 1, 0, 0],
        [1, 1, 1, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
      ]);
      const result = generateDeepWaterValueMap(waterMap, 1);
      const values = extractValues(result);

      // (0,0): OOB-left=water, OOB-top=water, right=water, down=water -> survives
      expect(values[0][0]).toBe(1);
      // (0,2): right neighbor=land -> erodes
      expect(values[0][2]).toBe(0);
      // (1,1): up=water, down=water, left=water, right=water -> survives
      expect(values[1][1]).toBe(1);
      // (2,1): right neighbor=land -> erodes
      expect(values[2][1]).toBe(0);
      // (4,0): OOB-left=water, OOB-bottom=water, up=water, right=water -> survives
      expect(values[4][0]).toBe(1);
    });

    it("should erode progressively from land boundary across multiple gap values", () => {
      // 1x7 vertical strip of water with land on the right side
      const waterMap = createMap([
        [1, 1, 1, 1, 1, 1, 0],
      ]);
      // gap=1: column 5 erodes (adjacent to land)
      const result1 = generateDeepWaterValueMap(waterMap, 1);
      const values1 = extractValues(result1);
      expect(values1[0]).toEqual([1, 1, 1, 1, 1, 0, 0]);

      // gap=2: columns 4-5 erode
      const result2 = generateDeepWaterValueMap(waterMap, 2);
      const values2 = extractValues(result2);
      expect(values2[0]).toEqual([1, 1, 1, 1, 0, 0, 0]);

      // gap=3: columns 3-5 erode
      const result3 = generateDeepWaterValueMap(waterMap, 3);
      const values3 = extractValues(result3);
      expect(values3[0]).toEqual([1, 1, 1, 0, 0, 0, 0]);
    });
  });
});
