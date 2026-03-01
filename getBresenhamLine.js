/**
 * Bresenham's line algorithm.
 * Returns an array of {x, y} cells forming a line between two points.
 * @param {number} x0 - Start x coordinate
 * @param {number} y0 - Start y coordinate
 * @param {number} x1 - End x coordinate
 * @param {number} y1 - End y coordinate
 * @returns {Array<{x: number, y: number}>} Array of cells along the line
 */
export function getBresenhamLine(x0, y0, x1, y1) {
  const cells = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let x = x0;
  let y = y0;

  while (true) {
    cells.push({ x, y });
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return cells;
}
