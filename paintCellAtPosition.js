import { BOX_SIZE, MAP_SIZE } from "./constants.js";
import {
  getCellsInBrushArea,
  pixelToGridCoordinate,
  setCellValue,
} from "./map-utils.js";

export function paintCellAtPosition({
  canvas,
  currentTool,
  event,
  drawMap,
  treeValueMap,
  waterValueMap,
  camera,
  zoom,
  paintedCellsInStroke,
}) {
  // Get click coordinates relative to canvas
  const rect = canvas.getBoundingClientRect();
  const pixelX = event.clientX - rect.left;
  const pixelY = event.clientY - rect.top;

  // Convert screen pixel to world pixel (add camera offset)
  const worldPixelX = pixelX + camera.x;
  const worldPixelY = pixelY + camera.y;

  // Convert to grid coordinates (center of brush) using scaled box size
  const { x, y } = pixelToGridCoordinate(
    worldPixelX,
    worldPixelY,
    BOX_SIZE * zoom,
  );

  // Validate center cell bounds
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
    return;
  }

  // Get all cells in 2x2 brush area
  const brushSize = 2;
  const cellsToPaint = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);

  // Paint each cell (avoid redundant sets within a single stroke)
  for (const cell of cellsToPaint) {
    const cellKey = `${cell.x},${cell.y}`;
    if (!paintedCellsInStroke.has(cellKey)) {
      drawMap[cell.y][cell.x] = true;
      if (currentTool === "tree") {
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 0);
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
      } else if (currentTool === "water") {
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 1);
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1);
      } else if (currentTool === "eraser") {
        treeValueMap = setCellValue(treeValueMap, cell.x, cell.y, 1);
        waterValueMap = setCellValue(waterValueMap, cell.x, cell.y, 0);
      }
      paintedCellsInStroke.add(cellKey);
    }
  }
}
