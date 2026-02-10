import { describe, it, expect } from "vitest";
import { getTargetLayerIndex } from "./getTargetLayerIndex.js";

// Helper to create a mock layer with optional sparse ground
function mockLayer(order, groundCells = null, mapSize = 10) {
  let groundTileMap = null;
  if (order === 0) {
    // Base layer always has full ground
    groundTileMap = Array.from({ length: mapSize }, () =>
      Array.from({ length: mapSize }, () => ({ tile: 1, spritePosition: { spriteX: 0, spriteY: 0 } }))
    );
  } else if (groundCells) {
    // Higher layer with sparse ground
    groundTileMap = Array.from({ length: mapSize }, () => Array(mapSize).fill(null));
    for (const { x, y } of groundCells) {
      groundTileMap[y][x] = { tile: 1, spritePosition: { spriteX: 0, spriteY: 0 } };
    }
  }
  return { id: `layer-${order}`, name: `Layer ${order}`, order, groundTileMap };
}

describe("getTargetLayerIndex", () => {
  it("returns 0 for single base layer", () => {
    const layers = [mockLayer(0)];
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(0);
  });

  it("returns higher layer index when it has ground at position", () => {
    const layers = [
      mockLayer(0),
      mockLayer(1, [{ x: 5, y: 5 }]),
    ];
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(1);
  });

  it("returns base layer when higher layer has no ground at position", () => {
    const layers = [
      mockLayer(0),
      mockLayer(1, [{ x: 3, y: 3 }]),
    ];
    // Position (5,5) has no ground on layer 1
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(0);
  });

  it("returns highest layer with ground for three stacked layers", () => {
    const layers = [
      mockLayer(0),
      mockLayer(1, [{ x: 5, y: 5 }]),
      mockLayer(2, [{ x: 5, y: 5 }]),
    ];
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(2);
  });

  it("returns middle layer when top layer lacks ground but middle has it", () => {
    const layers = [
      mockLayer(0),
      mockLayer(1, [{ x: 5, y: 5 }]),
      mockLayer(2, [{ x: 3, y: 3 }]), // no ground at (5,5)
    ];
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(1);
  });

  it("falls to base layer for out-of-bounds coordinates", () => {
    const layers = [
      mockLayer(0),
      mockLayer(1, [{ x: 5, y: 5 }]),
    ];
    expect(getTargetLayerIndex(layers, -1, -1)).toBe(0);
    expect(getTargetLayerIndex(layers, 100, 100)).toBe(0);
  });

  it("handles layer without groundTileMap (falls through)", () => {
    const layers = [
      mockLayer(0),
      { id: "layer-1", name: "Layer 1", order: 1, groundTileMap: null },
    ];
    expect(getTargetLayerIndex(layers, 5, 5)).toBe(0);
  });
});
