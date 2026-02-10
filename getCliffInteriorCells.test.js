import { describe, it, expect } from "vitest";
import { getCliffInteriorCells } from "./getCliffInteriorCells.js";

// Helper to create a value map of given size filled with 0s
function createEmptyMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { value: 0 };
    }
  }
  return map;
}

// Helper to set a block of cells to value 1
function setBlock(map, startX, startY, width, height) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
        map[y][x].value = 1;
      }
    }
  }
}

describe("getCliffInteriorCells", () => {
  it("returns empty array for empty map", () => {
    const result = getCliffInteriorCells([]);
    expect(result).toEqual([]);
  });

  it("returns empty array for all-zero map", () => {
    const map = createEmptyMap(5);
    const result = getCliffInteriorCells(map);
    expect(result).toEqual([]);
  });

  it("returns empty array for a single cliff cell", () => {
    const map = createEmptyMap(5);
    map[2][2].value = 1;
    const result = getCliffInteriorCells(map);
    expect(result).toEqual([]);
  });

  it("returns 1 interior cell for 3x3 cliff block in middle of map", () => {
    const map = createEmptyMap(7);
    setBlock(map, 2, 2, 3, 3);
    const result = getCliffInteriorCells(map);
    // Center cell (3,3) has all 4 cardinal neighbors as cliff, so it's interior
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 3, y: 3 });
  });

  it("returns 1 interior cell for 3x3 cliff block at map corner", () => {
    const map = createEmptyMap(5);
    setBlock(map, 0, 0, 3, 3);
    const result = getCliffInteriorCells(map);
    // (1,1) is not at edge and has all 4 cardinal neighbors as cliff → interior
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 1, y: 1 });
  });

  it("returns empty for 2x2 cliff block (all are borders)", () => {
    const map = createEmptyMap(6);
    setBlock(map, 2, 2, 2, 2);
    const result = getCliffInteriorCells(map);
    // Each cell has at least one non-cliff cardinal neighbor
    expect(result).toEqual([]);
  });

  it("returns 3x3 interior for 5x5 cliff block", () => {
    const map = createEmptyMap(9);
    setBlock(map, 2, 2, 5, 5);
    const result = getCliffInteriorCells(map);
    // Interior cells are the 3x3 center: (3,3) to (5,5)
    expect(result).toHaveLength(9);
    const positions = result.map((c) => `${c.x},${c.y}`).sort();
    expect(positions).toEqual([
      "3,3", "3,4", "3,5",
      "4,3", "4,4", "4,5",
      "5,3", "5,4", "5,5",
    ].sort());
  });

  it("returns empty array for plus/cross shape (center has non-cliff diagonals)", () => {
    // Plus shape:
    //   X
    //  XXX
    //   X
    const map = createEmptyMap(7);
    map[2][3].value = 1; // top
    map[3][2].value = 1; // left
    map[3][3].value = 1; // center
    map[3][4].value = 1; // right
    map[4][3].value = 1; // bottom
    const result = getCliffInteriorCells(map);
    // Center (3,3) has all 4 cardinal neighbors as cliff, but all 4 diagonals are non-cliff
    expect(result).toHaveLength(0);
  });

  it("excludes concave corner cell from interior in L-shaped cliff", () => {
    // L-shape (5 wide, 5 tall with a 2x3 cutout in top-right):
    //  XXXXX
    //  XXXXX
    //  XX...
    //  XX...
    //  XX...
    const map = createEmptyMap(9);
    setBlock(map, 2, 2, 5, 2); // top 5x2
    setBlock(map, 2, 4, 2, 3); // bottom-left 2x3
    const result = getCliffInteriorCells(map);
    // Cell (3,3) has all 4 cardinal neighbors as cliff, but diagonal (4,4) is non-cliff
    // so it should NOT be interior (it's a concave corner)
    const positions = result.map((c) => `${c.x},${c.y}`);
    expect(positions).not.toContain("3,3");
  });

  it("handles multiple separate cliff regions", () => {
    const map = createEmptyMap(15);
    // First 5x5 region at (1,1)
    setBlock(map, 1, 1, 5, 5);
    // Second 5x5 region at (9,9)
    setBlock(map, 9, 9, 5, 5);
    const result = getCliffInteriorCells(map);
    // Each 5x5 block has 3x3 interior = 9 cells each = 18 total
    expect(result).toHaveLength(18);
  });

  it("does not mutate the input map", () => {
    const map = createEmptyMap(9);
    setBlock(map, 2, 2, 5, 5);
    const originalValues = JSON.stringify(map);
    getCliffInteriorCells(map);
    expect(JSON.stringify(map)).toBe(originalValues);
  });

  it("returns empty for cliff cells at map edges (edges count as borders)", () => {
    // Fill entire edge row/col - they're all border cells
    const map = createEmptyMap(5);
    setBlock(map, 0, 0, 5, 1); // top row
    const result = getCliffInteriorCells(map);
    expect(result).toEqual([]);
  });

  it("handles 4x4 cliff block (2x2 interior)", () => {
    const map = createEmptyMap(8);
    setBlock(map, 2, 2, 4, 4);
    const result = getCliffInteriorCells(map);
    // Interior: (3,3), (3,4), (4,3), (4,4)
    expect(result).toHaveLength(4);
    const positions = result.map((c) => `${c.x},${c.y}`).sort();
    expect(positions).toEqual(["3,3", "3,4", "4,3", "4,4"].sort());
  });
});
