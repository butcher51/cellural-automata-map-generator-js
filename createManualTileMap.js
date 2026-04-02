/**
 * Creates a size x size grid of nulls for manual tile placement.
 * Each cell is null (no manual tile) or { tileIndex, spritePosition }.
 * @param {number} size - Width and height of the map
 * @returns {Array} 2D array of nulls
 */
export function createManualTileMap(size) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = null;
    }
  }
  return map;
}
