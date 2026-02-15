import { MAP_SIZE } from "./constants.js";
import { createLayer } from "./layer.js";
import { generateCliffTileMap } from "./generateCliffTileMap.js";
import { generateCliffValueMap } from "./generateCliffValueMap.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";
import { generateSparseGroundTileMap } from "./generateSparseGroundTileMap.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import { generateWaterTileMap } from "./generateWaterTileMap.js";
import { generateWaterValueMap } from "./generateWaterValueMap.js";
import { getCliffInteriorCells } from "./getCliffInteriorCells.js";

/**
 * Recursively syncs a layer and all layers above it.
 * Creates/updates/removes upper layers based on cliff interior detection.
 * @param {Array} layers - Mutable array of layers (will be modified in place)
 * @param {number} layerIndex - Index of layer to sync from
 */
function syncFromLayer(layers, layerIndex) {
  // Safety check
  if (layerIndex >= layers.length) {
    return;
  }

  const layer = layers[layerIndex];
  const interiorCells = getCliffInteriorCells(layer.cliffValueMap);

  if (interiorCells.length > 0) {
    // Interior exists → need layer above
    const aboveIndex = layerIndex + 1;

    if (aboveIndex < layers.length) {
      // Layer exists → UPDATE its ground
      const existingLayer = layers[aboveIndex];
      const mapSize = existingLayer.cliffValueMap.length;
      existingLayer.groundTileMap = generateSparseGroundTileMap(
        interiorCells,
        mapSize,
        existingLayer.groundTileMap
      );

      // Clear value maps where ground is null
      for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
          if (existingLayer.groundTileMap[y]?.[x] == null) {
            existingLayer.treeValueMap[y][x].value = 1; // No trees
            existingLayer.waterValueMap[y][x].value = 0; // No water
            existingLayer.cliffValueMap[y][x].value = 0; // No cliff
          }
        }
      }

      // Regenerate tile maps
      existingLayer.cliffTileMap = generateCliffTileMap(existingLayer.cliffValueMap, existingLayer.cliffTileMap || []);
      existingLayer.waterTileMap = generateWaterTileMap(existingLayer.waterValueMap, existingLayer.waterTileMap);
      existingLayer.treeTileMap = generateTreeTileMap(existingLayer.treeValueMap);

      // RECURSE: Check if upper layer has cliffs with interior
      const upperInterior = getCliffInteriorCells(existingLayer.cliffValueMap);
      if (upperInterior.length > 0) {
        syncFromLayer(layers, aboveIndex); // Recursive: handle cliff-on-cliff
      } else {
        layers.splice(aboveIndex + 1); // Remove layers above (no interior)
      }
    } else {
      // No layer above → CREATE NEW
      const newLayer = createLayer(`layer-${aboveIndex}`, `Layer ${aboveIndex}`, aboveIndex);

      // Initialize with random terrain
      newLayer.cliffValueMap = generateCliffValueMap();
      newLayer.waterValueMap = generateWaterValueMap();
      newLayer.treeValueMap = generateEmptyValueMap(MAP_SIZE, 1); // All 1s = no trees

      // Generate tile maps
      newLayer.treeTileMap = generateTreeTileMap(newLayer.treeValueMap);
      newLayer.cliffTileMap = generateCliffTileMap(newLayer.cliffValueMap, []);
      newLayer.waterTileMap = generateWaterTileMap(newLayer.waterValueMap, null);

      // Sparse ground at interior positions
      newLayer.groundTileMap = generateSparseGroundTileMap(interiorCells, MAP_SIZE);

      layers.push(newLayer);

      // Check if new layer has cliff interior (recursive stacking)
      const newLayerInterior = getCliffInteriorCells(newLayer.cliffValueMap);
      if (newLayerInterior.length > 0) {
        syncFromLayer(layers, aboveIndex);
      }
    }
  } else {
    // No interior → REMOVE all layers above
    layers.splice(layerIndex + 1);
  }
}

/**
 * Synchronizes the layer stack starting from a specific layer.
 * Creates, updates, or removes upper layers based on cliff interior detection.
 * Returns a new array (immutable).
 * @param {Array} layers - Array of layer objects
 * @param {number} fromLayerIndex - Index of layer to start sync from
 * @returns {Array} New array with synchronized layers
 */
export function syncLayerStack(layers, fromLayerIndex) {
  // Work with copy to maintain immutability
  const result = [...layers];
  syncFromLayer(result, fromLayerIndex);
  return result;
}
