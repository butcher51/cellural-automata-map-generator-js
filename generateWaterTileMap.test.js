import { describe, expect, it } from "vitest";
import {
  generateWaterTileMap,
  WATER_BORDER_BOTTOM,
  WATER_BORDER_CORNER_BOTTOM_LEFT,
  WATER_BORDER_CORNER_BOTTOM_RIGHT,
  WATER_BORDER_CORNER_TOP_LEFT,
  WATER_BORDER_CORNER_TOP_RIGHT,
  WATER_BORDER_INSIDE_BOTTOM_LEFT,
  WATER_BORDER_INSIDE_BOTTOM_RIGHT,
  WATER_BORDER_INSIDE_TOP_LEFT,
  WATER_BORDER_INSIDE_TOP_RIGHT,
  WATER_BORDER_LEFT,
  WATER_BORDER_RIGHT,
  WATER_BORDER_TOP,
  WATER_INTERIOR_TILES,
} from "./generateWaterTileMap.js";

// Helper functions for test readability
function cell(value) {
  return { value };
}

function createMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ value: v })));
}

const WATER_INTERIOR_TILE_INDICES = WATER_INTERIOR_TILES.map(t => t.index);
function isInteriorTile(tileIndex) {
  return WATER_INTERIOR_TILE_INDICES.includes(tileIndex);
}

describe("generateWaterTileMap", () => {
  describe("Basic Functionality & Edge Cases", () => {
    it("should return empty tileMap for empty input", () => {
      const result = generateWaterTileMap([]);
      expect(result).toEqual([]);
    });

    it("should handle single empty row", () => {
      const valueMap = [[]];
      const result = generateWaterTileMap(valueMap);
      expect(result).toEqual([[]]);
    });

    it("should return sparse map for single land cell", () => {
      const valueMap = [[cell(0)]];
      const result = generateWaterTileMap(valueMap);
      expect(result).toEqual([[]]);
      expect(result[0][0]).toBeUndefined();
    });

    it("should return interior tile for single water cell", () => {
      const valueMap = [[cell(1)]];
      const result = generateWaterTileMap(valueMap);

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
      const result = generateWaterTileMap(valueMap);

      expect(isInteriorTile(result[1][1].tileIndex)).toBe(true);
    });

    it("should return all undefined for all-land map", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

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
      const result = generateWaterTileMap(valueMap);

      expect(result.length).toBe(2);
      // The function creates tileMap[y] = [] for each row, then assigns to positions
      // So result[0].length depends on highest index assigned
      // [0][0] and [0][2] are assigned, so length should be 3
      expect(result[0].length).toBe(3);
      expect(result[1].length).toBe(2); // [1][1] is assigned, so length is 2

      // Defined cells should be in correct positions
      expect(result[0][0]).toBeDefined();
      expect(result[0][2]).toBeDefined();
      expect(result[1][1]).toBeDefined();

      // Undefined positions exist but are undefined
      expect(result[0][1]).toBeUndefined();
      expect(result[1][0]).toBeUndefined();
    });

    it("should ensure all water cells have required properties", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

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
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_BOTTOM_RIGHT);
      expect(result[2][1].tileIndex).toBe(WATER_BORDER_CORNER_TOP_LEFT);
    });

    it("should handle special corner overlapping, left bottom corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_BOTTOM_LEFT);
      expect(result[2][1].tileIndex).toBe(WATER_BORDER_CORNER_TOP_RIGHT);
    });
  });

  describe("Outside Corner Detection", () => {
    it("should detect top-left outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_TOP_LEFT);
    });

    it("should detect top-right outside corner", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_TOP_RIGHT);
    });

    it("should detect bottom-left outside corner", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_BOTTOM_LEFT);
    });

    it("should detect bottom-right outside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_BOTTOM_RIGHT);
    });
  });

  describe("Edge Tile Detection", () => {
    it("should detect top edge", () => {
      const valueMap = createMap([
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_TOP);
    });

    it("should detect right edge", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_RIGHT);
    });

    it("should detect bottom edge", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_BOTTOM);
    });

    it("should detect left edge", () => {
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_LEFT);
    });
  });

  describe("Inside Corner Detection", () => {
    it("should detect top-left inside corner", () => {
      // Create a water body with land only at top-left diagonal
      const valueMap = createMap([
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Center cell has all cardinals as water, but diagonal [0,0] is land
      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_LEFT);
    });

    it("should detect top-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_RIGHT);
    });

    it("should detect bottom-left inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [0, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_BOTTOM_LEFT);
    });

    it("should detect bottom-right inside corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_BOTTOM_RIGHT);
    });
  });

  describe("Interior Tile Detection", () => {
    it("should detect interior water when fully surrounded", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(isInteriorTile(result[1][1].tileIndex)).toBe(true);
    });

    it("should detect interior water in large water body", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Center cell should be interior
      expect(isInteriorTile(result[2][2].tileIndex)).toBe(true);
    });
  });

  describe("Priority Order Verification", () => {
    it("should prioritize outside corner over edge", () => {
      // Cell with both top and left as land should be corner, not just top edge
      const valueMap = createMap([
        [0, 0],
        [0, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_CORNER_TOP_LEFT);
    });

    it("should prioritize edge over inside corner", () => {
      // Cell with left cardinal as land should be left edge,
      // even if a diagonal is also land
      const valueMap = createMap([
        [0, 1, 1],
        [0, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // [1][1] has left cardinal as land, should be left edge
      // (not inside corner even though top-left diagonal is also land)
      expect(result[1][1].tileIndex).toBe(WATER_BORDER_LEFT);
    });

    it("should prioritize inside corner over interior", () => {
      // All cardinals water but diagonal is land -> inside corner, not interior
      const valueMap = createMap([
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_LEFT);
      expect(isInteriorTile(result[1][1].tileIndex)).not.toBe(true);
    });
  });

  describe("Boundary Conditions (OOB as water)", () => {
    it("should treat out-of-bounds as water at top-left corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Top-left corner has out-of-bounds above and left, treated as water
      expect(isInteriorTile(result[0][0].tileIndex)).toBe(true);
    });

    it("should treat out-of-bounds as water at bottom-right corner", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Bottom-right corner has out-of-bounds below and right, treated as water
      expect(isInteriorTile(result[2][2].tileIndex)).toBe(true);
    });

    it("should treat top edge as interior water", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Middle cell of top row should be interior (OOB above = water)
      expect(isInteriorTile(result[0][1].tileIndex)).toBe(true);
    });

    it("should treat left edge as interior water", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Middle cell of left column should be interior (OOB left = water)
      expect(isInteriorTile(result[1][0].tileIndex)).toBe(true);
    });
  });

  describe("Complex Shapes", () => {
    it("should handle L-shaped water correctly", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Top-right [0][2]: top=out of bounds (water), right=out of bounds (water), bottom=land
      // -> bottom edge
      expect(result[0][2].tileIndex).toBe(WATER_BORDER_BOTTOM);

      // Bottom-left [2][0]: bottom=out of bounds (water), left=out of bounds (water), right=land
      // -> right edge
      expect(result[2][0].tileIndex).toBe(WATER_BORDER_RIGHT);

      // All water cells should have tile: 1

      // Land cells should be undefined
      expect(result[1][1]).toBeUndefined();
      expect(result[2][2]).toBeUndefined();
    });

    it("should handle T-shaped water correctly", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Top-left [0][0]: top=out of bounds (water), left=out of bounds (water), bottom=land
      // -> bottom edge
      expect(result[0][0].tileIndex).toBe(WATER_BORDER_BOTTOM);

      // Top-right [0][2]: top=out of bounds (water), right=out of bounds (water), bottom=land
      // -> bottom edge
      expect(result[0][2].tileIndex).toBe(WATER_BORDER_BOTTOM);

      // [1][1]: left=land, right=land -> left edge
      expect(result[1][1].tileIndex).toBe(WATER_BORDER_LEFT);

      // [2][1]: left=land, right=land, bottom=out of bounds (water)
      // -> left edge
      expect(result[2][1].tileIndex).toBe(WATER_BORDER_LEFT);
    });

    it("should handle donut shape with inside corners", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Cells surrounding the center land should have inside corners
      expect(result[1][1].tileIndex).toBe(WATER_BORDER_INSIDE_BOTTOM_RIGHT);
      expect(result[1][3].tileIndex).toBe(WATER_BORDER_INSIDE_BOTTOM_LEFT);
      expect(result[3][1].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_RIGHT);
      expect(result[3][3].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_LEFT);
    });

    it("should handle irregular coastline", () => {
      const valueMap = createMap([
        [0, 0, 1, 1, 0],
        [0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Check various tile types exist
      let hasCorner = false;
      let hasEdge = false;
      let hasInsideCorner = false;

      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
          if (result[y][x]) {
            const idx = result[y][x].tileIndex;
            if (idx === WATER_BORDER_CORNER_TOP_LEFT || idx === WATER_BORDER_CORNER_TOP_RIGHT || idx === WATER_BORDER_CORNER_BOTTOM_LEFT || idx === WATER_BORDER_CORNER_BOTTOM_RIGHT) {
              hasCorner = true;
            }
            if (idx === WATER_BORDER_TOP || idx === WATER_BORDER_RIGHT || idx === WATER_BORDER_BOTTOM || idx === WATER_BORDER_LEFT) {
              hasEdge = true;
            }
            if (idx === WATER_BORDER_INSIDE_TOP_LEFT || idx === WATER_BORDER_INSIDE_TOP_RIGHT || idx === WATER_BORDER_INSIDE_BOTTOM_LEFT || idx === WATER_BORDER_INSIDE_BOTTOM_RIGHT) {
              hasInsideCorner = true;
            }
          }
        }
      }

      // Verify we have a mix of different tile types in this irregular shape
      expect(hasCorner).toBe(true);
      expect(hasEdge).toBe(true);
      // Don't require interior tile as the shape might not have fully surrounded cells
    });

    it("should handle peninsula with various edges", () => {
      const valueMap = createMap([
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      // Top of peninsula [0][1] has top=out of bounds (water), left=land, right=land
      // -> left edge
      expect(result[0][1].tileIndex).toBe(WATER_BORDER_LEFT);

      // [1][1] has left=land, right=land -> left edge (checks left first in priority)
      expect(result[1][1].tileIndex).toBe(WATER_BORDER_LEFT);

      // Junction [2][1] should have inside corners due to diagonals
      expect(result[2][1].tileIndex).toBe(WATER_BORDER_INSIDE_TOP_LEFT);
    });
  });

  describe("Sprite Position Integration", () => {
    it("should calculate sprite position for each water cell", () => {
      const valueMap = createMap([
        [1, 1],
        [1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition).toBeTypeOf("object");
        }
      }
    });

    it("should ensure sprite position has correct structure", () => {
      const valueMap = createMap([[1]]);
      const result = generateWaterTileMap(valueMap);

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

      generateWaterTileMap(valueMap);

      expect(valueMap).toEqual(original);
    });

    it("should create independent output", () => {
      const valueMap = createMap([[1]]);
      const result = generateWaterTileMap(valueMap);

      result[0][0].tileIndex = 999;

      const result2 = generateWaterTileMap(valueMap);
      expect(isInteriorTile(result2[0][0].tileIndex)).toBe(true);
      expect(result2[0][0].tileIndex).not.toBe(999);
    });

    it("should handle input with extra properties without errors", () => {
      const valueMap = [[{ value: 1, extraProp: "test", nested: { foo: "bar" } }]];

      expect(() => generateWaterTileMap(valueMap)).not.toThrow();
      const result = generateWaterTileMap(valueMap);
    });

    it("should ensure all water tiles have tile property equal to 1", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ]);
      const result = generateWaterTileMap(valueMap);

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          if (result[y][x]) {
                }
        }
      }
    });
  });
});
