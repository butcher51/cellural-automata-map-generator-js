import { describe, it, expect } from "vitest";
import {
  TREE_TILES,
  DEFAULT_TREE_TYPE,
  isTreeTool,
  getTreeType,
} from "./treeTileConstants.js";

describe("TREE_TILES", () => {
  it("has keys 1 through 4", () => {
    expect(Object.keys(TREE_TILES).map(Number)).toEqual([1, 2, 3, 4]);
  });

  it("each type has all 6 required tile indices", () => {
    const requiredKeys = [
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
      "topLeftAdjacent",
      "topRightAdjacent",
    ];
    for (let i = 1; i <= 4; i++) {
      for (const key of requiredKeys) {
        expect(TREE_TILES[i]).toHaveProperty(key);
        expect(typeof TREE_TILES[i][key]).toBe("number");
      }
    }
  });

  it("type 1 has the original hardcoded tile indices", () => {
    expect(TREE_TILES[1].topLeft).toBe(1225);
    expect(TREE_TILES[1].topRight).toBe(1226);
    expect(TREE_TILES[1].bottomLeft).toBe(1249);
    expect(TREE_TILES[1].bottomRight).toBe(1250);
    expect(TREE_TILES[1].topLeftAdjacent).toBe(1282);
    expect(TREE_TILES[1].topRightAdjacent).toBe(1283);
  });
});

describe("DEFAULT_TREE_TYPE", () => {
  it("is 1", () => {
    expect(DEFAULT_TREE_TYPE).toBe(1);
  });
});

describe("isTreeTool", () => {
  it('returns true for "tree-1" through "tree-4"', () => {
    expect(isTreeTool("tree-1")).toBe(true);
    expect(isTreeTool("tree-2")).toBe(true);
    expect(isTreeTool("tree-3")).toBe(true);
    expect(isTreeTool("tree-4")).toBe(true);
  });

  it("returns false for non-tree tools", () => {
    expect(isTreeTool("eraser")).toBe(false);
    expect(isTreeTool("water")).toBe(false);
    expect(isTreeTool("cliff")).toBe(false);
    expect(isTreeTool("tree")).toBe(false);
    expect(isTreeTool("tree-0")).toBe(false);
    expect(isTreeTool("tree-5")).toBe(false);
  });
});

describe("getTreeType", () => {
  it("extracts the number from the tool string", () => {
    expect(getTreeType("tree-1")).toBe(1);
    expect(getTreeType("tree-2")).toBe(2);
    expect(getTreeType("tree-3")).toBe(3);
    expect(getTreeType("tree-4")).toBe(4);
  });

  it("returns DEFAULT_TREE_TYPE for invalid input", () => {
    expect(getTreeType("eraser")).toBe(DEFAULT_TREE_TYPE);
    expect(getTreeType("tree")).toBe(DEFAULT_TREE_TYPE);
    expect(getTreeType("tree-0")).toBe(DEFAULT_TREE_TYPE);
    expect(getTreeType("tree-5")).toBe(DEFAULT_TREE_TYPE);
  });
});
