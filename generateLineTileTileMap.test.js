import { describe, it, expect } from "vitest";
import { generateLineTileTileMap } from "./generateLineTileTileMap.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";
import { LINE_TILE_TILES } from "./lineTileTileConstants.js";

describe("generateLineTileTileMap", () => {
  it("produces tile 0 and null spritePosition for non-lineTile cells", () => {
    const valueMap = generateEmptyValueMap(3, 0);
    const result = generateLineTileTileMap(valueMap);

    expect(result[0][0].tile).toBe(0);
    expect(result[0][0].spritePosition).toBeNull();
  });

  it("produces tile with lineTileType and isLineTile flag for lineTile cells", () => {
    const valueMap = generateEmptyValueMap(3, 0);
    valueMap[1][1].value = 1;
    valueMap[1][1].lineTileType = 2;

    const result = generateLineTileTileMap(valueMap);

    expect(result[1][1].tile).toBe(2);
    expect(result[1][1].isLineTile).toBe(true);
    expect(result[1][1].spritePosition).toEqual(LINE_TILE_TILES[2].spritePosition);
  });

  it("handles all lineTile types (1-4)", () => {
    const valueMap = generateEmptyValueMap(4, 0);
    for (let i = 0; i < 4; i++) {
      valueMap[0][i].value = 1;
      valueMap[0][i].lineTileType = i + 1;
    }

    const result = generateLineTileTileMap(valueMap);

    expect(result[0][0].tile).toBe(1);
    expect(result[0][1].tile).toBe(2);
    expect(result[0][2].tile).toBe(3);
    expect(result[0][3].tile).toBe(4);
  });

  it("output dimensions match input", () => {
    const valueMap = generateEmptyValueMap(5, 0);
    const result = generateLineTileTileMap(valueMap);

    expect(result.length).toBe(5);
    for (let y = 0; y < 5; y++) {
      expect(result[y].length).toBe(5);
    }
  });

  it("defaults lineTileType to 1 if not set on a value=1 cell", () => {
    const valueMap = generateEmptyValueMap(3, 0);
    valueMap[0][0].value = 1;
    // No lineTileType set

    const result = generateLineTileTileMap(valueMap);

    expect(result[0][0].tile).toBe(1);
    expect(result[0][0].isLineTile).toBe(true);
  });

  it("mixed map with lineTile and non-lineTile cells", () => {
    const valueMap = generateEmptyValueMap(3, 0);
    valueMap[0][0].value = 1;
    valueMap[0][0].lineTileType = 3;
    valueMap[2][2].value = 1;
    valueMap[2][2].lineTileType = 1;

    const result = generateLineTileTileMap(valueMap);

    // lineTile cells
    expect(result[0][0].tile).toBe(3);
    expect(result[0][0].isLineTile).toBe(true);
    expect(result[2][2].tile).toBe(1);
    expect(result[2][2].isLineTile).toBe(true);

    // non-lineTile cells
    expect(result[1][1].tile).toBe(0);
    expect(result[1][1].isLineTile).toBeUndefined();
  });
});
