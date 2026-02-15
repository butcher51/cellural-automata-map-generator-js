import { describe, it, expect } from "vitest";
import { isIslandBorderCell } from "./map-utils.js";

describe("isIslandBorderCell", () => {
  // Helper to create a cliff value map with specified cliff positions
  function createCliffMap(size, cliffPositions) {
    const map = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({ value: 0 }))
      );

    cliffPositions.forEach(([x, y]) => {
      map[y][x].value = 1;
    });

    return map;
  }

  describe("Map edge cells", () => {
    it("should return true for top edge cell", () => {
      const map = createCliffMap(10, [[5, 0]]);
      expect(isIslandBorderCell(map, 5, 0)).toBe(true);
    });

    it("should return true for bottom edge cell", () => {
      const map = createCliffMap(10, [[5, 9]]);
      expect(isIslandBorderCell(map, 5, 9)).toBe(true);
    });

    it("should return true for left edge cell", () => {
      const map = createCliffMap(10, [[0, 5]]);
      expect(isIslandBorderCell(map, 0, 5)).toBe(true);
    });

    it("should return true for right edge cell", () => {
      const map = createCliffMap(10, [[9, 5]]);
      expect(isIslandBorderCell(map, 9, 5)).toBe(true);
    });

    it("should return true for corner cell (top-left)", () => {
      const map = createCliffMap(10, [[0, 0]]);
      expect(isIslandBorderCell(map, 0, 0)).toBe(true);
    });

    it("should return true for corner cell (bottom-right)", () => {
      const map = createCliffMap(10, [[9, 9]]);
      expect(isIslandBorderCell(map, 9, 9)).toBe(true);
    });
  });

  describe("Border detection by neighbors", () => {
    it("should return true when top neighbor is non-cliff", () => {
      const map = createCliffMap(10, [
        // [5, 4] missing - non-cliff above
        [4, 5],
        [5, 5],
        [6, 5],
        [5, 6],
      ]);
      // (5,5) has non-cliff above at (5,4)
      expect(isIslandBorderCell(map, 5, 5)).toBe(true);
    });

    it("should return true when bottom neighbor is non-cliff", () => {
      const map = createCliffMap(10, [
        [5, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        // [5, 6] missing - non-cliff below
      ]);
      expect(isIslandBorderCell(map, 5, 5)).toBe(true);
    });

    it("should return true when left neighbor is non-cliff", () => {
      const map = createCliffMap(10, [
        [5, 4],
        // [4, 5] missing - non-cliff left
        [5, 5],
        [6, 5],
        [5, 6],
      ]);
      expect(isIslandBorderCell(map, 5, 5)).toBe(true);
    });

    it("should return true when right neighbor is non-cliff", () => {
      const map = createCliffMap(10, [
        [5, 4],
        [4, 5],
        [5, 5],
        // [6, 5] missing - non-cliff right
        [5, 6],
      ]);
      expect(isIslandBorderCell(map, 5, 5)).toBe(true);
    });
  });

  describe("Interior cells", () => {
    it("should return false for interior cell with all 4 cardinal neighbors as cliff", () => {
      const map = createCliffMap(10, [
        [5, 4], // top
        [4, 5], // left
        [5, 5], // center
        [6, 5], // right
        [5, 6], // bottom
      ]);
      expect(isIslandBorderCell(map, 5, 5)).toBe(false);
    });

    it("should return false for cell deep inside large cliff area", () => {
      // Create a 5x5 solid cliff block
      const cliffPositions = [];
      for (let y = 2; y <= 6; y++) {
        for (let x = 2; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }
      const map = createCliffMap(10, cliffPositions);
      // Center cell (4,4) has all cardinal neighbors as cliff
      expect(isIslandBorderCell(map, 4, 4)).toBe(false);
    });
  });

  describe("Non-cliff cells", () => {
    it("should return true for non-cliff cell (value = 0)", () => {
      const map = createCliffMap(10, [[5, 5]]);
      // Cell at (3, 3) is not a cliff
      expect(isIslandBorderCell(map, 3, 3)).toBe(true);
    });
  });
});
