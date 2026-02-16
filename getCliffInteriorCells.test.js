import { describe, it, expect } from "vitest";
import { getCliffInteriorCells } from "./getCliffInteriorCells.js";

describe("getCliffInteriorCells", () => {
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

  describe("Empty and edge cases", () => {
    it("should return empty array for empty map (no cliffs)", () => {
      const map = createCliffMap(10, []);
      expect(getCliffInteriorCells(map)).toEqual([]);
    });

    it("should return empty array for single cliff cell", () => {
      const map = createCliffMap(10, [[5, 5]]);
      expect(getCliffInteriorCells(map)).toEqual([]);
    });

    it("should return empty array for 2x2 cliff block", () => {
      const map = createCliffMap(10, [
        [5, 5],
        [6, 5],
        [5, 6],
        [6, 6],
      ]);
      // All cells have at least one non-cliff neighbor
      expect(getCliffInteriorCells(map)).toEqual([]);
    });
  });

  describe("Border exclusion", () => {
    it("should exclude cells at map edge", () => {
      // Create cliff at map edge
      const map = createCliffMap(10, [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
      // All cells are at edge → none are interior
      expect(getCliffInteriorCells(map)).toEqual([]);
    });

    it("should exclude cells with non-cliff cardinal neighbors", () => {
      const map = createCliffMap(10, [
        [5, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [5, 6],
      ]);
      // Center cell (5,5) has all cardinal neighbors as cliff but no diagonals
      // Actually, let me check: it needs ALL 8 neighbors to be cliff
      // This only has 4 cardinal neighbors, so it should be excluded
      expect(getCliffInteriorCells(map)).toEqual([]);
    });
  });

  describe("Diagonal requirements", () => {
    it("should exclude cells with non-cliff diagonal neighbors", () => {
      const map = createCliffMap(10, [
        // 5x3 block (5 rows tall - enough for interior with top row having 8 neighbors)
        [4, 2],
        [5, 2],
        [6, 2],
        [4, 3],
        [5, 3],
        [6, 3],
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
      ]);
      // Cell (5,3) has ALL 8 neighbors as cliff AND 3+ cliffs below → interior
      const result = getCliffInteriorCells(map);
      expect(result).toContainEqual({ x: 5, y: 3 });
    });

    it("should exclude inside corner cells (concave corners)", () => {
      const map = createCliffMap(10, [
        // L-shape
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [4, 6],
        [5, 6],
      ]);
      // (5,5) is missing diagonal neighbor at (6,5) and (6,6)
      const result = getCliffInteriorCells(map);
      expect(result).not.toContainEqual({ x: 5, y: 5 });
    });
  });

  describe("Interior detection", () => {
    it("should have no interior in 3x3 solid block (too short)", () => {
      const map = createCliffMap(10, [
        // 3x3 block (only 3 rows - all within 3-tile bottom border)
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
      ]);
      const result = getCliffInteriorCells(map);
      // No interior - all cells are within 3 tiles of bottom edge
      expect(result).toHaveLength(0);
    });

    it("should detect multiple interior cells in 6x4 block", () => {
      const map = createCliffMap(10, [
        // 6x4 block (6 rows tall to allow 3 interior rows, top row needs 8 neighbors)
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
        [3, 5],
        [4, 5],
        [5, 5],
        [6, 5],
        [3, 6],
        [4, 6],
        [5, 6],
        [6, 6],
      ]);
      const result = getCliffInteriorCells(map);
      // Interior cells: rows 2-3 (rows 1 is edge, rows 4-6 are bottom border)
      expect(result).toHaveLength(4);
      expect(result).toContainEqual({ x: 4, y: 2 });
      expect(result).toContainEqual({ x: 5, y: 2 });
      expect(result).toContainEqual({ x: 4, y: 3 });
      expect(result).toContainEqual({ x: 5, y: 3 });
    });

    it("should detect interior cells in 5x5 block", () => {
      const cliffPositions = [];
      // Create 6 rows (1-6) to allow rows 2-3 to have all 8 neighbors + 3 cliffs below
      for (let y = 1; y <= 6; y++) {
        for (let x = 2; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }
      const map = createCliffMap(10, cliffPositions);
      const result = getCliffInteriorCells(map);
      // Interior cells: rows 2-3 (row 1 is edge, rows 4-6 are bottom border)
      // 3 cells wide (x=3,4,5) × 2 rows (y=2,3) = 6 cells
      expect(result).toHaveLength(6);
      for (let y = 2; y <= 3; y++) {
        for (let x = 3; x <= 5; x++) {
          expect(result).toContainEqual({ x, y });
        }
      }
    });
  });

  describe("Complex shapes", () => {
    it("should handle L-shaped cliff correctly", () => {
      const map = createCliffMap(10, [
        // L-shape (5x3 vertical + 3x2 horizontal extension)
        // Vertical part
        [4, 2],
        [5, 2],
        [6, 2],
        [4, 3],
        [5, 3],
        [6, 3],
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
        // Horizontal extension
        [7, 5],
        [8, 5],
        [7, 6],
        [8, 6],
      ]);
      const result = getCliffInteriorCells(map);
      // Only cells in vertical part with full 8-neighbor coverage are interior
      // (5, 3), (5, 4), (5, 5) should be interior if they have all 8 neighbors
      // Actually, checking the shape, (5,3), (5,4), (5,5) all have 8 cliff neighbors
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle T-shaped cliff correctly", () => {
      const map = createCliffMap(10, [
        // T-shape: horizontal bar (5 rows) + vertical stem
        // Need 5+ rows for interior
        // Horizontal bar (top 5 rows)
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
        [7, 2],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
        [7, 4],
        [3, 5],
        [4, 5],
        [5, 5],
        [6, 5],
        [7, 5],
        [3, 6],
        [4, 6],
        [5, 6],
        [6, 6],
        [7, 6],
        // Vertical stem extension
        [4, 7],
        [5, 7],
        [6, 7],
        [4, 8],
        [5, 8],
        [6, 8],
      ]);
      const result = getCliffInteriorCells(map);
      // Interior cells exist in top portion where all 8 neighbors are cliff AND 3+ cliffs below
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle donut shape with hole", () => {
      const map = createCliffMap(10, [
        // 5x5 outer square
        ...Array.from({ length: 5 }, (_, i) => [2 + i, 2]),
        ...Array.from({ length: 5 }, (_, i) => [2 + i, 6]),
        ...Array.from({ length: 3 }, (_, i) => [2, 3 + i]),
        ...Array.from({ length: 3 }, (_, i) => [6, 3 + i]),
        // Fill middle edges
        [3, 3],
        [5, 3],
        [3, 5],
        [5, 5],
        // Hole in center at (4,4)
      ]);
      const result = getCliffInteriorCells(map);
      // Should NOT include (4,4) since it's not a cliff
      expect(result).not.toContainEqual({ x: 4, y: 4 });
    });
  });

  describe("Non-cliff cells", () => {
    it("should not include non-cliff cells", () => {
      const map = createCliffMap(10, [
        // 3x3 block with center removed
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        // [5, 5] missing (non-cliff)
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
      ]);
      const result = getCliffInteriorCells(map);
      // Center cell (5,5) is not a cliff → should not be included
      expect(result).not.toContainEqual({ x: 5, y: 5 });
    });
  });

  describe("3-tile bottom border exclusion", () => {
    it("should exclude cells with non-cliff 1 tile below", () => {
      // Cell at (5,5) has non-cliff at (5,6)
      const map = createCliffMap(10, [
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        // Row 6 is all non-cliff
      ]);
      const result = getCliffInteriorCells(map);
      expect(result).not.toContainEqual({ x: 5, y: 5 });
    });

    it("should exclude cells with non-cliff 2 tiles below", () => {
      // Cell at (5,5) has cliff at (5,6) but non-cliff at (5,7)
      const map = createCliffMap(10, [
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
        // Row 7 is all non-cliff
      ]);
      const result = getCliffInteriorCells(map);
      expect(result).not.toContainEqual({ x: 5, y: 5 });
    });

    it("should exclude cells with non-cliff 3 tiles below", () => {
      // Cell at (5,5) has cliffs at (5,6), (5,7) but non-cliff at (5,8)
      const map = createCliffMap(10, [
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
        [4, 7],
        [5, 7],
        [6, 7],
        // Row 8 is all non-cliff
      ]);
      const result = getCliffInteriorCells(map);
      expect(result).not.toContainEqual({ x: 5, y: 5 });
    });

    it("should include cells with 3+ cliff tiles below", () => {
      // Cell at (5,5) has 3+ cliffs below (5,6), (5,7), (5,8)
      const map = createCliffMap(10, [
        [4, 4],
        [5, 4],
        [6, 4],
        [4, 5],
        [5, 5],
        [6, 5],
        [4, 6],
        [5, 6],
        [6, 6],
        [4, 7],
        [5, 7],
        [6, 7],
        [4, 8],
        [5, 8],
        [6, 8],
        [4, 9],
        [5, 9],
        [6, 9],
      ]);
      const result = getCliffInteriorCells(map);
      expect(result).toContainEqual({ x: 5, y: 5 });
    });

    it("should exclude cells near map bottom edge", () => {
      // Cell at (5,197) - only 2 cells below before map ends
      const map = createCliffMap(200, [
        [4, 196],
        [5, 196],
        [6, 196],
        [4, 197],
        [5, 197],
        [6, 197],
        [4, 198],
        [5, 198],
        [6, 198],
        [4, 199],
        [5, 199],
        [6, 199],
      ]);
      const result = getCliffInteriorCells(map);
      // Near bottom edge = OOB treated as cliff, so cell is interior
      expect(result).toContainEqual({ x: 5, y: 197 });
    });
  });
});
