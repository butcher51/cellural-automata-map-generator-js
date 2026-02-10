import { describe, it, expect } from "vitest";
import { syncLayerStack } from "./syncLayerStack.js";
import { MAP_SIZE } from "./constants.js";

// Helper to create a full value map (all 0)
function createValueMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { tile: 0, value: 0 };
    }
  }
  return map;
}

// Helper to create an empty tree value map (all {value: 0})
function createTreeValueMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { value: 0 };
    }
  }
  return map;
}

// Helper to create a full ground tile map
function createGroundTileMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { tile: 1, spritePosition: { spriteX: 0, spriteY: 0 } };
    }
  }
  return map;
}

// Helper to set a block of cliff cells
function setCliffBlock(cliffValueMap, startX, startY, width, height) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (y >= 0 && y < cliffValueMap.length && x >= 0 && x < cliffValueMap[0].length) {
        cliffValueMap[y][x].value = 1;
      }
    }
  }
}

// Helper to create a base layer
function createBaseLayer(size = MAP_SIZE) {
  return {
    id: "layer-0",
    name: "Base Layer",
    order: 0,
    treeValueMap: createTreeValueMap(size),
    waterValueMap: createValueMap(size),
    cliffValueMap: createValueMap(size),
    treeTileMap: null,
    waterTileMap: null,
    cliffTileMap: null,
    groundTileMap: createGroundTileMap(size),
  };
}

describe("syncLayerStack", () => {
  it("returns same layers when no cliff interior cells exist", () => {
    const base = createBaseLayer();
    const result = syncLayerStack([base], 0);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("layer-0");
  });

  it("creates a new layer when cliff has interior cells (5x5 cliff)", () => {
    const base = createBaseLayer();
    // 5x5 cliff block at (10,10) → 3x3 interior at (11,11)-(13,13)
    setCliffBlock(base.cliffValueMap, 10, 10, 5, 5);
    const result = syncLayerStack([base], 0);
    expect(result).toHaveLength(2);
    expect(result[1].order).toBe(1);
    // Verify the new layer has sparse ground at interior positions
    expect(result[1].groundTileMap[11][11]).not.toBeNull();
    expect(result[1].groundTileMap[12][12]).not.toBeNull();
    expect(result[1].groundTileMap[13][13]).not.toBeNull();
    // Non-interior positions should be null
    expect(result[1].groundTileMap[10][10]).toBeNull();
    expect(result[1].groundTileMap[0][0]).toBeNull();
  });

  it("creates layer with initialized value maps", () => {
    const base = createBaseLayer();
    setCliffBlock(base.cliffValueMap, 10, 10, 5, 5);
    const result = syncLayerStack([base], 0);
    const newLayer = result[1];
    // Should have empty value maps
    expect(newLayer.cliffValueMap).not.toBeNull();
    expect(newLayer.waterValueMap).not.toBeNull();
    expect(newLayer.treeValueMap).not.toBeNull();
    // Cliff and water value maps should be all zeros
    expect(newLayer.cliffValueMap[0][0].value).toBe(0);
    expect(newLayer.waterValueMap[0][0].value).toBe(0);
    // Tree value map should be all ones (1 = no tree, so cliff top starts clear)
    expect(newLayer.treeValueMap[0][0].value).toBe(1);
  });

  it("removes upper layers when cliff interior disappears", () => {
    const base = createBaseLayer();
    // Start with a layer above
    const upper = {
      id: "layer-1",
      name: "Layer 1",
      order: 1,
      treeValueMap: createTreeValueMap(MAP_SIZE),
      waterValueMap: createValueMap(MAP_SIZE),
      cliffValueMap: createValueMap(MAP_SIZE),
      treeTileMap: null,
      waterTileMap: null,
      cliffTileMap: null,
      groundTileMap: Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(null)),
    };
    // No cliff on base layer → no interior → should remove upper layer
    const result = syncLayerStack([base, upper], 0);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("layer-0");
  });

  it("updates existing upper layer ground when cliff changes", () => {
    const base = createBaseLayer();
    setCliffBlock(base.cliffValueMap, 10, 10, 5, 5);

    // Create initial upper layer with old ground
    const upper = {
      id: "layer-1",
      name: "Layer 1",
      order: 1,
      treeValueMap: createTreeValueMap(MAP_SIZE),
      waterValueMap: createValueMap(MAP_SIZE),
      cliffValueMap: createValueMap(MAP_SIZE),
      treeTileMap: null,
      waterTileMap: null,
      cliffTileMap: null,
      groundTileMap: Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(null)),
    };
    // Put an existing ground tile that should be preserved
    upper.groundTileMap[11][11] = { tile: 99, spritePosition: { spriteX: 50, spriteY: 60 } };

    const result = syncLayerStack([base, upper], 0);
    expect(result).toHaveLength(2);
    // Existing tile at (11,11) should be preserved
    expect(result[1].groundTileMap[11][11].tile).toBe(99);
    // New interior cells should have ground
    expect(result[1].groundTileMap[12][12]).not.toBeNull();
  });

  it("handles recursive cliff stacking (cliff on cliff)", () => {
    const base = createBaseLayer();
    // 7x7 cliff on base → 5x5 interior
    setCliffBlock(base.cliffValueMap, 10, 10, 7, 7);

    const result = syncLayerStack([base], 0);
    expect(result).toHaveLength(2);
    // The upper layer should have ground at the 5x5 interior of the base cliff
    const upperGround = result[1].groundTileMap;
    expect(upperGround[11][11]).not.toBeNull();
    expect(upperGround[15][15]).not.toBeNull();

    // Now if we add cliff on the upper layer and re-sync
    setCliffBlock(result[1].cliffValueMap, 11, 11, 5, 5);
    const result2 = syncLayerStack(result, 1);
    // Should have 3 layers now (base + layer1 + layer2)
    expect(result2).toHaveLength(3);
    expect(result2[2].order).toBe(2);
    // Layer 2 should have ground at interior of layer 1's cliff (3x3 at 12,12-14,14)
    expect(result2[2].groundTileMap[12][12]).not.toBeNull();
    expect(result2[2].groundTileMap[13][13]).not.toBeNull();
    expect(result2[2].groundTileMap[14][14]).not.toBeNull();
  });

  it("cascade removes all upper layers when base cliff is erased", () => {
    const base = createBaseLayer();
    setCliffBlock(base.cliffValueMap, 10, 10, 7, 7);

    // Build stack
    let result = syncLayerStack([base], 0);
    setCliffBlock(result[1].cliffValueMap, 11, 11, 5, 5);
    result = syncLayerStack(result, 1);
    expect(result).toHaveLength(3);

    // Now remove all cliff from base
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        result[0].cliffValueMap[y][x].value = 0;
      }
    }
    result = syncLayerStack(result, 0);
    // All upper layers should be removed
    expect(result).toHaveLength(1);
  });

  it("does not mutate the input layers array", () => {
    const base = createBaseLayer();
    setCliffBlock(base.cliffValueMap, 10, 10, 5, 5);
    const original = [base];
    const result = syncLayerStack(original, 0);
    // Original array should still have 1 layer
    expect(original).toHaveLength(1);
    expect(result).toHaveLength(2);
  });

  it("shrinks upper ground when cliff shrinks", () => {
    const base = createBaseLayer();
    // Large cliff: 7x7 → 5x5 interior
    setCliffBlock(base.cliffValueMap, 10, 10, 7, 7);
    let result = syncLayerStack([base], 0);
    expect(result[1].groundTileMap[15][15]).not.toBeNull();

    // Shrink cliff to 5x5 → 3x3 interior
    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        result[0].cliffValueMap[y][x].value = 0;
      }
    }
    setCliffBlock(result[0].cliffValueMap, 10, 10, 5, 5);
    result = syncLayerStack(result, 0);

    // (15,15) should now be null (outside 3x3 interior)
    expect(result[1].groundTileMap[15][15]).toBeNull();
    // (11,11)-(13,13) should still have ground
    expect(result[1].groundTileMap[11][11]).not.toBeNull();
    expect(result[1].groundTileMap[13][13]).not.toBeNull();
  });
});
