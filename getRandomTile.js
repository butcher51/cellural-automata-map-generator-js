export function getRandomTile(tiles, random) {
  return tiles.reduce((selected, tile) => {
    if (random() < tile.chance) {
      return tile.index;
    }
    return selected;
  }, 1);
}
