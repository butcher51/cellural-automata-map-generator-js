


export function getTileSpritePosition(tileIndex) {
  const tilesPerRow = 24;

  tileIndex--;
  const row = Math.floor(tileIndex / tilesPerRow);
  const col = tileIndex % tilesPerRow;

  return {
    spriteX: col * 8,
    spriteY: row * 8,
  };
}