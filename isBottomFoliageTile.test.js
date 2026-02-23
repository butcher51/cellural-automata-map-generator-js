import { describe, it, expect } from "vitest";
import { createBottomTileCheckers } from "./isBottomFoliageTile.js";

const MOCK_TILES = {
  1: { bottomRight: 100, bottomLeft: 101, topLeft: 200, topRight: 201, topLeftAdjacent: 300, topRightAdjacent: 301 },
  2: { bottomRight: 102, bottomLeft: 103, topLeft: 202, topRight: 203, topLeftAdjacent: 302, topRightAdjacent: 303 },
};

describe("createBottomTileCheckers", () => {
  const { isBottomRight, isBottomLeft } = createBottomTileCheckers(MOCK_TILES);

  describe("isBottomRight", () => {
    it("returns true for bottomRight values from any type", () => {
      expect(isBottomRight(100)).toBe(true);
      expect(isBottomRight(102)).toBe(true);
    });

    it("returns false for bottomLeft values", () => {
      expect(isBottomRight(101)).toBe(false);
      expect(isBottomRight(103)).toBe(false);
    });

    it("returns false for other tile values", () => {
      expect(isBottomRight(200)).toBe(false);
      expect(isBottomRight(999)).toBe(false);
    });

    it("returns false for undefined and null", () => {
      expect(isBottomRight(undefined)).toBe(false);
      expect(isBottomRight(null)).toBe(false);
    });
  });

  describe("isBottomLeft", () => {
    it("returns true for bottomLeft values from any type", () => {
      expect(isBottomLeft(101)).toBe(true);
      expect(isBottomLeft(103)).toBe(true);
    });

    it("returns false for bottomRight values", () => {
      expect(isBottomLeft(100)).toBe(false);
      expect(isBottomLeft(102)).toBe(false);
    });

    it("returns false for other tile values", () => {
      expect(isBottomLeft(200)).toBe(false);
      expect(isBottomLeft(999)).toBe(false);
    });

    it("returns false for undefined and null", () => {
      expect(isBottomLeft(undefined)).toBe(false);
      expect(isBottomLeft(null)).toBe(false);
    });
  });
});
