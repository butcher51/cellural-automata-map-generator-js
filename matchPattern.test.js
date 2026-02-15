import { describe, expect, it } from "vitest";
import { matchPattern } from "./matchPattern.js";

function createMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ value: v })));
}

describe("matchPattern", () => {
  describe("Basic Functionality - Centered Matching", () => {
    it("should return true for exact 1x1 match centered at (0,0)", () => {
      const valueMap = createMap([[1]]);
      const pattern = [[1]];
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(true);
    });

    it("should return false for 1x1 mismatch centered at (0,0)", () => {
      const valueMap = createMap([[1]]);
      const pattern = [[0]];
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(false);
    });

    it("should match 3x3 pattern centered at (1,1)", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (1,1) spans from (0,0) to (2,2)
      expect(matchPattern(valueMap, pattern, 1, 1)).toBe(true);
    });

    it("should not match 3x3 pattern when values differ", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];
      expect(matchPattern(valueMap, pattern, 1, 1)).toBe(false);
    });

    it("should match 5x5 pattern centered at (2,2)", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      // Pattern centered at (2,2) spans from (0,0) to (4,4)
      expect(matchPattern(valueMap, pattern, 2, 2)).toBe(true);
    });
  });

  describe("Centered Position Offset", () => {
    it("should match 3x3 pattern centered at (2, 2) in larger map", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (2,2) spans from (1,1) to (3,3)
      expect(matchPattern(valueMap, pattern, 2, 2)).toBe(true);
    });

    it("should not match when centered pattern doesn't align", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (1,1) spans from (0,0) to (2,2) - won't match
      expect(matchPattern(valueMap, pattern, 1, 1)).toBe(false);
    });

    it("should match 1x1 pattern at any position", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]);
      const pattern = [[1]];
      // 1x1 pattern centered at (1,1) is just that cell
      expect(matchPattern(valueMap, pattern, 1, 1)).toBe(true);
    });
  });

  describe("Boundary Cases - Centered", () => {
    it("should return false when centered pattern extends beyond right edge", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (2,1) would extend from (1,0) to (3,2) - x=3 is out of bounds
      expect(matchPattern(valueMap, pattern, 2, 1)).toBe(false);
    });

    it("should return false when centered pattern extends beyond bottom edge", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (1,2) would extend from (0,1) to (2,3) - y=3 is out of bounds
      expect(matchPattern(valueMap, pattern, 1, 2)).toBe(false);
    });

    it("should return false when centered pattern extends beyond top-left", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const pattern = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
      // Pattern centered at (0,0) would extend from (-1,-1) to (1,1) - negative coords
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(false);
    });

    it("should return false when x coordinate is negative", () => {
      const valueMap = createMap([[1, 1]]);
      const pattern = [[1]];
      expect(matchPattern(valueMap, pattern, -1, 0)).toBe(false);
    });

    it("should return false when y coordinate is negative", () => {
      const valueMap = createMap([[1], [1]]);
      const pattern = [[1]];
      expect(matchPattern(valueMap, pattern, 0, -1)).toBe(false);
    });

    it("should return false when coordinates are out of bounds", () => {
      const valueMap = createMap([[1]]);
      const pattern = [[1]];
      expect(matchPattern(valueMap, pattern, 5, 5)).toBe(false);
    });
  });

  describe("Complex Patterns - Centered", () => {
    it("should match 3x3 cross pattern centered at (2,2)", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
      // Pattern centered at (2,2) spans from (1,1) to (3,3)
      expect(matchPattern(valueMap, pattern, 2, 2)).toBe(true);
    });

    it("should match 5x5 pattern with cross in center", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1],
      ];
      // Pattern centered at (3,3) spans from (1,1) to (5,5)
      expect(matchPattern(valueMap, pattern, 3, 3)).toBe(true);
    });

    it("should not match when pattern values differ", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];
      expect(matchPattern(valueMap, pattern, 2, 2)).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should return false for empty pattern", () => {
      const valueMap = createMap([[1]]);
      const pattern = [];
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(false);
    });

    it("should return false for empty pattern row", () => {
      const valueMap = createMap([[1]]);
      const pattern = [[]];
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(false);
    });

    it("should return false for empty valueMap", () => {
      const valueMap = [];
      const pattern = [[1]];
      expect(matchPattern(valueMap, pattern, 0, 0)).toBe(false);
    });

    it("should handle 2x2 even-sized pattern centered between cells", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
      const pattern = [
        [1, 1],
        [1, 1],
      ];
      // 2x2 pattern: offset = floor(2/2) = 1
      // Centered at (1,1): startX = 1-1=0, startY = 1-1=0, spans from (0,0) to (1,1)
      expect(matchPattern(valueMap, pattern, 1, 1)).toBe(true);
    });

    it("should handle 4x4 even-sized pattern centered", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
      const pattern = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1],
      ];
      // 4x4 pattern: offset = floor(4/2) = 2
      // Centered at (2,2): startX = 2-2=0, startY = 2-2=0, spans from (0,0) to (3,3)
      expect(matchPattern(valueMap, pattern, 2, 2)).toBe(true);
    });
  });
});
