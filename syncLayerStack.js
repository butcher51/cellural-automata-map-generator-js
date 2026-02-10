import { MAP_SIZE } from "./constants.js";
import { createLayer } from "./layer.js";
import { getCliffInteriorCells } from "./getCliffInteriorCells.js";
import { generateSparseGroundTileMap } from "./generateSparseGroundTileMap.js";
import { generateCliffValueMap } from "./generateCliffValueMap.js";
import { generateWaterValueMap } from "./generateWaterValueMap.js";
import { generateEmptyValueMap } from "./generateEmptyValueMap.js";
import { generateTreeTileMap } from "./generateTreeTileMap.js";
import { generateCliffTileMap } from "./generateCliffTileMap.js";
import { generateWaterTileMap } from "./generateWaterTileMap.js";

let nextLayerId = 1;

/**
 * Syncs the layer stack after painting. Computes cliff interiors and
 * creates/updates/removes upper layers accordingly.
 * @param {Array} layers - Array of layer objects
 * @param {number} fromLayerIndex - Index of the layer that was painted on
 * @returns {Array} New layers array (immutable)
 */
export function syncLayerStack(layers, fromLayerIndex) {
  // Work with a copy
  let result = [...layers];

  syncFromLayer(result, fromLayerIndex);

  return result;
}

function syncFromLayer(layers, layerIndex) {
  const layer = layers[layerIndex];
  const interiorCells = getCliffInteriorCells(layer.cliffValueMap);

  if (interiorCells.length > 0) {
    // Interior cells exist → need a layer above
    const aboveIndex = layerIndex + 1;

    if (aboveIndex < layers.length) {
      // Layer above exists → update its ground
      const existingLayer = layers[aboveIndex];
      existingLayer.groundTileMap = generateSparseGroundTileMap(
        interiorCells,
        MAP_SIZE,
        existingLayer.groundTileMap,
      );
      // Regenerate tile maps for the upper layer
      existingLayer.cliffTileMap = generateCliffTileMap(existingLayer.cliffValueMap, existingLayer.cliffTileMap || []);
      existingLayer.waterTileMap = generateWaterTileMap(existingLayer.waterValueMap, existingLayer.waterTileMap);
      existingLayer.treeTileMap = generateTreeTileMap(existingLayer.treeValueMap);
    } else {
      // No layer above → create one
      const newLayer = createLayer(
        `layer-${nextLayerId++}`,
        `Layer ${aboveIndex}`,
        aboveIndex,
      );
      newLayer.cliffValueMap = generateCliffValueMap();
      newLayer.waterValueMap = generateWaterValueMap();
      newLayer.treeValueMap = generateEmptyValueMap(MAP_SIZE, 1);
      newLayer.treeTileMap = generateTreeTileMap(newLayer.treeValueMap);
      newLayer.cliffTileMap = generateCliffTileMap(newLayer.cliffValueMap, []);
      newLayer.waterTileMap = generateWaterTileMap(newLayer.waterValueMap, null);
      newLayer.groundTileMap = generateSparseGroundTileMap(interiorCells, MAP_SIZE);
      layers.push(newLayer);
    }

    // Recurse: if the layer above has cliffs, sync from it too
    if (layers[aboveIndex].cliffValueMap) {
      const upperInterior = getCliffInteriorCells(layers[aboveIndex].cliffValueMap);
      if (upperInterior.length > 0) {
        syncFromLayer(layers, aboveIndex);
      } else {
        // No cliff interior on the layer above → remove everything above it
        layers.splice(aboveIndex + 1);
      }
    }
  } else {
    // No interior cells → remove all layers above this one
    layers.splice(layerIndex + 1);
  }
}
