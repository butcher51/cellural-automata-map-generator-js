import { describe, it, expect, vi, beforeEach } from "vitest";

describe("setManualTile", () => {
  let setManualTile;
  let createManualTileMap;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("./tilesetConfig.js", () => ({
      TILE_SIZE: 8,
      TILESETS: [
        { id: "overworld", path: "./a.png", tilesPerRow: 24, totalTiles: 2232 },
        { id: "walls", path: "./b.png", tilesPerRow: 24, totalTiles: 2232 },
      ],
    }));
    const setMod = await import("./setManualTile.js");
    setManualTile = setMod.setManualTile;
    const createMod = await import("./createManualTileMap.js");
    createManualTileMap = createMod.createManualTileMap;
  });

  it("places a tile at a valid position", () => {
    const map = createManualTileMap(5);
    setManualTile(map, 2, 3, 1);
    expect(map[3][2]).not.toBeNull();
    expect(map[3][2].tileIndex).toBe(1);
    expect(map[3][2].spritePosition).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 0 });
  });

  it("computes correct spritePosition for tile in second row", () => {
    const map = createManualTileMap(5);
    setManualTile(map, 0, 0, 25); // row 1, col 0 in overworld
    expect(map[0][0].tileIndex).toBe(25);
    expect(map[0][0].spritePosition).toEqual({ spriteX: 0, spriteY: 8, tilesetIndex: 0 });
  });

  it("computes correct spritePosition for tile in second tileset", () => {
    const map = createManualTileMap(5);
    setManualTile(map, 1, 1, 2233); // first tile of walls tileset
    expect(map[1][1].tileIndex).toBe(2233);
    expect(map[1][1].spritePosition).toEqual({ spriteX: 0, spriteY: 0, tilesetIndex: 1 });
  });

  it("clears a tile when tileIndex is null", () => {
    const map = createManualTileMap(5);
    setManualTile(map, 2, 2, 1);
    expect(map[2][2]).not.toBeNull();
    setManualTile(map, 2, 2, null);
    expect(map[2][2]).toBeNull();
  });

  it("does nothing for out-of-bounds x (negative)", () => {
    const map = createManualTileMap(3);
    setManualTile(map, -1, 0, 1);
    // No crash, all cells remain null
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toBeNull();
      }
    }
  });

  it("does nothing for out-of-bounds y (too large)", () => {
    const map = createManualTileMap(3);
    setManualTile(map, 0, 5, 1);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toBeNull();
      }
    }
  });

  it("does nothing for out-of-bounds x (too large)", () => {
    const map = createManualTileMap(3);
    setManualTile(map, 10, 0, 1);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(map[y][x]).toBeNull();
      }
    }
  });

  it("overwrites an existing tile", () => {
    const map = createManualTileMap(3);
    setManualTile(map, 1, 1, 1);
    expect(map[1][1].tileIndex).toBe(1);
    setManualTile(map, 1, 1, 50);
    expect(map[1][1].tileIndex).toBe(50);
  });

  it("does nothing on empty map", () => {
    const map = createManualTileMap(0);
    setManualTile(map, 0, 0, 1); // should not crash
    expect(map.length).toBe(0);
  });
});
