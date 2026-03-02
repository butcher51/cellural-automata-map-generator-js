import { describe, it, expect } from "vitest";
import {
  LINE_TILE_TILES,
  LINE_TILE_SHAPES,
  DEFAULT_LINE_TILE_TYPE,
  isLineTileTool,
  getLineTileType,
} from "./lineTileTileConstants.js";

const ALL_SHAPE_KEYS = [
  "HORIZONTAL",
  "VERTICAL",
  "CORNER_LEFT_TOP",
  "CORNER_LEFT_BOTTOM",
  "CORNER_RIGHT_TOP",
  "CORNER_RIGHT_BOTTOM",
  "END_TOP",
  "END_BOTTOM",
  "END_LEFT",
  "END_RIGHT",
  "T_TOP",
  "T_BOTTOM",
  "T_LEFT",
  "T_RIGHT",
  "MIDDLE",
];

const ALL_SHAPE_VALUES = ALL_SHAPE_KEYS.map((key) => LINE_TILE_SHAPES[key]);

describe("LINE_TILE_SHAPES", () => {
  it("exports all 15 shape constants", () => {
    expect(Object.keys(LINE_TILE_SHAPES)).toHaveLength(15);
  });

  it("has all expected shape keys", () => {
    for (const key of ALL_SHAPE_KEYS) {
      expect(LINE_TILE_SHAPES).toHaveProperty(key);
    }
  });

  it("each shape value is a unique lowercase string matching its key", () => {
    const values = Object.values(LINE_TILE_SHAPES);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(15);

    for (const [key, value] of Object.entries(LINE_TILE_SHAPES)) {
      expect(typeof value).toBe("string");
    }
  });
});

describe("LINE_TILE_TILES", () => {
  it("has keys 1 through 4", () => {
    expect(Object.keys(LINE_TILE_TILES).map(Number)).toEqual([1, 2, 3, 4]);
  });

  it("each type has all 15 shapes", () => {
    for (let i = 1; i <= 4; i++) {
      const type = LINE_TILE_TILES[i];
      for (const shape of ALL_SHAPE_VALUES) {
        expect(type).toHaveProperty(shape);
      }
    }
  });

  it("each shape within each type has a spritePosition with spriteX and spriteY", () => {
    for (let i = 1; i <= 4; i++) {
      for (const shape of ALL_SHAPE_VALUES) {
        const shapeData = LINE_TILE_TILES[i][shape];
        expect(shapeData).toHaveProperty("spritePosition");
        expect(shapeData.spritePosition).not.toBeNull();
        expect(typeof shapeData.spritePosition.spriteX).toBe("number");
        expect(typeof shapeData.spritePosition.spriteY).toBe("number");
      }
    }
  });

  it("all shapes within the same type share the same spritePosition for now", () => {
    for (let i = 1; i <= 4; i++) {
      const firstShape = LINE_TILE_TILES[i][ALL_SHAPE_VALUES[0]];
      for (const shape of ALL_SHAPE_VALUES) {
        expect(LINE_TILE_TILES[i][shape].spritePosition).toEqual(
          firstShape.spritePosition
        );
      }
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
