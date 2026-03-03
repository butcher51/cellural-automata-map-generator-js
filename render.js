import { MAP_SIZE } from "./constants.js";
import { sortLayersByOrder } from "./layer.js";

// Render the map with layers composited bottom-to-top
// Placeholder colors for lineTile types (brown tones)
const LINE_TILE_COLORS = {
  1: "#8B6914",
  2: "#A0522D",
  3: "#6B4226",
  4: "#CD853F",
  5: "#708090",
  6: "#8B7355",
};

export function render(layers, drawMap, ctx, boxSize, numberSprite, tileMapSprite, cameraOffset, zoom, cursorPreviewCells, lineTilePreviewCells) {
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
      let lineTileType = null;

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

        // Check for lineTile (rendered above ground, below foliage)
        const lineTile = layer.lineTileTileMap?.[y]?.[x];
        if (lineTile && lineTile.tile !== 0) {
          if (lineTile.spritePosition) {
            layerSpriteX = lineTile.spritePosition.spriteX;
            layerSpriteY = lineTile.spritePosition.spriteY;
          }
          lineTileType = lineTile.tile;
        }

        // Check for tree/water/cliff overrides
        let hasOverride = false;

        const treeTile = layer.treeTileMap?.[y]?.[x];
        if (treeTile && treeTile.tile !== 0) {
          layerSpriteX = treeTile.spritePosition.spriteX;
          layerSpriteY = treeTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
        }

        const pineTile = layer.pineTileMap?.[y]?.[x];
        if (pineTile && pineTile.tile !== 0) {
          layerSpriteX = pineTile.spritePosition.spriteX;
          layerSpriteY = pineTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
        }

        const deadTreeTile = layer.deadTreeTileMap?.[y]?.[x];
        if (deadTreeTile && deadTreeTile.tile !== 0) {
          layerSpriteX = deadTreeTile.spritePosition.spriteX;
          layerSpriteY = deadTreeTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
        }

        const waterTile = layer.waterTileMap?.[y]?.[x];
        if (waterTile && waterTile.tile !== 0) {
          layerSpriteX = waterTile.spritePosition.spriteX;
          layerSpriteY = waterTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
        }

        const deepWaterTile = layer.deepWaterTileMap?.[y]?.[x];
        if (deepWaterTile && deepWaterTile.tileIndex) {
          layerSpriteX = deepWaterTile.spritePosition.spriteX;
          layerSpriteY = deepWaterTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
        }

        const cliffTile = layer.cliffTileMap?.[y]?.[x];
        if (cliffTile && cliffTile.tileIndex) {
          layerSpriteX = cliffTile.spritePosition.spriteX;
          layerSpriteY = cliffTile.spritePosition.spriteY;
          hasOverride = true;
          lineTileType = null;
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

      // Draw lineTile fallback (colored rectangle only if no sprite available)
      if (lineTileType !== null && spriteX === null && LINE_TILE_COLORS[lineTileType]) {
        ctx.fillStyle = LINE_TILE_COLORS[lineTileType];
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
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

  // Render lineTile line preview (semi-transparent brown overlay)
  if (lineTilePreviewCells && lineTilePreviewCells.length > 0) {
    ctx.fillStyle = "rgba(139, 105, 20, 0.5)";
    for (const cell of lineTilePreviewCells) {
      const cellX = cell.x * scaledSize - cameraOffset.x;
      const cellY = cell.y * scaledSize - cameraOffset.y;

      if (cellX + scaledSize >= 0 && cellX <= ctx.canvas.width && cellY + scaledSize >= 0 && cellY <= ctx.canvas.height) {
        ctx.fillRect(cellX, cellY, scaledSize, scaledSize);
      }
    }
  }
}
