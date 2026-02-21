import { SEED } from "./constants.js";
import { createRandom } from "./seed.js";

/**
 * Calculate Euclidean distance between two points
 */
function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Generate random seed points with rejection sampling to ensure minimum spacing
 */
function generateSeedPoints(count, size, minDistance, random) {
  const points = [];
  const maxAttempts = 100; // Prevent infinite loops

  for (let i = 0; i < count; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const x = Math.floor(random() * size);
      const y = Math.floor(random() * size);

      // Check if this point is far enough from existing points
      let tooClose = false;
      for (const point of points) {
        if (distanceBetweenPoints(x, y, point.x, point.y) < minDistance) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        points.push({ x, y });
        placed = true;
      }

      attempts++;
    }

    // If we couldn't place a point with proper spacing, place it anyway
    if (!placed && points.length < count) {
      const x = Math.floor(random() * size);
      const y = Math.floor(random() * size);
      points.push({ x, y });
    }
  }

  return points;
}

/**
 * Get neighboring cells that are within bounds and not yet filled
 */
function getUnfilledNeighbors(map, x, y) {
  const neighbors = [];
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],  // 4-way (cardinal)
    [-1, -1], [-1, 1], [1, -1], [1, 1] // 8-way (diagonal)
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (ny >= 0 && ny < map.length &&
        nx >= 0 && nx < map[0].length &&
        map[ny][nx].value === 0) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}

/**
 * Fill an irregular blob using probabilistic flood-fill
 * Creates natural-looking, amorphous lake shapes
 * @param {Array} map - 2D map array
 * @param {number} centerX - Seed X coordinate
 * @param {number} centerY - Seed Y coordinate
 * @param {number} radius - Controls target size (πr² approximate cells)
 * @param {Function} random - Seeded random function
 */
function fillIrregularBlob(map, centerX, centerY, radius, random) {
  // Calculate target size from radius (approximate circle area)
  const targetSize = Math.floor(Math.PI * radius * radius);

  // Start with seed cell
  map[centerY][centerX].value = 1;
  let filledCount = 1;

  // Track active edge cells (cells that can expand)
  let edgeCells = [{ x: centerX, y: centerY, distance: 0 }];

  // Growth parameters
  const baseExpansionProb = 0.7; // Base chance to expand
  const distanceFalloff = 0.05; // Reduces expansion chance per unit distance

  // Grow until we reach target size or run out of edges
  while (filledCount < targetSize && edgeCells.length > 0) {
    // Randomly select an edge cell
    const edgeIndex = Math.floor(random() * edgeCells.length);
    const current = edgeCells[edgeIndex];

    // Get unfilled neighbors
    const neighbors = getUnfilledNeighbors(map, current.x, current.y);

    if (neighbors.length === 0) {
      // No more neighbors, remove from edge list
      edgeCells.splice(edgeIndex, 1);
      continue;
    }

    // Try to expand to a random neighbor
    const neighbor = neighbors[Math.floor(random() * neighbors.length)];
    const distance = distanceBetweenPoints(neighbor.x, neighbor.y, centerX, centerY);

    // Probability decreases with distance from seed
    const expansionProb = baseExpansionProb - (distance * distanceFalloff);

    if (random() < expansionProb) {
      // Fill this neighbor
      map[neighbor.y][neighbor.x].value = 1;
      filledCount++;

      // Add to edge cells
      edgeCells.push({ x: neighbor.x, y: neighbor.y, distance });
    }

    // Small chance to remove current from edge even if expansion failed
    if (random() < 0.2) {
      edgeCells.splice(edgeIndex, 1);
    }
  }
}

/**
 * Generate a lake noise map using clustered seeding
 * @param {number} size - Map dimensions (size x size)
 * @param {number} lakeCount - Number of lake clusters to generate
 * @param {number} clusterRadius - Radius of each circular cluster
 * @param {number} seedOffset - Seed offset for RNG
 * @returns {Array<Array<{value: 0|1}>>} 2D map array
 */
export function generateClusteredLakeNoiseMap(size, lakeCount, clusterRadius, seedOffset) {
  // Initialize map with all zeros
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { value: 0 };
    }
  }

  // Handle edge case: no lakes
  if (lakeCount === 0) {
    return map;
  }

  // Create seeded random
  const random = createRandom(SEED + seedOffset);

  // Generate seed points with minimum spacing
  const minDistance = size / (lakeCount + 1);
  const seedPoints = generateSeedPoints(lakeCount, size, minDistance, random);

  // Fill irregular blobs around each seed point
  for (const point of seedPoints) {
    fillIrregularBlob(map, point.x, point.y, clusterRadius, random);
  }

  return map;
}
