/**
 * Matches a 2D pattern against a valueMap centered at the specified coordinates.
 *
 * The pattern is centered on the given (x, y) coordinate. For example:
 * - A 3x3 pattern centered at (2,2) will span from (1,1) to (3,3)
 * - A 5x5 pattern centered at (2,2) will span from (0,0) to (4,4)
 * - A 1x1 pattern centered at (x,y) will match only that cell
 * - Even-sized patterns: 2x2 centered at (1,1) spans from (1,1) to (2,2)
 *
 * @param {Array<Array<{value: number}>>} valueMap - The map to search in
 * @param {Array<Array<number>>} pattern - The 2D pattern to match (0s and 1s)
 * @param {number} x - The x coordinate (column) to center the pattern on
 * @param {number} y - The y coordinate (row) to center the pattern on
 * @returns {boolean} - True if the pattern matches centered at (x, y), false otherwise
 */
export function matchPattern(valueMap, pattern, x, y) {
  // Handle empty inputs
  if (!valueMap || valueMap.length === 0) return false;
  if (!pattern || pattern.length === 0) return false;
  if (!pattern[0] || pattern[0].length === 0) return false;

  const mapHeight = valueMap.length;
  const mapWidth = valueMap[0]?.length || 0;
  const patternHeight = pattern.length;
  const patternWidth = pattern[0].length;

  // Calculate the top-left corner of the pattern when centered at (x, y)
  // For odd-sized patterns: offset = floor(size / 2)
  // For even-sized patterns: offset = floor(size / 2) but we use the cell as top-left of bottom-right quadrant
  const offsetX = Math.floor(patternWidth / 2);
  const offsetY = Math.floor(patternHeight / 2);

  const startX = x - offsetX;
  const startY = y - offsetY;

  // Check if coordinates are out of bounds
  if (x < 0 || y < 0) return false;
  if (x >= mapWidth || y >= mapHeight) return false;

  // Check if pattern would extend beyond map boundaries
  if (startX < 0 || startY < 0) return false;
  if (startX + patternWidth > mapWidth) return false;
  if (startY + patternHeight > mapHeight) return false;

  // Match each cell in the pattern
  for (let py = 0; py < patternHeight; py++) {
    for (let px = 0; px < patternWidth; px++) {
      const mapValue = valueMap[startY + py]?.[startX + px]?.value;
      const patternValue = pattern[py][px];

      if (mapValue !== patternValue) {
        return false;
      }
    }
  }

  return true;
}
