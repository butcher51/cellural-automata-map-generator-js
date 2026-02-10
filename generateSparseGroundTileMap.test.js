import { describe, it, expect } from "vitest";
import { generateSparseGroundTileMap } from "./generateSparseGroundTileMap.js";

describe("generateSparseGroundTileMap", () => {
  it("returns correct dimensions with all null for empty cells array", () => {
    const result = generateSparseGroundTileMap([], 5);
    expect(result).toHaveLength(5);
    for (let y = 0; y < 5; y++) {
      expect(result[y]).toHaveLength(5);
      for (let x = 0; x < 5; x++) {
        expect(result[y][x]).toBeNull();
      }
    }
  });

  it("generates ground tile at a single cell position", () => {
    const result = generateSparseGroundTileMap([{ x: 2, y: 3 }], 5);
    // The specified cell should have a ground tile
    expect(result[3][2]).not.toBeNull();
    expect(result[3][2]).toHaveProperty("tile");
    expect(result[3][2]).toHaveProperty("spritePosition");
    expect(result[3][2].spritePosition).toHaveProperty("spriteX");
    expect(result[3][2].spritePosition).toHaveProperty("spriteY");
    // Other cells should be null
    expect(result[0][0]).toBeNull();
    expect(result[4][4]).toBeNull();
  });

  it("generates ground tiles at multiple positions", () => {
    const cells = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = generateSparseGroundTileMap(cells, 5);
    expect(result[0][0]).not.toBeNull();
    expect(result[1][1]).not.toBeNull();
    expect(result[2][2]).not.toBeNull();
    // Non-specified cells remain null
    expect(result[0][1]).toBeNull();
    expect(result[3][3]).toBeNull();
  });

  it("preserves existing tiles when existingGroundTileMap is provided", () => {
    const existing = Array.from({ length: 5 }, () => Array(5).fill(null));
    existing[1][1] = { tile: 42, spritePosition: { spriteX: 100, spriteY: 200 } };

    const result = generateSparseGroundTileMap([{ x: 1, y: 1 }], 5, existing);
    // Should reuse the existing tile
    expect(result[1][1].tile).toBe(42);
    expect(result[1][1].spritePosition.spriteX).toBe(100);
    expect(result[1][1].spritePosition.spriteY).toBe(200);
  });

  it("generates new tile when existing map has null at position", () => {
    const existing = Array.from({ length: 5 }, () => Array(5).fill(null));

    const result = generateSparseGroundTileMap([{ x: 2, y: 2 }], 5, existing);
    // Should generate a new tile since existing has null
    expect(result[2][2]).not.toBeNull();
    expect(result[2][2]).toHaveProperty("tile");
  });

  it("ignores out-of-bounds positions", () => {
    const result = generateSparseGroundTileMap([{ x: -1, y: 0 }, { x: 5, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 5 }], 5);
    // All positions are out of bounds, so everything should be null
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(result[y][x]).toBeNull();
      }
    }
  });

  it("has correct dimensions for various sizes", () => {
    const result = generateSparseGroundTileMap([], 10);
    expect(result).toHaveLength(10);
    for (const row of result) {
      expect(row).toHaveLength(10);
    }
  });
});
