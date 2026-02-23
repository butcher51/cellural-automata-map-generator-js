import { describe, it, expect } from "vitest";
import {
  isDeadTreeTool,
  getDeadTreeType,
  DEAD_TREE_TILES,
  DEFAULT_DEAD_TREE_TYPE,
} from "./deadTreeTileConstants.js";

describe("deadTreeTileConstants", () => {
  describe("isDeadTreeTool", () => {
    it("should return true for deadTree-1", () => {
      expect(isDeadTreeTool("deadTree-1")).toBe(true);
    });

    it("should return false for tree-1", () => {
      expect(isDeadTreeTool("tree-1")).toBe(false);
    });

    it("should return false for pine-1", () => {
      expect(isDeadTreeTool("pine-1")).toBe(false);
    });

    it("should return false for water", () => {
      expect(isDeadTreeTool("water")).toBe(false);
    });

    it("should return false for eraser", () => {
      expect(isDeadTreeTool("eraser")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isDeadTreeTool(undefined)).toBe(false);
    });
  });

  describe("getDeadTreeType", () => {
    it("should return 1 for deadTree-1", () => {
      expect(getDeadTreeType("deadTree-1")).toBe(1);
    });

    it("should return DEFAULT_DEAD_TREE_TYPE for non-deadTree tool", () => {
      expect(getDeadTreeType("tree-1")).toBe(DEFAULT_DEAD_TREE_TYPE);
    });

    it("should return DEFAULT_DEAD_TREE_TYPE for invalid tool", () => {
      expect(getDeadTreeType("invalid")).toBe(DEFAULT_DEAD_TREE_TYPE);
    });
  });

  describe("DEAD_TREE_TILES", () => {
    it("should have configuration for dead tree type 1", () => {
      expect(DEAD_TREE_TILES[1]).toBeDefined();
    });

    it("should have required tile properties for type 1", () => {
      const tiles = DEAD_TREE_TILES[1];
      expect(tiles).toHaveProperty("topLeft");
      expect(tiles).toHaveProperty("topRight");
      expect(tiles).toHaveProperty("bottomLeft");
      expect(tiles).toHaveProperty("bottomRight");
      expect(tiles).toHaveProperty("topLeftAdjacent");
      expect(tiles).toHaveProperty("topRightAdjacent");
    });

    it("should have numeric values for all tile properties", () => {
      const tiles = DEAD_TREE_TILES[1];
      expect(typeof tiles.topLeft).toBe("number");
      expect(typeof tiles.topRight).toBe("number");
      expect(typeof tiles.bottomLeft).toBe("number");
      expect(typeof tiles.bottomRight).toBe("number");
      expect(typeof tiles.topLeftAdjacent).toBe("number");
      expect(typeof tiles.topRightAdjacent).toBe("number");
    });
  });
});
