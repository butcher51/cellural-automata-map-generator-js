import { describe, expect, it } from "vitest";
import {
  generateCliffTileMap,
  CLIFF_BORDER_BOTTOM,
  CLIFF_BORDER_CORNER_BOTTOM_LEFT,
  CLIFF_BORDER_CORNER_BOTTOM_RIGHT,
  CLIFF_BORDER_CORNER_TOP_LEFT,
  CLIFF_BORDER_CORNER_TOP_RIGHT,
  CLIFF_BORDER_INSIDE_BOTTOM_LEFT,
  CLIFF_BORDER_INSIDE_BOTTOM_RIGHT,
  CLIFF_BORDER_INSIDE_TOP_LEFT,
  CLIFF_BORDER_INSIDE_TOP_RIGHT,
  CLIFF_BORDER_LEFT,
  CLIFF_BORDER_RIGHT,
  CLIFF_BORDER_TOP,
  CLIFF_INTERIOR_TILES,
} from "./generateCliffTileMap.js";

// Helper functions for test readability
function cell(value) {
  return { value };
}

function createMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ value: v })));
}

function emptyTileMap(height, width) {
  const tm = [];
  for (let y = 0; y < height; y++) {
    tm[y] = [];
    for (let x = 0; x < width; x++) {
      tm[y][x] = {};
    }
  }
  return tm;
}

describe("generateCliffTileMap", () => {
  describe("Basic Functionality & Edge Cases", () => {
    it("should return empty tileMap for empty input", () => {
      const result = generateCliffTileMap([], []);
      expect(result).toEqual([]);
    });

    it("should handle single empty row", () => {
      const valueMap = [[]];
      const result = generateCliffTileMap(valueMap, [[]]);
      expect(result).toEqual([[]]);
    });

    it("should return sparse map for single land cell", () => {
      const valueMap = [[cell(0)]];
      const result = generateCliffTileMap(valueMap, emptyTileMap(1, 1));
      expect(result).toEqual([[]]);
      expect(result[0][0]).toBeUndefined();
    });

    it("should return corner tile for single cliff cell", () => {
      const valueMap = [[cell(1)]];
      const result = generateCliffTileMap(valueMap, emptyTileMap(1, 1));

      expect(result[0][0]).toBeDefined();
      expect(result[0][0].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
      expect(result[0][0].spritePosition).toBeDefined();
    });

    it("should return interior tile for center of all-cliff map", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      const interiorIndices = CLIFF_INTERIOR_TILES.map((t) => t.index);
      expect(interiorIndices).toContain(result[1][1].tileIndex);
    });

    it("should return all undefined for all-land map", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

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
      const result = generateCliffTileMap(valueMap, emptyTileMap(2, 3));

      expect(result.length).toBe(2);
      expect(result[0].length).toBe(3);
      expect(result[1].length).toBe(2);

      expect(result[0][0]).toBeDefined();
      expect(result[0][2]).toBeDefined();
      expect(result[1][1]).toBeDefined();

      expect(result[0][1]).toBeUndefined();
      expect(result[1][0]).toBeUndefined();
    });

    it("should ensure all cliff cells have required properties", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(2, 2));

      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(result[y][x].tileIndex).toBeTypeOf("number");
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition.spriteX).toBeTypeOf("number");
          expect(result[y][x].spritePosition.spriteY).toBeTypeOf("number");
        }
      }
    });

    it("should handle special corner overlapping, right bottom corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(4, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_RIGHT);
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
    });

    it("should handle special corner overlapping, left bottom corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(4, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_LEFT);
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);
    });
  });

  describe("Outside Corner Detection", () => {
    it("should detect top-left outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
    });

    it("should detect top-right outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);
    });

    it("should detect bottom-left outside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_LEFT);
    });

    it("should detect bottom-right outside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_RIGHT);
    });
  });

  describe("Edge Tile Detection", () => {
    it("should detect top edge", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_TOP);
    });

    it("should detect right edge", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_RIGHT);
    });

    it("should detect bottom edge", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_BOTTOM);
    });

    it("should detect left edge", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
    });
  });

  describe("Inside Corner Detection", () => {
    it("should detect top-left inside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_LEFT);
    });

    it("should detect top-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_RIGHT);
    });

    it("should detect bottom-left inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_BOTTOM_LEFT);
    });

    it("should detect bottom-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_BOTTOM_RIGHT);
    });
  });

  describe("Interior Tile Detection", () => {
    it("should detect interior cliff when fully surrounded", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      const interiorIndices = CLIFF_INTERIOR_TILES.map((t) => t.index);
      expect(interiorIndices).toContain(result[1][1].tileIndex);
    });

    it("should detect interior cliff in large cliff body", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 5));

      const interiorIndices = CLIFF_INTERIOR_TILES.map((t) => t.index);
      expect(interiorIndices).toContain(result[2][2].tileIndex);
    });
  });

  describe("Priority Order Verification", () => {
    it("should prioritize outside corner over edge", () => {
      const valueMap = createMap([
        [0, 0],
        [0, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(2, 2));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
    });

    it("should prioritize edge over inside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
    });

    it("should prioritize inside corner over interior", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_LEFT);
      const interiorIndices = CLIFF_INTERIOR_TILES.map((t) => t.index);
      expect(interiorIndices).not.toContain(result[1][1].tileIndex);
    });
  });

  describe("Boundary Conditions", () => {
    it("should treat out-of-bounds as land at top-left corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[0][0].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
    });

    it("should treat out-of-bounds as land at bottom-right corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[2][2].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_RIGHT);
    });

    it("should detect top edge for entire top row", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[0][1].tileIndex).toBe(CLIFF_BORDER_TOP);
    });

    it("should detect left edge for entire left column", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[1][0].tileIndex).toBe(CLIFF_BORDER_LEFT);
    });
  });

  describe("Complex Shapes", () => {
    it("should handle L-shaped cliff correctly", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[0][2].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);
      expect(result[2][0].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_LEFT);

      expect(result[0][0]).toBeDefined();
      expect(result[0][1]).toBeDefined();
      expect(result[1][0]).toBeDefined();

      expect(result[1][1]).toBeUndefined();
      expect(result[2][2]).toBeUndefined();
    });

    it("should handle T-shaped cliff correctly", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(3, 3));

      expect(result[0][0].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
      expect(result[0][2].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);
      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_CORNER_BOTTOM_LEFT);
    });

    it("should handle donut shape with inside corners", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 5));

      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_BOTTOM_RIGHT);
      expect(result[1][3].tileIndex).toBe(CLIFF_BORDER_INSIDE_BOTTOM_LEFT);
      expect(result[3][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_RIGHT);
      expect(result[3][3].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_LEFT);
    });
  });

  describe("Sprite Position Integration", () => {
    it("should calculate sprite position for each cliff cell", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(2, 2));

      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition).toBeTypeOf("object");
        }
      }
    });

    it("should ensure sprite position has correct structure", () => {
      const valueMap = createMap([[1]]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(1, 1));

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

      generateCliffTileMap(valueMap, emptyTileMap(2, 2));

      expect(valueMap).toEqual(original);
    });

    it("should create independent output", () => {
      const valueMap = createMap([[1]]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(1, 1));

      result[0][0].tileIndex = 999;

      const result2 = generateCliffTileMap(valueMap, emptyTileMap(1, 1));
      expect(result2[0][0].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
      expect(result2[0][0].tileIndex).not.toBe(999);
    });
  });
});
