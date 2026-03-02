import { LINE_TILE_SHAPES } from "./lineTileTileConstants.js";

/**
 * Determines the shape of a line tile based on its cardinal neighbors.
 * @param {Array} lineTileValueMap - 2D array of {value} cells
 * @param {number} x - Column index
 * @param {number} y - Row index
 * @returns {string} Shape constant from LINE_TILE_SHAPES
 */
export function getLineTileShape(lineTileValueMap, x, y) {
  const height = lineTileValueMap.length;
  const width = lineTileValueMap[0]?.length || 0;

  const top = y > 0 && lineTileValueMap[y - 1][x].value === 1;
  const bottom = y < height - 1 && lineTileValueMap[y + 1][x].value === 1;
  const left = x > 0 && lineTileValueMap[y][x - 1].value === 1;
  const right = x < width - 1 && lineTileValueMap[y][x + 1].value === 1;

  const count = top + bottom + left + right;

  if (count === 0) return LINE_TILE_SHAPES.HORIZONTAL;

  if (count === 1) {
    if (top) return LINE_TILE_SHAPES.END_TOP;
    if (bottom) return LINE_TILE_SHAPES.END_BOTTOM;
    if (left) return LINE_TILE_SHAPES.END_LEFT;
    return LINE_TILE_SHAPES.END_RIGHT;
  }

  if (count === 2) {
    if (left && right) return LINE_TILE_SHAPES.HORIZONTAL;
    if (top && bottom) return LINE_TILE_SHAPES.VERTICAL;
    if (left && top) return LINE_TILE_SHAPES.CORNER_LEFT_TOP;
    if (left && bottom) return LINE_TILE_SHAPES.CORNER_LEFT_BOTTOM;
    if (right && top) return LINE_TILE_SHAPES.CORNER_RIGHT_TOP;
    return LINE_TILE_SHAPES.CORNER_RIGHT_BOTTOM;
  }

  if (count === 3) {
    if (!bottom) return LINE_TILE_SHAPES.T_TOP;
    if (!top) return LINE_TILE_SHAPES.T_BOTTOM;
    if (!right) return LINE_TILE_SHAPES.T_LEFT;
    return LINE_TILE_SHAPES.T_RIGHT;
  }

  return LINE_TILE_SHAPES.MIDDLE;
}
