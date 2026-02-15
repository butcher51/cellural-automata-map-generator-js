import { findThreeByFiveGroups } from "./findThreeByFiveGroups.js";

/**
 * Find all connected empty cells (value === 0) starting from (x, y) using flood fill.
 * Returns array of {x, y} coordinates.
 */
function floodFillHole(valueMap, x, y, visited) {
  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;
  const hole = [];
  const stack = [{ x, y }];

  while (stack.length > 0) {
    const { x: cx, y: cy } = stack.pop();

    // Skip if out of bounds
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

    // Skip if already visited
    const key = `${cx},${cy}`;
    if (visited.has(key)) continue;

    // Skip if not empty (not a hole)
    if (valueMap[cy][cx].value !== 0) continue;

    // Mark as visited and add to hole
    visited.add(key);
    hole.push({ x: cx, y: cy });

    // Add 4-connected neighbors to stack
    stack.push({ x: cx + 1, y: cy });
    stack.push({ x: cx - 1, y: cy });
    stack.push({ x: cx, y: cy + 1 });
    stack.push({ x: cx, y: cy - 1 });
  }

  return hole;
}

/**
 * Check if a hole touches the map boundary.
 * Returns true if any cell in the hole is at the edge of the map.
 */
function touchesBoundary(hole, width, height) {
  for (const { x, y } of hole) {
    if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a hole fits within a 3x3 bounding box (exclusive).
 * Returns true if the hole is smaller than 3x3 (should be filled).
 */
function isSmallerThan3x3(hole) {
  if (hole.length === 0) return false;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const { x, y } of hole) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // A hole is "smaller than 3x3" if EITHER dimension is < 3
  // OR it doesn't fill the full 3x3 bounding box (L-shapes, etc.)
  if (width < 3 || height < 3) {
    return true; // Definitely smaller
  }

  // If bounding box is exactly 3x3, check if it's a full 3x3 (9 cells)
  if (width === 3 && height === 3) {
    return hole.length < 9; // If less than 9 cells, it's an L-shape or similar
  }

  return false; // 4x4 or larger bounding box
}

/**
 * Fill small holes (anything smaller than a full 3x3) in cliff regions.
 * Minimum hole size allowed is a complete 3x3 grid.
 */
function fillSmallHoles(valueMap) {
  if (!valueMap || valueMap.length === 0) {
    return valueMap;
  }

  const height = valueMap.length;
  const width = valueMap[0]?.length || 0;

  // Deep copy to avoid mutation
  const filledMap = valueMap.map(row => row.map(cell => ({ ...cell })));

  const visited = new Set();

  // Find all holes and fill those smaller than 3x3 (excluding boundary holes)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      if (filledMap[y][x].value === 0 && !visited.has(key)) {
        const hole = floodFillHole(filledMap, x, y, visited);

        // Only fill holes that are smaller than 3x3 AND don't touch the map boundary
        if (isSmallerThan3x3(hole) && !touchesBoundary(hole, width, height)) {
          // Fill this hole
          for (const { x: hx, y: hy } of hole) {
            filledMap[hy][hx].value = 1;
          }
        }
      }
    }
  }

  return filledMap;
}

export function cleanupCliffArtifacts(cliffValueMap) {
  if (!cliffValueMap || cliffValueMap.length === 0) {
    return cliffValueMap;
  }

  // First, fill small holes
  const filledMap = fillSmallHoles(cliffValueMap);

  // Then filter to valid 3x5 cliff groups
  return findThreeByFiveGroups(filledMap);
}
