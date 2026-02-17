/**
 * Creates a new layer object with null maps.
 * @param {string} id - Unique layer identifier
 * @param {string} name - Display name
 * @param {number} order - Render order (0 = bottom, higher = on top)
 * @returns {object} Layer object
 */
export function createLayer(id, name, order) {
  return {
    id,
    name,
    order,
    treeValueMap: null,
    waterValueMap: null,
    cliffValueMap: null,
    pineValueMap: null,
    treeTileMap: null,
    waterTileMap: null,
    cliffTileMap: null,
    pineTileMap: null,
    groundTileMap: null,
  };
}

/**
 * Extracts value maps from a layer.
 * @param {object} layer
 * @returns {{ treeValueMap, waterValueMap, cliffValueMap, pineValueMap }}
 */
export function getValueMaps(layer) {
  return {
    treeValueMap: layer.treeValueMap,
    waterValueMap: layer.waterValueMap,
    cliffValueMap: layer.cliffValueMap,
    pineValueMap: layer.pineValueMap,
  };
}

/**
 * Extracts tile maps from a layer.
 * @param {object} layer
 * @returns {{ treeTileMap, waterTileMap, cliffTileMap, pineTileMap, groundTileMap }}
 */
export function getTileMaps(layer) {
  return {
    treeTileMap: layer.treeTileMap,
    waterTileMap: layer.waterTileMap,
    cliffTileMap: layer.cliffTileMap,
    pineTileMap: layer.pineTileMap,
    groundTileMap: layer.groundTileMap,
  };
}

/**
 * Returns a copy of the layers array sorted by order ascending.
 * Does not mutate the original array.
 * @param {object[]} layers
 * @returns {object[]} Sorted copy
 */
export function sortLayersByOrder(layers) {
  return [...layers].sort((a, b) => a.order - b.order);
}
