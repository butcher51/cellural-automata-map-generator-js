import { MAP_SIZE } from "./constants.js";

/**
 * Renders the manual tile map on top of all layers.
 * Only draws non-null cells.
 * @param {Array} manualTileMap - 2D array from createManualTileMap
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} scaledSize - boxSize * zoom
 * @param {object} cameraOffset - { x, y }
 * @param {Array} tilesetImages - Array of loaded tileset Image objects
 */
export function renderManualTileMap(manualTileMap, ctx, scaledSize, cameraOffset, tilesetImages) {
  if (!manualTileMap) return;

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const cell = manualTileMap[y][x];
      if (cell === null) continue;

      const cellX = x * scaledSize - cameraOffset.x;
      const cellY = y * scaledSize - cameraOffset.y;

      // Viewport culling
      if (cellX + scaledSize < 0 || cellX > ctx.canvas.width || cellY + scaledSize < 0 || cellY > ctx.canvas.height) {
        continue;
      }

      const { spriteX, spriteY, tilesetIndex } = cell.spritePosition;
      if (tilesetImages[tilesetIndex]) {
        ctx.drawImage(
          tilesetImages[tilesetIndex],
          spriteX,
          spriteY,
          8,
          8,
          cellX,
          cellY,
          scaledSize,
          scaledSize,
        );
      }
    }
  }
}
