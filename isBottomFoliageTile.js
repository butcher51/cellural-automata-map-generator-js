export function createBottomTileCheckers(tilesConfig) {
  const allBottomRight = new Set(Object.values(tilesConfig).map(t => t.bottomRight));
  const allBottomLeft = new Set(Object.values(tilesConfig).map(t => t.bottomLeft));

  return {
    isBottomRight(tile) {
      return allBottomRight.has(tile);
    },
    isBottomLeft(tile) {
      return allBottomLeft.has(tile);
    },
  };
}
