import { describe, it, expect } from "vitest";
import { getManualCursorPreviewCells } from "./getManualCursorPreviewCells.js";

describe("getManualCursorPreviewCells", () => {
  const mapSize = 10;

  it("returns single cell when selection is null", () => {
    const result = getManualCursorPreviewCells(3, 4, null, mapSize);
    expect(result).toEqual([{ x: 3, y: 4 }]);
  });

  it("returns single cell when selection is undefined", () => {
    const result = getManualCursorPreviewCells(3, 4, undefined, mapSize);
    expect(result).toEqual([{ x: 3, y: 4 }]);
  });

  it("returns single cell for a 1x1 selection", () => {
    const selection = { tilesetIndex: 0, tiles: [[5]] };
    const result = getManualCursorPreviewCells(2, 3, selection, mapSize);
    expect(result).toEqual([{ x: 2, y: 3 }]);
  });

  it("returns 6 cells for a 2x3 selection at (0,0)", () => {
    const selection = { tilesetIndex: 0, tiles: [[1, 2], [3, 4], [5, 6]] };
    const result = getManualCursorPreviewCells(0, 0, selection, mapSize);
    expect(result).toEqual([
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 },
    ]);
  });

  it("clips cells at map edge (right/bottom)", () => {
    const selection = { tilesetIndex: 0, tiles: [[1, 2], [3, 4]] };
    // Place at (9, 9) on a 10x10 map — only (9,9) is in bounds
    const result = getManualCursorPreviewCells(9, 9, selection, mapSize);
    expect(result).toEqual([{ x: 9, y: 9 }]);
  });

  it("returns empty array when selection is fully out of bounds", () => {
    const selection = { tilesetIndex: 0, tiles: [[1, 2]] };
    // Place at (10, 10) — all cells out of bounds on 10x10 map
    const result = getManualCursorPreviewCells(10, 10, selection, mapSize);
    expect(result).toEqual([]);
  });

  it("returns single cell fallback when selection has no tiles property", () => {
    const selection = { tilesetIndex: 0 };
    const result = getManualCursorPreviewCells(5, 5, selection, mapSize);
    expect(result).toEqual([{ x: 5, y: 5 }]);
  });

  it("handles partial clipping for larger selection at edge", () => {
    // 3x2 selection at (8, 0) on 10-wide map: cols 8,9 in bounds, col 10 clipped
    const selection = { tilesetIndex: 0, tiles: [[1, 2, 3], [4, 5, 6]] };
    const result = getManualCursorPreviewCells(8, 0, selection, mapSize);
    expect(result).toEqual([
      { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 8, y: 1 }, { x: 9, y: 1 },
    ]);
  });
});
