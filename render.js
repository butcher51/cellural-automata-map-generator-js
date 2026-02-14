import { MAP_SIZE } from "./constants.js";
import { sortLayersByOrder } from "./layer.js";

// Render the map with layers composited bottom-to-top
export function render(layers, drawMap, ctx, boxSize, numberSprite, tileMapSprite, cameraOffset, zoom, cursorPreviewCells) {
  const scaledSize = boxSize * zoom;
  const sortedLayers = sortLayersByOrder(layers);

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const cellX = x * scaledSize - cameraOffset.x;
      const cellY = y * scaledSize - cameraOffset.y;

      // Skip cells outside viewport for performance
      if (cellX + scaledSize < 0 || cellX > ctx.canvas.width || cellY + scaledSize < 0 || cellY > ctx.canvas.height) {
        continue;
      }

      let spriteX = null;
      let spriteY = null;

      for (let i = 0; i < sortedLayers.length; i++) {
        const layer = sortedLayers[i];
        const isBottomLayer = i === 0;

        // Compute this layer's sprite
        let layerSpriteX = null;
        let layerSpriteY = null;

        if (layer.groundTileMap && layer.groundTileMap[y][x]) {
          layerSpriteX = layer.groundTileMap[y][x].spritePosition.spriteX;
          layerSpriteY = layer.groundTileMap[y][x].spritePosition.spriteY;
        }

        // Check for tree/water/cliff overrides
        let hasOverride = false;

        const treeTile = layer.treeTileMap?.[y]?.[x];
        if (treeTile && treeTile.tile !== 0) {
          layerSpriteX = treeTile.spritePosition.spriteX;
          layerSpriteY = treeTile.spritePosition.spriteY;
          hasOverride = true;
        }

        const waterTile = layer.waterTileMap?.[y]?.[x];
        if (waterTile && waterTile.tile !== 0) {
          layerSpriteX = waterTile.spritePosition.spriteX;
          layerSpriteY = waterTile.spritePosition.spriteY;
          hasOverride = true;
        }

        const cliffTile = layer.cliffTileMap?.[y]?.[x];
        if (cliffTile && cliffTile.tileIndex) {
          layerSpriteX = cliffTile.spritePosition.spriteX;
          layerSpriteY = cliffTile.spritePosition.spriteY;
          hasOverride = true;
        }

        // Bottom layer: always apply its sprite
        // Higher layers: only render cells where they have ground
        if (isBottomLayer) {
          if (layerSpriteX !== null) {
            spriteX = layerSpriteX;
            spriteY = layerSpriteY;
          }
        } else {
          const hasGround = layer.groundTileMap && layer.groundTileMap[y][x] != null;
          if (hasGround && layerSpriteX !== null) {
            spriteX = layerSpriteX;
            spriteY = layerSpriteY;
          }
        }
      }

      // Draw final composited sprite
      if (spriteX !== null) {
        ctx.drawImage(
          tileMapSprite,
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

      if (drawMap[y][x]) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
      }
    }
  }

  // Render cursor preview (30% transparent yellow overlay)
  if (cursorPreviewCells && cursorPreviewCells.length > 0) {
    ctx.fillStyle = "rgba(255, 255, 100, 0.3)"; // Yellow with 30% opacity
    for (const cell of cursorPreviewCells) {
      const cellX = cell.x * scaledSize - cameraOffset.x;
      const cellY = cell.y * scaledSize - cameraOffset.y;

      // Only render if in viewport
      if (cellX + scaledSize >= 0 && cellX <= ctx.canvas.width && cellY + scaledSize >= 0 && cellY <= ctx.canvas.height) {
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
      }
    }
  }
}
