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
  CLIFF_WALL_TOP_LEFT,
  CLIFF_WALL_TOP_CENTER,
  CLIFF_WALL_TOP_RIGHT,
  CLIFF_WALL_MID_LEFT,
  CLIFF_WALL_MID_CENTER,
  CLIFF_WALL_MID_RIGHT,
  CLIFF_WALL_BOTTOM_LEFT,
  CLIFF_WALL_BOTTOM_CENTER,
  CLIFF_WALL_BOTTOM_RIGHT,
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
    });

    it("should ensure all cliff cells have required properties", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 3));

      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 3; x++) {
          expect(result[y][x].tileIndex).toBeTypeOf("number");
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition.spriteX).toBeTypeOf("number");
          expect(result[y][x].spritePosition.spriteY).toBeTypeOf("number");
        }
      }
    });
  });

  describe("Surface Border Detection (distFromBottom >= 3)", () => {
    // For a 3x6 solid cliff, the top 3 rows have distFromBottom >= 3
    // and should use standard border detection

    it("should detect top edge for surface tiles", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Row 1 center (x=2,y=1) has distFromBottom=4 >= 3, top is land
      expect(result[1][2].tileIndex).toBe(CLIFF_BORDER_TOP);
    });

    it("should detect top-left corner for surface tiles", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Top-left corner at (1,1): top and left are land
      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
    });

    it("should detect top-right corner for surface tiles", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      expect(result[1][3].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);
    });

    it("should detect left edge for surface tiles", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Row 2 left (x=1,y=2): distFromBottom=3, left is land
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
    });

    it("should detect right edge for surface tiles", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      expect(result[2][3].tileIndex).toBe(CLIFF_BORDER_RIGHT);
    });

    it("should detect interior for surface tiles fully surrounded", () => {
      const valueMap = createMap([
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(8, 5));
      // Cell at (2,2): distFromBottom=5 >= 3, all neighbors cliff
      // But at map edge, out-of-bounds counts as land, so need interior cell
      // Let's check (2,4) which has distFromBottom=3, top/bottom/left/right are all cliff
      // Wait, (2,4) is at y=4, x=2: distFromBottom=3, and all 4 cardinal neighbors are cliff
      const interiorIndices = CLIFF_INTERIOR_TILES.map((t) => t.index);
      // Cell at (2,4): distFromBottom=3, surrounded by cliff
      expect(interiorIndices).toContain(result[4][2].tileIndex);
    });
  });

  describe("Wall Tile Detection (distFromBottom < 3)", () => {
    it("should assign wall bottom row tile at bottom edge of cliff", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Row 5 (last cliff row): distFromBottom=0
      // Center cell (x=2): both left/right are cliff → center variant
      expect(result[5][2].tileIndex).toBe(CLIFF_WALL_BOTTOM_CENTER);
    });

    it("should assign wall mid row tile one row above bottom", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Row 4: distFromBottom=1
      expect(result[4][2].tileIndex).toBe(CLIFF_WALL_MID_CENTER);
    });

    it("should assign wall top row tile two rows above bottom", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // Row 3: distFromBottom=2
      expect(result[3][2].tileIndex).toBe(CLIFF_WALL_TOP_CENTER);
    });

    it("should assign wall left variant when left neighbor is not cliff", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // x=1: left neighbor is land (x=0 is 0)
      expect(result[5][1].tileIndex).toBe(CLIFF_WALL_BOTTOM_LEFT);
      expect(result[4][1].tileIndex).toBe(CLIFF_WALL_MID_LEFT);
      expect(result[3][1].tileIndex).toBe(CLIFF_WALL_TOP_LEFT);
    });

    it("should assign wall right variant when right neighbor is not cliff", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));
      // x=3: right neighbor is land (x=4 is 0)
      expect(result[5][3].tileIndex).toBe(CLIFF_WALL_BOTTOM_RIGHT);
      expect(result[4][3].tileIndex).toBe(CLIFF_WALL_MID_RIGHT);
      expect(result[3][3].tileIndex).toBe(CLIFF_WALL_TOP_RIGHT);
    });

    it("should handle wall tiles at map boundary", () => {
      // Cliff at left edge of map
      const valueMap = createMap([
        [1, 1, 1, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 0],
        [1, 1, 1, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 4));
      // x=0 at bottom rows: left is out of bounds (counts as not cliff) → left variant
      expect(result[4][0].tileIndex).toBe(CLIFF_WALL_BOTTOM_LEFT);
      // x=2: right neighbor is land → right variant
      expect(result[4][2].tileIndex).toBe(CLIFF_WALL_BOTTOM_RIGHT);
    });
  });

  describe("Wall and Surface Boundary", () => {
    it("should have wall tiles for bottom 3 rows and surface tiles above in minimum 3x5 cliff", () => {
      // Minimum cliff: 3 wide × 5 tall, surrounded by land
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(7, 5));

      // Row 1 (y=1): distFromBottom = 4 >= 3 → surface tiles
      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_LEFT);
      expect(result[1][2].tileIndex).toBe(CLIFF_BORDER_TOP);
      expect(result[1][3].tileIndex).toBe(CLIFF_BORDER_CORNER_TOP_RIGHT);

      // Row 2 (y=2): distFromBottom = 3 >= 3 → surface tiles
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
      expect(result[2][3].tileIndex).toBe(CLIFF_BORDER_RIGHT);

      // Row 3 (y=3): distFromBottom = 2 → wall top
      expect(result[3][1].tileIndex).toBe(CLIFF_WALL_TOP_LEFT);
      expect(result[3][2].tileIndex).toBe(CLIFF_WALL_TOP_CENTER);
      expect(result[3][3].tileIndex).toBe(CLIFF_WALL_TOP_RIGHT);

      // Row 4 (y=4): distFromBottom = 1 → wall mid
      expect(result[4][1].tileIndex).toBe(CLIFF_WALL_MID_LEFT);
      expect(result[4][2].tileIndex).toBe(CLIFF_WALL_MID_CENTER);
      expect(result[4][3].tileIndex).toBe(CLIFF_WALL_MID_RIGHT);

      // Row 5 (y=5): distFromBottom = 0 → wall bottom
      expect(result[5][1].tileIndex).toBe(CLIFF_WALL_BOTTOM_LEFT);
      expect(result[5][2].tileIndex).toBe(CLIFF_WALL_BOTTOM_CENTER);
      expect(result[5][3].tileIndex).toBe(CLIFF_WALL_BOTTOM_RIGHT);
    });

    it("should have more surface rows for taller cliffs", () => {
      const valueMap = createMap([
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(9, 5));

      // Rows 1-4: distFromBottom >= 3 → surface tiles
      expect(result[1][2].tileIndex).toBe(CLIFF_BORDER_TOP);
      expect(result[2][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
      expect(result[3][1].tileIndex).toBe(CLIFF_BORDER_LEFT);
      expect(result[4][1].tileIndex).toBe(CLIFF_BORDER_LEFT);

      // Rows 5-7: wall tiles
      expect(result[5][2].tileIndex).toBe(CLIFF_WALL_TOP_CENTER);
      expect(result[6][2].tileIndex).toBe(CLIFF_WALL_MID_CENTER);
      expect(result[7][2].tileIndex).toBe(CLIFF_WALL_BOTTOM_CENTER);
    });
  });

  describe("DistFromBottom Calculation", () => {
    it("should correctly count distance from bottom in irregular shape", () => {
      // An L-shaped cliff where bottom edge varies by column
      const valueMap = createMap([
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(9, 6));

      // Column 4 (x=4): cliff from row 1-5, bottom at row 5
      // Row 5 (x=4): distFromBottom=0 → wall bottom
      expect(result[5][4].tileIndex).toBe(CLIFF_WALL_BOTTOM_RIGHT);
      // Row 4 (x=4): distFromBottom=1 → wall mid
      expect(result[4][4].tileIndex).toBe(CLIFF_WALL_MID_RIGHT);
      // Row 3 (x=4): distFromBottom=2 → wall top
      expect(result[3][4].tileIndex).toBe(CLIFF_WALL_TOP_RIGHT);
      // Row 2 (x=4): distFromBottom=3 → surface
      expect(result[2][4].tileIndex).toBe(CLIFF_BORDER_RIGHT);

      // Column 2 (x=2): cliff from row 1-7, bottom at row 7
      // Row 7 (x=2): distFromBottom=0 → wall bottom center
      expect(result[7][2].tileIndex).toBe(CLIFF_WALL_BOTTOM_CENTER);
    });
  });

  describe("Inside Corner Detection for Surface", () => {
    it("should detect inside corners in surface area", () => {
      const valueMap = createMap([
        [0, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(8, 6));
      // Cell at (1,1): distFromBottom=6 >= 3 → surface tile
      // Top-left diagonal is land (0,0)=0, but all 4 cardinals are cliff → inside corner
      expect(result[1][1].tileIndex).toBe(CLIFF_BORDER_INSIDE_TOP_LEFT);
    });
  });

  describe("Sprite Position Integration", () => {
    it("should calculate sprite position for each cliff cell", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 3));

      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 3; x++) {
          expect(result[y][x].spritePosition).toBeDefined();
          expect(result[y][x].spritePosition).toBeTypeOf("object");
        }
      }
    });

    it("should ensure sprite position has correct structure", () => {
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 3));

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
      const valueMap = createMap([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]);
      const result = generateCliffTileMap(valueMap, emptyTileMap(5, 3));

      result[0][0].tileIndex = 999;

      const result2 = generateCliffTileMap(valueMap, emptyTileMap(5, 3));
      expect(result2[0][0].tileIndex).not.toBe(999);
    });
  });
});
