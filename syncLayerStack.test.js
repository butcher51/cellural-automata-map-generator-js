import { describe, it, expect } from "vitest";
import { syncLayerStack } from "./syncLayerStack.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";
import { MAP_SIZE } from "./constants.js";

describe("syncLayerStack", () => {
  // Helper to create a basic layer structure
  function createLayer(id, name, order, cliffPositions = [], mapSize = MAP_SIZE) {
    const layer = {
      id,
      name,
      order,
      groundTileMap: createGroundTileMap(mapSize),
      cliffValueMap: createCliffMap(mapSize, cliffPositions),
      waterValueMap: generateEmptyValueMap(mapSize, 0),
      treeValueMap: generateEmptyValueMap(mapSize, 1),
      cliffTileMap: [],
      waterTileMap: [],
      treeTileMap: [],
    };
    return layer;
  }

  function createGroundTileMap(size) {
    const map = [];
    for (let y = 0; y < size; y++) {
      map[y] = [];
      for (let x = 0; x < size; x++) {
        map[y][x] = { tile: 0, spritePosition: { x: 0, y: 0 } };
      }
    }
    return map;
  }

  function createCliffMap(size, cliffPositions) {
    const map = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({ value: 0 }))
      );

    cliffPositions.forEach(([x, y]) => {
      map[y][x].value = 1;
    });

    return map;
  }

  describe("No interior - no layer creation", () => {
    it("should not create new layer when base layer has no cliffs", () => {
      const layers = [createLayer("layer-0", "Base", 0, [])];
      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("layer-0");
    });

    it("should not create new layer when base layer has only edge cliffs", () => {
      // Edge cliffs have no interior
      const layers = [
        createLayer("layer-0", "Base", 0, [
          [0, 0],
          [1, 0],
          [2, 0],
        ]),
      ];
      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(1);
    });

    it("should not create new layer when cliffs are too small (2x2)", () => {
      const layers = [
        createLayer("layer-0", "Base", 0, [
          [5, 5],
          [6, 5],
          [5, 6],
          [6, 6],
        ]),
      ];
      const result = syncLayerStack(layers, 0);

      // 2x2 has no interior cells (all are border)
      expect(result).toHaveLength(1);
    });
  });

  describe("Layer creation", () => {
    it("should create new layer when base has 5x3 cliff with interior", () => {
      // 5 rows tall (3-8) with 3 wide - top interior needs 8 neighbors + 3 cliffs below
      const cliffPositions = [];
      for (let y = 3; y <= 8; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }
      const layers = [createLayer("layer-0", "Base", 0, cliffPositions)];
      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(2);
      expect(result[1].order).toBe(1);
      // Interior cells exist at row 4 (has 8 neighbors + 3+ cliffs below)
      expect(result[1].groundTileMap[4][5]).not.toBeNull();
    });

    it("should create layer with sparse ground only at interior positions", () => {
      // Need 6 rows (1-6) to allow rows 2-3 to be interior
      const cliffPositions = [];
      for (let y = 1; y <= 6; y++) {
        for (let x = 3; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }
      const layers = [createLayer("layer-0", "Base", 0, cliffPositions)];
      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(2);
      const upperLayer = result[1];

      // Interior cells at rows 2-3, columns 4-5
      expect(upperLayer.groundTileMap[2][4]).not.toBeNull();
      expect(upperLayer.groundTileMap[2][5]).not.toBeNull();
      expect(upperLayer.groundTileMap[3][4]).not.toBeNull();
      expect(upperLayer.groundTileMap[3][5]).not.toBeNull();

      // Edge cells should be null
      expect(upperLayer.groundTileMap[1][3]).toBeNull();
      expect(upperLayer.groundTileMap[6][6]).toBeNull();
    });
  });

  describe("Layer updates", () => {
    it("should update existing layer when cliff interior expands", () => {
      // Start with 5 rows (3-7) - 1 interior cell at row 4
      const cliffPositions5rows = [];
      for (let y = 3; y <= 7; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions5rows.push([x, y]);
        }
      }

      // Create initial state with 2 layers
      const layers = [
        createLayer("layer-0", "Base", 0, cliffPositions5rows),
        createLayer("layer-1", "Layer 1", 1, []),
      ];

      // Expand to 6 rows (2-7) - 2 interior rows at 3-4
      const cliffPositions6rows = [];
      for (let y = 2; y <= 7; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions6rows.push([x, y]);
        }
      }
      layers[0].cliffValueMap = createCliffMap(10, cliffPositions6rows);

      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(2);
      // Upper layer should have more ground tiles now (2 rows vs 1)
      const upperLayer = result[1];
      expect(upperLayer.groundTileMap[3][5]).not.toBeNull();
      expect(upperLayer.groundTileMap[4][5]).not.toBeNull();
    });

    it("should update existing layer when cliff interior shrinks", () => {
      // Start with 6 rows (2-7) - 2 interior rows at 3-4
      const cliffPositions6rows = [];
      for (let y = 2; y <= 7; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions6rows.push([x, y]);
        }
      }

      const layers = [
        createLayer("layer-0", "Base", 0, cliffPositions6rows),
        createLayer("layer-1", "Layer 1", 1, []),
      ];

      // Shrink to 5 rows (3-7) - 1 interior row at 4
      const cliffPositions5rows = [];
      for (let y = 3; y <= 7; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions5rows.push([x, y]);
        }
      }
      layers[0].cliffValueMap = createCliffMap(10, cliffPositions5rows);

      const result = syncLayerStack(layers, 0);

      expect(result).toHaveLength(2);
      const upperLayer = result[1];

      // Only row 4 should have ground now (1 row vs 2 rows before)
      expect(upperLayer.groundTileMap[4][5]).not.toBeNull();
      // Previous interior cells at row 3 should be null
      expect(upperLayer.groundTileMap[3][5]).toBeNull();
    });
  });

  describe("Layer removal", () => {
    it("should remove upper layer when base layer loses all interior", () => {
      // Start with layer stack
      const cliffPositions = [];
      for (let y = 4; y <= 6; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }

      const layers = [
        createLayer("layer-0", "Base", 0, cliffPositions),
        createLayer("layer-1", "Layer 1", 1, []),
      ];

      // Remove all cliffs from base
      layers[0].cliffValueMap = createCliffMap(10, []);

      const result = syncLayerStack(layers, 0);

      // Upper layer should be removed
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("layer-0");
    });

    it("should remove multiple upper layers when base loses interior", () => {
      const layers = [
        createLayer("layer-0", "Base", 0, []),
        createLayer("layer-1", "Layer 1", 1, []),
        createLayer("layer-2", "Layer 2", 2, []),
        createLayer("layer-3", "Layer 3", 3, []),
      ];

      // Base has no interior
      layers[0].cliffValueMap = createCliffMap(10, []);

      const result = syncLayerStack(layers, 0);

      // All upper layers should be removed
      expect(result).toHaveLength(1);
    });
  });

  describe("Recursive stacking", () => {
    it("should create 3-level stack when each layer has interior cliffs", () => {
      // Layer 0: 8 rows (1-8), 5 wide → interior at rows 2-4
      const cliff8rows = [];
      for (let y = 1; y <= 8; y++) {
        for (let x = 2; x <= 6; x++) {
          cliff8rows.push([x, y]);
        }
      }

      const layers = [createLayer("layer-0", "Base", 0, cliff8rows)];

      // Sync from layer 0 - should create layer 1
      let result = syncLayerStack(layers, 0);
      expect(result).toHaveLength(2);

      // Add cliffs to layer 1 (6 rows on the interior at rows 2-7)
      const cliff6rows = [];
      for (let y = 2; y <= 7; y++) {
        for (let x = 3; x <= 5; x++) {
          cliff6rows.push([x, y]);
        }
      }
      result[1].cliffValueMap = createCliffMap(10, cliff6rows);

      // Sync from layer 1 - should create layer 2
      result = syncLayerStack(result, 1);
      expect(result).toHaveLength(3);
      expect(result[2].order).toBe(2);
    });
  });

  describe("Immutability", () => {
    it("should return new array, not mutate input", () => {
      const cliffPositions = [];
      for (let y = 4; y <= 6; y++) {
        for (let x = 4; x <= 6; x++) {
          cliffPositions.push([x, y]);
        }
      }

      const layers = [createLayer("layer-0", "Base", 0, cliffPositions)];
      const originalLength = layers.length;

      const result = syncLayerStack(layers, 0);

      // Original array should not be mutated
      expect(layers).toHaveLength(originalLength);
      // Result should be different array
      expect(result).not.toBe(layers);
    });
  });
});
