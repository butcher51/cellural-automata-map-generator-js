import { describe, it, expect } from "vitest";
import { paintLineTileLine } from "./paintLineTileLine.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";

function createMaps(size) {
  return {
    lineTileValueMap: generateEmptyValueMap(size, 0),
    treeValueMap: generateEmptyValueMap(size, 1),
    pineValueMap: generateEmptyValueMap(size, 1),
    deadTreeValueMap: generateEmptyValueMap(size, 1),
    waterValueMap: generateEmptyValueMap(size, 0),
    cliffValueMap: generateEmptyValueMap(size, 0),
    groundTileMap: Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ tile: 1 }))
    ),
  };
}

describe("paintLineTileLine", () => {
  it("sets lineTileValueMap value to 1 and lineTileType for each cell", () => {
    const maps = createMaps(5);
    const cells = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.lineTileValueMap[1][1].value).toBe(1);
    expect(result.lineTileValueMap[1][1].lineTileType).toBe("road");
    expect(result.lineTileValueMap[1][2].value).toBe(1);
    expect(result.lineTileValueMap[1][2].lineTileType).toBe("road");
    expect(result.lineTileValueMap[1][3].value).toBe(1);
    expect(result.lineTileValueMap[1][3].lineTileType).toBe("road");
  });

  it("clears water at painted positions", () => {
    const maps = createMaps(5);
    maps.waterValueMap[1][2].value = 1;
    const cells = [{ x: 2, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.waterValueMap[1][2].value).toBe(0);
  });

  it("clears cliff at painted positions", () => {
    const maps = createMaps(5);
    maps.cliffValueMap[1][2].value = 1;
    const cells = [{ x: 2, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.cliffValueMap[1][2].value).toBe(0);
  });

  it("clears trees at painted positions (sets to 1 = no tree)", () => {
    const maps = createMaps(5);
    maps.treeValueMap[1][2].value = 0; // tree present
    const cells = [{ x: 2, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.treeValueMap[1][2].value).toBe(1);
  });

  it("clears pines at painted positions", () => {
    const maps = createMaps(5);
    maps.pineValueMap[1][2].value = 0; // pine present
    const cells = [{ x: 2, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.pineValueMap[1][2].value).toBe(1);
  });

  it("clears dead trees at painted positions", () => {
    const maps = createMaps(5);
    maps.deadTreeValueMap[1][2].value = 0; // dead tree present
    const cells = [{ x: 2, y: 1 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.deadTreeValueMap[1][2].value).toBe(1);
  });

  it("skips out-of-bounds cells", () => {
    const maps = createMaps(5);
    const cells = [{ x: -1, y: 0 }, { x: 2, y: 2 }, { x: 5, y: 5 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.lineTileValueMap[2][2].value).toBe(1);
    // Out of bounds cells should not cause errors
    expect(result.lineTileValueMap[0][0].value).toBe(0); // untouched
  });

  it("skips cells where groundTileMap is null", () => {
    const maps = createMaps(5);
    maps.groundTileMap[2][2] = null;
    const cells = [{ x: 2, y: 2 }, { x: 3, y: 2 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.lineTileValueMap[2][2].value).toBe(0); // skipped (null ground)
    expect(result.lineTileValueMap[2][3].value).toBe(1); // painted
  });

  it("handles empty cells array", () => {
    const maps = createMaps(5);
    const result = paintLineTileLine([], "road", maps);

    // All cells should remain untouched
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(result.lineTileValueMap[y][x].value).toBe(0);
      }
    }
  });

  it("handles different lineTile types", () => {
    const maps = createMaps(5);
    const cells = [{ x: 0, y: 0 }];

    const result1 = paintLineTileLine(cells, "road", maps);
    expect(result1.lineTileValueMap[0][0].lineTileType).toBe("road");

    const maps2 = createMaps(5);
    const result3 = paintLineTileLine(cells, "wallLeft", maps2);
    expect(result3.lineTileValueMap[0][0].lineTileType).toBe("wallLeft");

    const maps3 = createMaps(5);
    const result4 = paintLineTileLine(cells, "wallRight", maps3);
    expect(result4.lineTileValueMap[0][0].lineTileType).toBe("wallRight");
  });

  it("does not modify cells outside the painted line", () => {
    const maps = createMaps(5);
    const cells = [{ x: 2, y: 2 }];
    const result = paintLineTileLine(cells, "road", maps);

    expect(result.lineTileValueMap[0][0].value).toBe(0);
    expect(result.lineTileValueMap[4][4].value).toBe(0);
  });
});
