export function getManualCursorPreviewCells(x, y, selection, mapSize) {
  if (selection && selection.tiles) {
    const h = selection.tiles.length;
    const w = selection.tiles[0].length;
    const cells = [];
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const cx = x + dx, cy = y + dy;
        if (cx >= 0 && cx < mapSize && cy >= 0 && cy < mapSize) {
          cells.push({ x: cx, y: cy });
        }
      }
    }
    return cells;
  }
  return [{ x, y }];
}
