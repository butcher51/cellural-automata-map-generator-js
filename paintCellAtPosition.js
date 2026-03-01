import { BOX_SIZE, MAP_SIZE } from "./constants.js";
import { getCellsInBrushArea, getCellsInRectBrushArea, pixelToGridCoordinate, setCellValue } from "./map-utils.js";
import { isTreeTool, getTreeType } from "./treeTileConstants.js";
import { isPineTool, getPineType } from "./pineTileConstants.js";
import { isDeadTreeTool, getDeadTreeType } from "./deadTreeTileConstants.js";

export function paintCellAtPosition({ canvas, currentTool, event, drawMap, treeValueMap, waterValueMap, cliffValueMap, pineValueMap, deadTreeValueMap, lineTileValueMap, camera, zoom, paintedCellsInStroke, groundTileMap }) {
  // Get click coordinates relative to canvas
  const rect = canvas.getBoundingClientRect();
  const pixelX = event.clientX - rect.left;
  const pixelY = event.clientY - rect.top;

  // Convert screen pixel to world pixel (add camera offset)
  const worldPixelX = pixelX + camera.x;
  const worldPixelY = pixelY + camera.y;

  // Convert to grid coordinates (center of brush) using scaled box size
  const { x, y } = pixelToGridCoordinate(worldPixelX, worldPixelY, BOX_SIZE * zoom);

  // Validate center cell bounds
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
    return;
  }

  // Get brush cells based on tool
  let cellsToPaint;
  if (currentTool === "cliff") {
    cellsToPaint = getCellsInRectBrushArea(x, y, 3, 5, MAP_SIZE);
  } else {
    const brushSize = currentTool === "water" ? 3 : 2;
    cellsToPaint = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);
  }

  // Paint each cell (avoid redundant sets within a single stroke)
  for (const cell of cellsToPaint) {
    if (groundTileMap && groundTileMap[cell.y]?.[cell.x] == null) continue;
    const cellKey = `${cell.x},${cell.y}`;
    if (!paintedCellsInStroke.has(cellKey)) {
      drawMap[cell.y][cell.x] = true;
      if (isTreeTool(currentTool)) {
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 0);
        treeValueMap[cell.y][cell.x].treeType = getTreeType(currentTool);
        pineValueMap = setCellValue(pineValueMap, cell.x, cell.y, 1); // Clear pines
        deadTreeValueMap = setCellValue(deadTreeValueMap, cell.x, cell.y, 1); // Clear dead trees
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 0);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      } else if (isPineTool(currentTool)) {
        pineValueMap = setCellValue(pineValueMap, cell.x, cell.y, 0);
        pineValueMap[cell.y][cell.x].pineType = getPineType(currentTool);
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1); // Clear trees
        deadTreeValueMap = setCellValue(deadTreeValueMap, cell.x, cell.y, 1); // Clear dead trees
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 0);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      } else if (isDeadTreeTool(currentTool)) {
        deadTreeValueMap = setCellValue(deadTreeValueMap, cell.x, cell.y, 0);
        deadTreeValueMap[cell.y][cell.x].deadTreeType = getDeadTreeType(currentTool);
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1); // Clear trees
        pineValueMap = setCellValue(pineValueMap, cell.x, cell.y, 1); // Clear pines
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 0);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      } else if (currentTool === "water") {
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 1);
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 0);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      } else if (currentTool === "cliff") {
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 1);
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1);
        pineValueMap = setCellValue(pineValueMap, cell.x, cell.y, 1);
        deadTreeValueMap = setCellValue(deadTreeValueMap, cell.x, cell.y, 1);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      } else if (currentTool === "eraser") {
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1);
        pineValueMap = setCellValue(pineValueMap, cell.x, cell.y, 1);
        deadTreeValueMap = setCellValue(deadTreeValueMap, cell.x, cell.y, 1);
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
        cliffValueMap = setCellValue(cliffValueMap, cell.x, cell.y, 0);
        if (lineTileValueMap) lineTileValueMap = setCellValue(lineTileValueMap, cell.x, cell.y, 0);
      }
      paintedCellsInStroke.add(cellKey);
    }
  }

  return { drawMap, waterValueMap, treeValueMap, cliffValueMap, pineValueMap, deadTreeValueMap, lineTileValueMap };
}
