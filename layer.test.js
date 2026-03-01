import { describe, expect, it } from "vitest";
import { createLayer, getValueMaps, getTileMaps, sortLayersByOrder } from "./layer.js";

describe("createLayer", () => {
  it("should return an object with correct id, name, and order", () => {
    const layer = createLayer("layer-0", "Base Layer", 0);
    expect(layer.id).toBe("layer-0");
    expect(layer.name).toBe("Base Layer");
    expect(layer.order).toBe(0);
  });

  it("should initialize all value maps to null", () => {
    const layer = createLayer("layer-0", "Base Layer", 0);
    expect(layer.treeValueMap).toBeNull();
    expect(layer.waterValueMap).toBeNull();
    expect(layer.deepWaterValueMap).toBeNull();
    expect(layer.pineValueMap).toBeNull();
    expect(layer.lineTileValueMap).toBeNull();
  });

  it("should initialize all tile maps to null", () => {
    const layer = createLayer("layer-0", "Base Layer", 0);
    expect(layer.treeTileMap).toBeNull();
    expect(layer.waterTileMap).toBeNull();
    expect(layer.deepWaterTileMap).toBeNull();
    expect(layer.pineTileMap).toBeNull();
    expect(layer.lineTileTileMap).toBeNull();
    expect(layer.groundTileMap).toBeNull();
  });

  it("should handle different order values", () => {
    const layer = createLayer("layer-5", "Top Layer", 5);
    expect(layer.order).toBe(5);
  });
});

describe("getValueMaps", () => {
  it("should extract value maps from a layer", () => {
    const layer = createLayer("layer-0", "Base", 0);
    layer.treeValueMap = [[{ value: 1 }]];
    layer.waterValueMap = [[{ value: 0 }]];

    const result = getValueMaps(layer);
    expect(result.treeValueMap).toBe(layer.treeValueMap);
    expect(result.waterValueMap).toBe(layer.waterValueMap);
  });

  it("should return null maps when layer has null maps", () => {
    const layer = createLayer("layer-0", "Base", 0);
    const result = getValueMaps(layer);
    expect(result.treeValueMap).toBeNull();
    expect(result.waterValueMap).toBeNull();
  });

  it("should only contain the five value map keys", () => {
    const layer = createLayer("layer-0", "Base", 0);
    const result = getValueMaps(layer);
    expect(Object.keys(result)).toEqual(["treeValueMap", "waterValueMap", "deepWaterValueMap", "cliffValueMap", "pineValueMap", "deadTreeValueMap", "lineTileValueMap"]);
  });
});

describe("getTileMaps", () => {
  it("should extract tile maps from a layer", () => {
    const layer = createLayer("layer-0", "Base", 0);
    layer.treeTileMap = [[{ tile: 1 }]];
    layer.waterTileMap = [[{ tile: 2 }]];
    layer.groundTileMap = [[{ tile: 4 }]];

    const result = getTileMaps(layer);
    expect(result.treeTileMap).toBe(layer.treeTileMap);
    expect(result.waterTileMap).toBe(layer.waterTileMap);
    expect(result.groundTileMap).toBe(layer.groundTileMap);
  });

  it("should return null maps when layer has null maps", () => {
    const layer = createLayer("layer-0", "Base", 0);
    const result = getTileMaps(layer);
    expect(result.treeTileMap).toBeNull();
    expect(result.waterTileMap).toBeNull();
    expect(result.groundTileMap).toBeNull();
  });

  it("should only contain the six tile map keys", () => {
    const layer = createLayer("layer-0", "Base", 0);
    const result = getTileMaps(layer);
    expect(Object.keys(result)).toEqual(["treeTileMap", "waterTileMap", "deepWaterTileMap", "cliffTileMap", "pineTileMap", "deadTreeTileMap", "lineTileTileMap", "groundTileMap"]);
  });
});

describe("sortLayersByOrder", () => {
  it("should sort layers in ascending order", () => {
    const layers = [
      createLayer("layer-2", "Top", 2),
      createLayer("layer-0", "Bottom", 0),
      createLayer("layer-1", "Middle", 1),
    ];
    const sorted = sortLayersByOrder(layers);
    expect(sorted[0].order).toBe(0);
    expect(sorted[1].order).toBe(1);
    expect(sorted[2].order).toBe(2);
  });

  it("should not mutate the original array", () => {
    const layers = [
      createLayer("layer-2", "Top", 2),
      createLayer("layer-0", "Bottom", 0),
    ];
    const sorted = sortLayersByOrder(layers);
    expect(layers[0].order).toBe(2); // Original unchanged
    expect(sorted[0].order).toBe(0); // Sorted copy
    expect(sorted).not.toBe(layers);
  });

  it("should handle empty array", () => {
    expect(sortLayersByOrder([])).toEqual([]);
  });

  it("should handle single layer", () => {
    const layers = [createLayer("layer-0", "Only", 0)];
    const sorted = sortLayersByOrder(layers);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].order).toBe(0);
  });

  it("should handle layers with same order (stable)", () => {
    const layers = [
      createLayer("layer-a", "A", 1),
      createLayer("layer-b", "B", 1),
    ];
    const sorted = sortLayersByOrder(layers);
    expect(sorted).toHaveLength(2);
    expect(sorted[0].id).toBe("layer-a");
    expect(sorted[1].id).toBe("layer-b");
  });
});
