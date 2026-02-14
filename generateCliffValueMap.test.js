import { describe, it, expect, vi } from 'vitest';
import { generateCliffValueMap } from './generateCliffValueMap.js';

vi.mock('./constants.js', () => ({
  MAP_SIZE: 10,
}));

describe('generateCliffValueMap', () => {
  it('should create a map with correct dimensions', () => {
    const map = generateCliffValueMap();
    expect(map).toHaveLength(10);
    expect(map[0]).toHaveLength(10);
  });

  it('should initialize all cells with tile: 0 and value: 0', () => {
    const map = generateCliffValueMap();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(map[y][x]).toEqual({ tile: 0, value: 0 });
      }
    }
  });

  it('should create independent cell objects', () => {
    const map = generateCliffValueMap();
    map[0][0].value = 1;
    expect(map[0][1].value).toBe(0);
    expect(map[1][0].value).toBe(0);
  });

  it('should create independent row arrays', () => {
    const map = generateCliffValueMap();
    expect(map[0]).not.toBe(map[1]);
  });
});
