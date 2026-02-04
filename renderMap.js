import { MAP_SIZE } from "./constants.js";

// Render the map with colors based on cell objects and sprite numbers
export function renderMap(valueMap, treeTileMap, groundTileMap, waterTileMap, drawMap, ctx, boxSize, numberSprite, tileMapSprite, cameraOffset, zoom) {
  const scaledSize = boxSize * zoom;

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const cell = valueMap[y][x];
      const cellX = x * scaledSize - cameraOffset.x;
      const cellY = y * scaledSize - cameraOffset.y;

      // Skip cells outside viewport for performance
      if (cellX + scaledSize < 0 || cellX > ctx.canvas.width || cellY + scaledSize < 0 || cellY > ctx.canvas.height) {
        continue;
      }

      if (groundTileMap[y][x]) {
        const tile = groundTileMap[y][x];
        let { spriteX, spriteY } = tile.spritePosition;

        const treeTile = treeTileMap[y][x];
        if (treeTile && treeTile.tile !== 0) {
          spriteX = treeTile.spritePosition.spriteX;
          spriteY = treeTile.spritePosition.spriteY;
        }

        const waterTile = waterTileMap[y][x];
        if (waterTile && waterTile.tile !== 0) {
          spriteX = waterTile.spritePosition.spriteX;
          spriteY = waterTile.spritePosition.spriteY;
        }

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

      if (drawMap[y][x]) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
      }
    }
  }
}
