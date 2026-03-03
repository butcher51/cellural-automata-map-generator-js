import { describe, it, expect } from "vitest";
import { TILE_SIZE, TILESETS } from "./tilesetConfig.js";

describe("tilesetConfig", () => {
  it("exports TILE_SIZE as 8", () => {
    expect(TILE_SIZE).toBe(8);
  });

  it("exports TILESETS as a non-empty array", () => {
    expect(Array.isArray(TILESETS)).toBe(true);
    expect(TILESETS.length).toBeGreaterThanOrEqual(1);
  });

  it("each tileset has required fields", () => {
    for (const tileset of TILESETS) {
      expect(tileset).toHaveProperty("id");
      expect(tileset).toHaveProperty("path");
      expect(tileset).toHaveProperty("tilesPerRow");
      expect(tileset).toHaveProperty("totalTiles");
      expect(typeof tileset.id).toBe("string");
      expect(typeof tileset.path).toBe("string");
      expect(typeof tileset.tilesPerRow).toBe("number");
      expect(typeof tileset.totalTiles).toBe("number");
      expect(tileset.tilesPerRow).toBeGreaterThan(0);
      expect(tileset.totalTiles).toBeGreaterThan(0);
    }
  });

  it("first tileset is overworld", () => {
    expect(TILESETS[0].id).toBe("overworld");
    expect(TILESETS[0].tilesPerRow).toBe(24);
    expect(TILESETS[0].totalTiles).toBe(2232);
  });
});
