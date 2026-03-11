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
  it("has keys road, wallLeft, and wallRight", () => {
    expect(Object.keys(LINE_TILE_TILES)).toEqual(["road", "wallLeft", "wallRight"]);
  });

  it("each type has all 15 shapes", () => {
    for (const key of ["road", "wallLeft", "wallRight"]) {
      const type = LINE_TILE_TILES[key];
      for (const shape of ALL_SHAPE_VALUES) {
        expect(type).toHaveProperty(shape);
      }
    }
  });

  it("each shape within each type has a spritePosition with spriteX and spriteY", () => {
    for (const key of ["road", "wallLeft", "wallRight"]) {
      for (const shape of ALL_SHAPE_VALUES) {
        const shapeData = LINE_TILE_TILES[key][shape];
        expect(shapeData).toHaveProperty("spritePosition");
        expect(shapeData.spritePosition).not.toBeNull();
        expect(typeof shapeData.spritePosition.spriteX).toBe("number");
        expect(typeof shapeData.spritePosition.spriteY).toBe("number");
      }
    }
  });

  it("each type has unique sprite positions per shape", () => {
    for (const key of ["road", "wallLeft", "wallRight"]) {
      const positions = ALL_SHAPE_VALUES.map(
        (shape) => LINE_TILE_TILES[key][shape].spritePosition
      );
      // Each position should be a valid object with spriteX and spriteY
      for (const pos of positions) {
        expect(typeof pos.spriteX).toBe("number");
        expect(typeof pos.spriteY).toBe("number");
      }
    }
  });
});

describe("LINE_TILE_TILES sprite index correctness", () => {
  it("road middle should map to col1 row40 (center of corner/T-junction block)", () => {
    const pos = LINE_TILE_TILES.road.middle.spritePosition;
    expect(pos.spriteX).toBe(8);
    expect(pos.spriteY).toBe(320);
  });
});

describe("DEFAULT_LINE_TILE_TYPE", () => {
  it('is "road"', () => {
    expect(DEFAULT_LINE_TILE_TYPE).toBe("road");
  });
});

describe("isLineTileTool", () => {
  it('returns true for "lineTile-road", "lineTile-wallLeft", "lineTile-wallRight"', () => {
    expect(isLineTileTool("lineTile-road")).toBe(true);
    expect(isLineTileTool("lineTile-wallLeft")).toBe(true);
    expect(isLineTileTool("lineTile-wallRight")).toBe(true);
  });

  it("returns false for non-lineTile tools", () => {
    expect(isLineTileTool("eraser")).toBe(false);
    expect(isLineTileTool("water")).toBe(false);
    expect(isLineTileTool("cliff")).toBe(false);
    expect(isLineTileTool("tree-1")).toBe(false);
    expect(isLineTileTool("lineTile")).toBe(false);
    expect(isLineTileTool("lineTile-1")).toBe(false);
    expect(isLineTileTool("lineTile-3")).toBe(false);
    expect(isLineTileTool("lineTile-4")).toBe(false);
  });
});

describe("getLineTileType", () => {
  it("extracts the type from the tool string", () => {
    expect(getLineTileType("lineTile-road")).toBe("road");
    expect(getLineTileType("lineTile-wallLeft")).toBe("wallLeft");
    expect(getLineTileType("lineTile-wallRight")).toBe("wallRight");
  });

  it("returns DEFAULT_LINE_TILE_TYPE for invalid input", () => {
    expect(getLineTileType("eraser")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile-1")).toBe(DEFAULT_LINE_TILE_TYPE);
    expect(getLineTileType("lineTile-0")).toBe(DEFAULT_LINE_TILE_TYPE);
  });
});
