import { describe, expect, it } from "vitest";
import {
  generateDeepWaterTileMap,
  DEEP_WATER_BORDER_BOTTOM,
  DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT,
  DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT,
  DEEP_WATER_BORDER_CORNER_TOP_LEFT,
  DEEP_WATER_BORDER_CORNER_TOP_RIGHT,
  DEEP_WATER_BORDER_INSIDE_BOTTOM_LEFT,
  DEEP_WATER_BORDER_INSIDE_BOTTOM_RIGHT,
  DEEP_WATER_BORDER_INSIDE_TOP_LEFT,
  DEEP_WATER_BORDER_INSIDE_TOP_RIGHT,
  DEEP_WATER_BORDER_LEFT,
  DEEP_WATER_BORDER_RIGHT,
  DEEP_WATER_BORDER_TOP,
  DEEP_WATER_INTERIOR_TILES,
} from "./generateDeepWaterTileMap.js";

function cell(value) {
  return { value };
}

function createMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ value: v })));
}

const DEEP_WATER_INTERIOR_TILE_INDICES = DEEP_WATER_INTERIOR_TILES.map(t => t.index);
function isInteriorTile(tileIndex) {
  return DEEP_WATER_INTERIOR_TILE_INDICES.includes(tileIndex);
}

describe("generateDeepWaterTileMap", () => {
  describe("Basic Functionality & Edge Cases", () => {
    it("should return empty tileMap for empty input", () => {
      const result = generateDeepWaterTileMap([]);
      expect(result).toEqual([]);
    });

    it("should handle single empty row", () => {
      const valueMap = [[]];
      const result = generateDeepWaterTileMap(valueMap);
      expect(result).toEqual([[]]);
    });

    it("should return sparse map for single land cell", () => {
      const valueMap = [[cell(0)]];
      const result = generateDeepWaterTileMap(valueMap);
      expect(result).toEqual([[]]);
      expect(result[0][0]).toBeUndefined();
    });

    it("should return interior tile for single water cell", () => {
      const valueMap = [[cell(1)]];
      const result = generateDeepWaterTileMap(valueMap);

      expect(result[0][0]).toBeDefined();
      expect(isInteriorTile(result[0][0].tileIndex)).toBe(true);
      expect(result[0][0].spritePosition).toBeDefined();
    });

    it("should return interior tile for center of all-water map", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);

      expect(isInteriorTile(result[1][1].tileIndex)).toBe(true);
    });

    it("should return all undefined for all-land map", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          expect(result[y][x]).toBeUndefined();
        }
      }
    });

    it("should preserve map dimensions", () => {
      const valueMap = createMap([
        [1, 0, 1],
        [0, 1, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);

      expect(result.length).toBe(2);
      expect(result[0].length).toBe(3);
      expect(result[1].length).toBe(2);
    });

    it("should ensure all water cells have required properties", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);

      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(result[y][x].tileIndex).toBeTypeOf("number");
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition.spriteX).toBeTypeOf("number");
          expect(result[y][x].spritePosition.spriteY).toBeTypeOf("number");
        }
      }
    });
  });

  describe("Outside Corner Detection", () => {
    it("should detect top-left outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_CORNER_TOP_LEFT);
    });

    it("should detect top-right outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_CORNER_TOP_RIGHT);
    });

    it("should detect bottom-left outside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_CORNER_BOTTOM_LEFT);
    });

    it("should detect bottom-right outside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_CORNER_BOTTOM_RIGHT);
    });
  });

  describe("Edge Tile Detection", () => {
    it("should detect top edge", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_TOP);
    });

    it("should detect right edge", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_RIGHT);
    });

    it("should detect bottom edge", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_BOTTOM);
    });

    it("should detect left edge", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_LEFT);
    });
  });

  describe("Inside Corner Detection", () => {
    it("should detect top-left inside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_INSIDE_TOP_LEFT);
    });

    it("should detect top-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_INSIDE_TOP_RIGHT);
    });

    it("should detect bottom-left inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_INSIDE_BOTTOM_LEFT);
    });

    it("should detect bottom-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(result[1][1].tileIndex).toBe(DEEP_WATER_BORDER_INSIDE_BOTTOM_RIGHT);
    });
  });

  describe("Interior Tile Detection", () => {
    it("should detect interior water when fully surrounded", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(isInteriorTile(result[1][1].tileIndex)).toBe(true);
    });
  });

  describe("Boundary Conditions (OOB as water)", () => {
    it("should treat out-of-bounds as water at top-left corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(isInteriorTile(result[0][0].tileIndex)).toBe(true);
    });

    it("should treat out-of-bounds as water at bottom-right corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);
      expect(isInteriorTile(result[2][2].tileIndex)).toBe(true);
    });
  });

  describe("Sprite Position Integration", () => {
    it("should calculate sprite position for each water cell", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateDeepWaterTileMap(valueMap);

      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition).toBeTypeOf("object");
        }
      }
    });

    it("should ensure sprite position has correct structure", () => {
      const valueMap = createMap([[1]]);
      const result = generateDeepWaterTileMap(valueMap);

      expect(result[0][0].spritePosition.spriteX).toBeTypeOf("number");
      expect(result[0][0].spritePosition.spriteY).toBeTypeOf("number");
    });
  });

  describe("Data Integrity", () => {
    it("should not modify the input valueMap", () => {
      const valueMap = createMap([
        [1, 0],
        [0, 1],
      ]);
      const original = JSON.parse(JSON.stringify(valueMap));

      generateDeepWaterTileMap(valueMap);

      expect(valueMap).toEqual(original);
    });

    it("should create independent output", () => {
      const valueMap = createMap([[1]]);
      const result = generateDeepWaterTileMap(valueMap);

      result[0][0].tileIndex = 999;

      const result2 = generateDeepWaterTileMap(valueMap);
      expect(isInteriorTile(result2[0][0].tileIndex)).toBe(true);
      expect(result2[0][0].tileIndex).not.toBe(999);
    });
  });
});
