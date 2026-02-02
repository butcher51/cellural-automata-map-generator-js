import { getCellColorWithDrawingState } from "./map-utils.js";

// Render the map with colors based on cell objects and sprite numbers
export function renderMap(valueMap, tileMap, ctx, boxSize, numberSprite, tileMapSprite, cameraOffset, zoom) {
  const scaledSize = boxSize * zoom;

  for (let y = 0; y < valueMap.length; y++) {
    for (let x = 0; x < valueMap[y].length; x++) {
      const cell = valueMap[y][x];
      const cellX = x * scaledSize - cameraOffset.x;
      const cellY = y * scaledSize - cameraOffset.y;

      // Skip cells outside viewport for performance
      if (
        cellX + scaledSize < 0 ||
        cellX > ctx.canvas.width ||
        cellY + scaledSize < 0 ||
        cellY > ctx.canvas.height
      ) {
        continue;
      }
      
      if (tileMap[y][x]) {
        const tile = tileMap[y][x];

        if (tile) {
          const { spriteX, spriteY } = tile.spritePosition;

          ctx.drawImage(
            tileMapSprite, // Image source
            spriteX,
            spriteY, // Source x, y (skip 1px border)
            8,
            8, // Source width, height (inner 8x8 content)
            cellX,
            cellY, // Destination x, y (on canvas)
            scaledSize,
            scaledSize, // Destination width, height (8x8 at zoom=1)
          );
        }


        // const sum = tileMap[y][x].sum;
      
        // // Draw friend count number from sprite sheet
        // if (numberSprite) {
        //   const digit = sum;
        //   // Source position in sprite sheet: digit * 10 (each digit is 10px wide)
        //   const spriteX = digit * 10;

        //   ctx.drawImage(
        //     numberSprite, // Image source
        //     spriteX,
        //     0, // Source x, y (skip 1px border)
        //     8,
        //     8, // Source width, height (inner 8x8 content)
        //     cellX,
        //     cellY, // Destination x, y (on canvas)
        //     scaledSize,
        //     scaledSize, // Destination width, height (8x8 at zoom=1)
        //   );
        // }

      
      }

      if (cell.isBeingDrawn) {
      // Draw background (uses drawing state for temporary colors)
        ctx.fillStyle = getCellColorWithDrawingState(cell);
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
      }
      

    }
  }
}
