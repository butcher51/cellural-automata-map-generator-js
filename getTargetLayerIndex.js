/**
 * Determines which layer to paint on based on cursor position.
 * Walks layers from highest-order to lowest.
 * Returns index of the first layer that has ground at (x, y).
 * Bottom layer (order 0) always has ground everywhere.
 * @param {Array} layers - Array of layer objects sorted by order
 * @param {number} x - Grid x coordinate
 * @param {number} y - Grid y coordinate
 * @returns {number} Index into the layers array
 */
export function getTargetLayerIndex(layers, x, y) {
  // Walk from highest to lowest
  for (let i = layers.length - 1; i > 0; i--) {
    const layer = layers[i];
    if (layer.groundTileMap && layer.groundTileMap[y]?.[x] != null) {
      return i;
    }
  }
  // Default to base layer (index 0)
  return 0;
}
