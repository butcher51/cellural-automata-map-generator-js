import { describe, it, expect, vi, beforeEach } from "vitest";

describe("getTileSpritePosition", () => {
  describe("single tileset (backward compatibility)", () => {
    let getTileSpritePosition;

    beforeEach(async () => {
      vi.resetModules();
      vi.doMock("./tilesetConfig.js", () => ({
        TILE_SIZE: 8,
        TILESETS: [
          { id: "overworld", path: "./assets/overworld.png", tilesPerRow: 24, totalTiles: 2232 },
        ],
      }));
      const mod = await import("./getTileSpritePosition.js");
      getTileSpritePosition = mod.getTileSpritePosition;
    });

    it("index 1 returns first tile at (0,0) with tilesetIndex 0", () => {
      const result = getTileSpritePosition(1);
      expect(result).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 0 });
    });

    it("index 2 returns second tile at (8,0)", () => {
      const result = getTileSpritePosition(2);
      expect(result).toEqual({ spriteX: 8, spriteY: 0, tilesetIndex: 0 });
    });

    it("index 24 returns last tile in first row", () => {
      const result = getTileSpritePosition(24);
      expect(result).toEqual({ spriteX: 23 * 8, spriteY: 0, tilesetIndex: 0 });
    });

    it("index 25 returns first tile in second row", () => {
      const result = getTileSpritePosition(25);
      expect(result).toEqual({ spriteX: 0, spriteY: 8, tilesetIndex: 0 });
    });

    it("index 913 computes correct position within tileset 0", () => {
      // 913 - 1 = 912, row = floor(912/24) = 38, col = 912 % 24 = 0
      const result = getTileSpritePosition(913);
      expect(result).toEqual({ spriteX: 0, spriteY: 38 * 8, tilesetIndex: 0 });
    });

    it("last index 2232 returns correct position", () => {
      // 2232 - 1 = 2231, row = floor(2231/24) = 92, col = 2231 % 24 = 23
      const result = getTileSpritePosition(2232);
      expect(result).toEqual({ spriteX: 23 * 8, spriteY: 92 * 8, tilesetIndex: 0 });
    });

    it("out-of-range index returns fallback", () => {
      const result = getTileSpritePosition(2233);
      expect(result).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 0 });
    });
  });

  describe("multi-tileset resolution", () => {
    let getTileSpritePosition;

    beforeEach(async () => {
      vi.resetModules();
      vi.doMock("./tilesetConfig.js", () => ({
        TILE_SIZE: 8,
        TILESETS: [
          { id: "tileset-a", path: "./a.png", tilesPerRow: 10, totalTiles: 100 },
          { id: "tileset-b", path: "./b.png", tilesPerRow: 8, totalTiles: 64 },
        ],
      }));
      const mod = await import("./getTileSpritePosition.js");
      getTileSpritePosition = mod.getTileSpritePosition;
    });

    it("index 1 maps to first tile of tileset 0", () => {
      const result = getTileSpritePosition(1);
      expect(result).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 0 });
    });

    it("index 100 maps to last tile of tileset 0", () => {
      // 100 - 1 = 99, row = floor(99/10) = 9, col = 99 % 10 = 9
      const result = getTileSpritePosition(100);
      expect(result).toEqual({ spriteX: 9 * 8, spriteY: 9 * 8, tilesetIndex: 0 });
    });

    it("index 101 maps to first tile of tileset 1", () => {
      // remaining = 100 - 100 = 0, row = 0, col = 0
      const result = getTileSpritePosition(101);
      expect(result).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 1 });
    });

    it("index 102 maps to second tile of tileset 1", () => {
      // remaining after tileset-a: 101 - 100 = 1, row = 0, col = 1
      const result = getTileSpritePosition(102);
      expect(result).toEqual({ spriteX: 8, spriteY: 0, tilesetIndex: 1 });
    });

    it("index 164 maps to last tile of tileset 1", () => {
      // remaining after tileset-a: 163 - 100 = 63, row = floor(63/8) = 7, col = 63 % 8 = 7
      const result = getTileSpritePosition(164);
      expect(result).toEqual({ spriteX: 7 * 8, spriteY: 7 * 8, tilesetIndex: 1 });
    });

    it("index 165 is out of range, returns fallback", () => {
      const result = getTileSpritePosition(165);
      expect(result).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 0 });
    });
  });
});
