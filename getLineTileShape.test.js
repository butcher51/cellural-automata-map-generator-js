import { describe, it, expect } from "vitest";
import { getLineTileShape } from "./getLineTileShape.js";
import { LINE_TILE_SHAPES } from "./lineTileTileConstants.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";

/**
 * Helper: creates a 3x3 value map and sets the center cell to value=1,
 * plus any neighbors indicated by the directions array.
 * Directions: "top", "bottom", "left", "right"
 */
function makeMap(directions) {
  const map = generateEmptyValueMap(3, 0);
  map[1][1].value = 1; // center
  for (const dir of directions) {
    if (dir === "top") map[0][1].value = 1;
    if (dir === "bottom") map[2][1].value = 1;
    if (dir === "left") map[1][0].value = 1;
    if (dir === "right") map[1][2].value = 1;
  }
  return map;
}

describe("getLineTileShape", () => {
  describe("0 connections (isolated tile)", () => {
    it("returns HORIZONTAL as default", () => {
      const map = makeMap([]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.HORIZONTAL);
    });
  });

  describe("1 connection (end pieces)", () => {
    it("returns END_TOP when only top neighbor", () => {
      const map = makeMap(["top"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.END_TOP);
    });

    it("returns END_BOTTOM when only bottom neighbor", () => {
      const map = makeMap(["bottom"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.END_BOTTOM);
    });

    it("returns END_LEFT when only left neighbor", () => {
      const map = makeMap(["left"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.END_LEFT);
    });

    it("returns END_RIGHT when only right neighbor", () => {
      const map = makeMap(["right"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.END_RIGHT);
    });
  });

  describe("2 connections (straights and corners)", () => {
    it("returns HORIZONTAL for left+right", () => {
      const map = makeMap(["left", "right"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.HORIZONTAL);
    });

    it("returns VERTICAL for top+bottom", () => {
      const map = makeMap(["top", "bottom"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.VERTICAL);
    });

    it("returns CORNER_LEFT_TOP for left+top", () => {
      const map = makeMap(["left", "top"]);
      expect(getLineTileShape(map, 1, 1)).toBe(
        LINE_TILE_SHAPES.CORNER_LEFT_TOP
      );
    });

    it("returns CORNER_LEFT_BOTTOM for left+bottom", () => {
      const map = makeMap(["left", "bottom"]);
      expect(getLineTileShape(map, 1, 1)).toBe(
        LINE_TILE_SHAPES.CORNER_LEFT_BOTTOM
      );
    });

    it("returns CORNER_RIGHT_TOP for right+top", () => {
      const map = makeMap(["right", "top"]);
      expect(getLineTileShape(map, 1, 1)).toBe(
        LINE_TILE_SHAPES.CORNER_RIGHT_TOP
      );
    });

    it("returns CORNER_RIGHT_BOTTOM for right+bottom", () => {
      const map = makeMap(["right", "bottom"]);
      expect(getLineTileShape(map, 1, 1)).toBe(
        LINE_TILE_SHAPES.CORNER_RIGHT_BOTTOM
      );
    });
  });

  describe("3 connections (T-junctions)", () => {
    it("returns T_TOP for left+right+top (bottom absent)", () => {
      const map = makeMap(["left", "right", "top"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.T_TOP);
    });

    it("returns T_BOTTOM for left+right+bottom (top absent)", () => {
      const map = makeMap(["left", "right", "bottom"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.T_BOTTOM);
    });

    it("returns T_LEFT for top+bottom+left (right absent)", () => {
      const map = makeMap(["top", "bottom", "left"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.T_LEFT);
    });

    it("returns T_RIGHT for top+bottom+right (left absent)", () => {
      const map = makeMap(["top", "bottom", "right"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.T_RIGHT);
    });
  });

  describe("4 connections (crossing)", () => {
    it("returns MIDDLE for all 4 neighbors", () => {
      const map = makeMap(["top", "bottom", "left", "right"]);
      expect(getLineTileShape(map, 1, 1)).toBe(LINE_TILE_SHAPES.MIDDLE);
    });
  });

  describe("edge/boundary cases", () => {
    it("treats out-of-bounds as no connection (top-left corner)", () => {
      const map = generateEmptyValueMap(3, 0);
      map[0][0].value = 1;
      map[0][1].value = 1; // right neighbor
      map[1][0].value = 1; // bottom neighbor
      // top and left are out of bounds → not connected
      expect(getLineTileShape(map, 0, 0)).toBe(
        LINE_TILE_SHAPES.CORNER_RIGHT_BOTTOM
      );
    });

    it("treats out-of-bounds as no connection (bottom-right corner)", () => {
      const map = generateEmptyValueMap(3, 0);
      map[2][2].value = 1;
      map[2][1].value = 1; // left neighbor
      map[1][2].value = 1; // top neighbor
      // bottom and right are out of bounds → not connected
      expect(getLineTileShape(map, 2, 2)).toBe(
        LINE_TILE_SHAPES.CORNER_LEFT_TOP
      );
    });

    it("handles tile on top edge with bottom neighbor only", () => {
      const map = generateEmptyValueMap(3, 0);
      map[0][1].value = 1;
      map[1][1].value = 1; // bottom
      expect(getLineTileShape(map, 1, 0)).toBe(LINE_TILE_SHAPES.END_BOTTOM);
    });

    it("handles tile on left edge with right neighbor only", () => {
      const map = generateEmptyValueMap(3, 0);
      map[1][0].value = 1;
      map[1][1].value = 1; // right
      expect(getLineTileShape(map, 0, 1)).toBe(LINE_TILE_SHAPES.END_RIGHT);
    });

    it("isolated tile on a 1x1 map returns HORIZONTAL", () => {
      const map = [[{ value: 1 }]];
      expect(getLineTileShape(map, 0, 0)).toBe(LINE_TILE_SHAPES.HORIZONTAL);
    });
  });
});
