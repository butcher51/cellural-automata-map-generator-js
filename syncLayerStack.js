/**
 * Syncs the layer stack after painting.
 * @param {Array} layers - Array of layer objects
 * @param {number} fromLayerIndex - Index of the layer that was painted on
 * @returns {Array} New layers array (immutable)
 */
export function syncLayerStack(layers, fromLayerIndex) {
  return [...layers];
}
