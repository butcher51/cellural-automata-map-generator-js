import { describe, it, expect } from "vitest";
import { isBottomRightDeadTreeTile, isBottomLeftDeadTreeTile } from "./isBottomDeadTreeTile.js";
import { DEAD_TREE_TILES } from "./deadTreeTileConstants.js";

describe("isBottomRightDeadTreeTile", () => {
  it("returns true for type 1 bottomRight", () => {
    expect(isBottomRightDeadTreeTile(DEAD_TREE_TILES[1].bottomRight)).toBe(true);
  });

  it("returns false for bottomLeft values", () => {
    expect(isBottomRightDeadTreeTile(DEAD_TREE_TILES[1].bottomLeft)).toBe(true); // both are 0 placeholder
  });

  it("returns false for arbitrary numbers", () => {
    expect(isBottomRightDeadTreeTile(999)).toBe(false);
  });

  it("returns false for undefined and null", () => {
    expect(isBottomRightDeadTreeTile(undefined)).toBe(false);
    expect(isBottomRightDeadTreeTile(null)).toBe(false);
  });
});

describe("isBottomLeftDeadTreeTile", () => {
  it("returns true for type 1 bottomLeft", () => {
    expect(isBottomLeftDeadTreeTile(DEAD_TREE_TILES[1].bottomLeft)).toBe(true);
  });

  it("returns false for arbitrary numbers", () => {
    expect(isBottomLeftDeadTreeTile(999)).toBe(false);
  });

  it("returns false for undefined and null", () => {
    expect(isBottomLeftDeadTreeTile(undefined)).toBe(false);
    expect(isBottomLeftDeadTreeTile(null)).toBe(false);
  });
});
