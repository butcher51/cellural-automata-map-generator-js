import { generateCliffTileMap } from "./generateCliffTileMap.js";
import { GROUND_TILES } from "./constants.js";

// Check if a tile index is a ground tile (interior)
function isGroundTile(tileIndex) {
  return GROUND_TILES.some((tile) => tile.index === tileIndex);
}

// Identifies cliff cells where upper layer ground should be placed
// Returns array of {x, y} positions for cliff interior cells
// Interior cells are those that render as ground tiles (not border/wall tiles)
export function getCliffInteriorCells(cliffValueMap) {
  const interiorCells = [];

  // Generate tile map - this contains the tile assignments for all cells
  const tileMap = generateCliffTileMap(cliffValueMap, {});

  for (let y = 0; y < cliffValueMap.length; y++) {
    for (let x = 0; x < cliffValueMap[0].length; x++) {
      const cell = cliffValueMap[y][x];

      // Must be a cliff cell
      if (cell.value !== 1) {
        continue;
      }

      // Check if this cliff cell renders as a ground tile
      const tileIndex = tileMap[y][x]?.tileIndex;
      if (isGroundTile(tileIndex)) {
        interiorCells.push({ x, y });
      }
    }
  }

  return interiorCells;
}
