import { describe, it, expect, vi, beforeEach } from "vitest";
import { stampManualTileSelection } from "./stampManualTileSelection.js";

// Mock setManualTile so we can inspect calls without real dependencies
vi.mock("./setManualTile.js", () => ({
  setManualTile: vi.fn(),
}));

import { setManualTile } from "./setManualTile.js";

// Use a small MAP_SIZE for tests
vi.mock("./constants.js", () => ({
  MAP_SIZE: 10,
}));

describe("stampManualTileSelection", () => {
  beforeEach(() => {
    setManualTile.mockClear();
  });

  it("stamps a 1x1 tile at the correct position", () => {
    const map = [];
    const selection = { tilesetIndex: 0, tiles: [[42]] };

    stampManualTileSelection(map, 3, 5, selection);

    expect(setManualTile).toHaveBeenCalledTimes(1);
    expect(setManualTile).toHaveBeenCalledWith(map, 3, 5, 42);
  });

  it("stamps a 3x2 rectangle with correct tile indices", () => {
    const map = [];
    // 2 rows, 3 cols
    const selection = {
      tilesetIndex: 0,
      tiles: [
        [10, 11, 12],
        [34, 35, 36],
      ],
    };

    stampManualTileSelection(map, 1, 2, selection);

    expect(setManualTile).toHaveBeenCalledTimes(6);
    // Row 0: y=2
    expect(setManualTile).toHaveBeenCalledWith(map, 1, 2, 10);
    expect(setManualTile).toHaveBeenCalledWith(map, 2, 2, 11);
    expect(setManualTile).toHaveBeenCalledWith(map, 3, 2, 12);
    // Row 1: y=3
    expect(setManualTile).toHaveBeenCalledWith(map, 1, 3, 34);
    expect(setManualTile).toHaveBeenCalledWith(map, 2, 3, 35);
    expect(setManualTile).toHaveBeenCalledWith(map, 3, 3, 36);
  });

  it("skips cells that fall outside MAP_SIZE bounds", () => {
    const map = [];
    // 2x2 selection placed at (9, 9) on a 10x10 map — only (9,9) is in-bounds
    const selection = {
      tilesetIndex: 0,
      tiles: [
        [1, 2],
        [3, 4],
      ],
    };

    stampManualTileSelection(map, 9, 9, selection);

    expect(setManualTile).toHaveBeenCalledTimes(1);
    expect(setManualTile).toHaveBeenCalledWith(map, 9, 9, 1);
  });

  it("does nothing when selection is null", () => {
    const map = [];
    stampManualTileSelection(map, 0, 0, null);
    expect(setManualTile).not.toHaveBeenCalled();
  });

  it("does nothing when selection is undefined", () => {
    const map = [];
    stampManualTileSelection(map, 0, 0, undefined);
    expect(setManualTile).not.toHaveBeenCalled();
  });

  it("does nothing when selection has no tiles property", () => {
    const map = [];
    stampManualTileSelection(map, 0, 0, { tilesetIndex: 0 });
    expect(setManualTile).not.toHaveBeenCalled();
  });

  it("stamps near map edge with partial placement", () => {
    const map = [];
    // 3x3 selection at (8, 0) — only 2 columns fit (x=8,9), third is out
    const selection = {
      tilesetIndex: 0,
      tiles: [
        [10, 11, 12],
        [20, 21, 22],
        [30, 31, 32],
      ],
    };

    stampManualTileSelection(map, 8, 0, selection);

    // 3 rows * 2 in-bounds cols = 6 calls
    expect(setManualTile).toHaveBeenCalledTimes(6);
    expect(setManualTile).toHaveBeenCalledWith(map, 8, 0, 10);
    expect(setManualTile).toHaveBeenCalledWith(map, 9, 0, 11);
    expect(setManualTile).toHaveBeenCalledWith(map, 8, 1, 20);
    expect(setManualTile).toHaveBeenCalledWith(map, 9, 1, 21);
    expect(setManualTile).toHaveBeenCalledWith(map, 8, 2, 30);
    expect(setManualTile).toHaveBeenCalledWith(map, 9, 2, 31);
  });
});
