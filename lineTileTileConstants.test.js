import { describe, it, expect } from "vitest";
import {
  LINE_TILE_TILES,
  DEFAULT_LINE_TILE_TYPE,
  isLineTileTool,
  getLineTileType,
} from "./lineTileTileConstants.js";

describe("LINE_TILE_TILES", () => {
  it("has keys 1 through 4", () => {
    expect(Object.keys(LINE_TILE_TILES).map(Number)).toEqual([1, 2, 3, 4]);
  });

  it("each type has a spritePosition with spriteX and spriteY", () => {
    for (let i = 1; i <= 4; i++) {
      expect(LINE_TILE_TILES[i]).toHaveProperty("spritePosition");
      expect(LINE_TILE_TILES[i].spritePosition).not.toBeNull();
      expect(typeof LINE_TILE_TILES[i].spritePosition.spriteX).toBe("number");
      expect(typeof LINE_TILE_TILES[i].spritePosition.spriteY).toBe("number");
    }
  });
});

describe("DEFAULT_LINE_TILE_TYPE", () => {
  it("is 1", () => {
    expect(DEFAULT_LINE_TILE_TYPE).toBe(1);
  });
});

describe("isLineTileTool", () => {
  it('returns true for "lineTile-1" through "lineTile-4"', () => {
    expect(isLineTileTool("lineTile-1")).toBe(true);
    expect(isLineTileTool("lineTile-2")).toBe(true);
    expect(isLineTileTool("lineTile-3")).toBe(true);
    expect(isLineTileTool("lineTile-4")).toBe(true);
  });

  it("returns false for non-lineTile tools", () => {
    expect(isLineTileTool("eraser")).toBe(false);
    expect(isLineTileTool("water")).toBe(false);
    expect(isLineTileTool("cliff")).toBe(false);
    expect(isLineTileTool("tree-1")).toBe(false);
    expect(isLineTileTool("lineTile")).toBe(false);
    expect(isLineTileTool("lineTile-0")).toBe(false);
    expect(isLineTileTool("lineTile-5")).toBe(false);
  });
});

describe("getLineTileType", () => {
  it("extracts the number from the tool string", () => {
    expect(getLineTileType("lineTile-1")).toBe(1);
    expect(getLineTileType("lineTile-2")).toBe(2);
    expect(getLineTileType("lineTile-3")).toBe(3);
    expect(getLineTileType("lineTile-4")).toBe(4);
  });

  it("returns DEFAULT_LINE_TILE_TYPE for invalid input", () => {
    expect(getLineTileType("eraser")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile-0")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile-5")).toBe(DEFAULT_LINE_TILE_TYPE);
  });
});
