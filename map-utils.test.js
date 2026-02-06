import { describe, it, expect } from "vitest";
import { clearDrawingFlags, isIslandBorderCell } from "./map-utils.js";

describe("clearDrawingFlags", () => {
  it("clears all true values in drawMap to false", () => {
    const drawMap = [
      [true, false, true],
      [false, true, false],
      [true, true, true],
    ];
    clearDrawingFlags(drawMap);
    for (let y = 0; y < drawMap.length; y++) {
      for (let x = 0; x < drawMap[y].length; x++) {
        expect(drawMap[y][x]).toBe(false);
      }
    }
  });

  it("handles already-cleared drawMap", () => {
    const drawMap = [
      [false, false, false],
      [false, false, false],
    ];
    clearDrawingFlags(drawMap);
    for (let y = 0; y < drawMap.length; y++) {
      for (let x = 0; x < drawMap[y].length; x++) {
        expect(drawMap[y][x]).toBe(false);
      }
    }
  });

  it("handles empty drawMap", () => {
    const drawMap = [];
    expect(() => clearDrawingFlags(drawMap)).not.toThrow();
    expect(drawMap.length).toBe(0);
  });
});

// Helper to create a simple value map with given dimensions and values
function createValueMap(values) {
  return values.map((row) => row.map((value) => ({ value })));
}

describe("isIslandBorderCell", () => {
  describe("edge detection (map boundaries)", () => {
    it("returns true for island cell at top edge", () => {
      // 3x3 map, island cell at top edge (y=0)
      const valueMap = createValueMap([
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 1, 0)).toBe(true);
    });

    it("returns true for island cell at bottom edge", () => {
      // 3x3 map, island cell at bottom edge (y=2)
      const valueMap = createValueMap([
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 1, 2)).toBe(true);
    });

    it("returns true for island cell at left edge", () => {
      // 3x3 map, island cell at left edge (x=0)
      const valueMap = createValueMap([
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 0, 1)).toBe(true);
    });

    it("returns true for island cell at right edge", () => {
      // 3x3 map, island cell at right edge (x=2)
      const valueMap = createValueMap([
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 2, 1)).toBe(true);
    });

    it("returns true for island cell at corner (multiple edges)", () => {
      // 3x3 map, island cell at top-left corner
      const valueMap = createValueMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 0, 0)).toBe(true);
    });
  });

  describe("cardinal neighbor detection", () => {
    it("returns true when north neighbor is non-island", () => {
      // 5x5 map, center cell with non-island neighbor above
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has non-island neighbor at (2, 1)
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(true);
    });

    it("returns true when south neighbor is non-island", () => {
      // 5x5 map, center cell with non-island neighbor below
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has non-island neighbor at (2, 3)
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(true);
    });

    it("returns true when west neighbor is non-island", () => {
      // 5x5 map, center cell with non-island neighbor to the left
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has non-island neighbor at (1, 2)
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(true);
    });

    it("returns true when east neighbor is non-island", () => {
      // 5x5 map, center cell with non-island neighbor to the right
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has non-island neighbor at (3, 2)
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(true);
    });
  });

  describe("interior cell detection", () => {
    it("returns false for interior cell with all island cardinal neighbors", () => {
      // 5x5 map, center cell completely surrounded by island cells
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has all cardinal neighbors as island cells
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(false);
    });

    it("ignores diagonal neighbors (only checks cardinal)", () => {
      // Cell with non-island diagonal neighbors but all cardinal neighbors are islands
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      // Cell at (2, 2) has non-island diagonal neighbors but all cardinal neighbors are islands
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(false);
    });
  });

  describe("3x3 island pattern (8 borders, 1 interior)", () => {
    it("correctly identifies all border cells in a 3x3 island", () => {
      // 5x5 map with 3x3 island in center
      const valueMap = createValueMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);

      // Border cells (8 total)
      expect(isIslandBorderCell(valueMap, 1, 1)).toBe(true); // top-left
      expect(isIslandBorderCell(valueMap, 2, 1)).toBe(true); // top-center
      expect(isIslandBorderCell(valueMap, 3, 1)).toBe(true); // top-right
      expect(isIslandBorderCell(valueMap, 1, 2)).toBe(true); // middle-left
      expect(isIslandBorderCell(valueMap, 3, 2)).toBe(true); // middle-right
      expect(isIslandBorderCell(valueMap, 1, 3)).toBe(true); // bottom-left
      expect(isIslandBorderCell(valueMap, 2, 3)).toBe(true); // bottom-center
      expect(isIslandBorderCell(valueMap, 3, 3)).toBe(true); // bottom-right

      // Interior cell (1 total)
      expect(isIslandBorderCell(valueMap, 2, 2)).toBe(false); // center
    });
  });

  describe("single cell island", () => {
    it("returns true for a single isolated island cell", () => {
      const valueMap = createValueMap([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 1, 1)).toBe(true);
    });

    it("returns true for single cell at map edge", () => {
      const valueMap = createValueMap([
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      expect(isIslandBorderCell(valueMap, 0, 0)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles 1x1 map", () => {
      const valueMap = createValueMap([[1]]);
      expect(isIslandBorderCell(valueMap, 0, 0)).toBe(true);
    });

    it("handles non-square maps", () => {
      // 2x4 map
      const valueMap = createValueMap([
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ]);
      // All cells should be borders since map is only 2 rows tall
      expect(isIslandBorderCell(valueMap, 0, 0)).toBe(true);
      expect(isIslandBorderCell(valueMap, 1, 0)).toBe(true);
      expect(isIslandBorderCell(valueMap, 2, 0)).toBe(true);
      expect(isIslandBorderCell(valueMap, 3, 0)).toBe(true);
      expect(isIslandBorderCell(valueMap, 0, 1)).toBe(true);
      expect(isIslandBorderCell(valueMap, 1, 1)).toBe(true);
      expect(isIslandBorderCell(valueMap, 2, 1)).toBe(true);
      expect(isIslandBorderCell(valueMap, 3, 1)).toBe(true);
    });
  });
});
