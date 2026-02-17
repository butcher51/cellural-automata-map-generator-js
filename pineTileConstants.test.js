import { describe, it, expect } from "vitest";
import {
  isPineTool,
  getPineType,
  PINE_TILES,
  DEFAULT_PINE_TYPE,
} from "./pineTileConstants.js";

describe("pineTileConstants", () => {
  describe("isPineTool", () => {
    it("should return true for pine-1", () => {
      expect(isPineTool("pine-1")).toBe(true);
    });

    it("should return false for tree-1", () => {
      expect(isPineTool("tree-1")).toBe(false);
    });

    it("should return false for water", () => {
      expect(isPineTool("water")).toBe(false);
    });

    it("should return false for eraser", () => {
      expect(isPineTool("eraser")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isPineTool(undefined)).toBe(false);
    });
  });

  describe("getPineType", () => {
    it("should return 1 for pine-1", () => {
      expect(getPineType("pine-1")).toBe(1);
    });

    it("should return DEFAULT_PINE_TYPE for non-pine tool", () => {
      expect(getPineType("tree-1")).toBe(DEFAULT_PINE_TYPE);
    });

    it("should return DEFAULT_PINE_TYPE for invalid tool", () => {
      expect(getPineType("invalid")).toBe(DEFAULT_PINE_TYPE);
    });
  });

  describe("PINE_TILES", () => {
    it("should have configuration for pine type 1", () => {
      expect(PINE_TILES[1]).toBeDefined();
    });

    it("should have required tile properties for type 1", () => {
      const tiles = PINE_TILES[1];
      expect(tiles).toHaveProperty("topLeft");
      expect(tiles).toHaveProperty("topRight");
      expect(tiles).toHaveProperty("bottomLeft");
      expect(tiles).toHaveProperty("bottomRight");
      expect(tiles).toHaveProperty("topLeftAdjacent");
      expect(tiles).toHaveProperty("topRightAdjacent");
    });

    it("should have numeric values for all tile properties", () => {
      const tiles = PINE_TILES[1];
      expect(typeof tiles.topLeft).toBe("number");
      expect(typeof tiles.topRight).toBe("number");
      expect(typeof tiles.bottomLeft).toBe("number");
      expect(typeof tiles.bottomRight).toBe("number");
      expect(typeof tiles.topLeftAdjacent).toBe("number");
      expect(typeof tiles.topRightAdjacent).toBe("number");
    });
  });
});
