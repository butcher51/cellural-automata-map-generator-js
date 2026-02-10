/**
 * Creates a size x size grid of {value: defaultValue} cells.
 * Used to initialize value maps on new layers.
 * @param {number} size - Width and height of the map
 * @param {number} defaultValue - Value for each cell (default: 0)
 * @returns {Array} 2D array of {value: defaultValue} cell objects
 */
export function generateEmptyValueMap(size, defaultValue = 0) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { value: defaultValue };
    }
  }
  return map;
}
