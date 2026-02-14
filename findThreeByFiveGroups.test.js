import { describe, it, expect } from 'vitest';
import { findThreeByFiveGroups } from './findThreeByFiveGroups.js';

describe('findThreeByFiveGroups', () => {
  describe('Basic functionality', () => {
    it('should return input as-is for null input', () => {
      expect(findThreeByFiveGroups(null)).toEqual(null);
    });

    it('should return input as-is for undefined input', () => {
      expect(findThreeByFiveGroups(undefined)).toEqual(undefined);
    });

    it('should return input as-is for empty array input', () => {
      expect(findThreeByFiveGroups([])).toEqual([]);
    });

    it('should preserve single 3x5 block', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(15);
    });

    it('should remove single 3x3 block (too short)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove single 2x5 block (too narrow)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove single 3x4 block (too short)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove single 1x1 cell', () => {
      const map = [[{ value: 1 }]];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });
  });

  describe('Removal cases', () => {
    it('should remove 2x2 square', () => {
      const map = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 1xN horizontal line', () => {
      const map = [[{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove Nx1 vertical line', () => {
      const map = [
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 3x5 with one value-0 cell (incomplete block)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove checkerboard pattern (no solid 3x5)', () => {
      const map = [
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });
  });

  describe('Preservation cases', () => {
    it('should preserve exact 3x5 block', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      expect(result).toEqual(map);
    });

    it('should preserve 4x5 group containing 3x5 block', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(15);
    });

    it('should preserve 3x6 group containing 3x5 block', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(15);
    });

    it('should preserve two separate 3x5 blocks in same map', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(30); // Both 3x5 blocks preserved
    });

    it('should preserve 3x5 and remove surrounding single tiles', () => {
      const map = [
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(15);
    });

    it('should preserve 3x5 within L-shape, remove tail', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(15);
      // Verify the tail is removed
      expect(result[5][0].value).toBe(0);
    });
  });

  describe('Overlapping & complex cases', () => {
    it('should handle overlapping 3x5 candidates horizontally (dense packing)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // With dense packing: blocks at (0,0) and (1,0) overlap heavily
      expect(totalOnes).toBe(20);
    });

    it('should handle overlapping 3x5 candidates vertically', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(15);
    });

    it('should handle mixed valid/invalid regions', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(15); // Only the right 3x5 block
    });
  });

  describe('Edge cases', () => {
    it('should handle map with empty first row', () => {
      const map = [[]];
      const result = findThreeByFiveGroups(map);
      expect(result).toEqual([[]]);
    });

    it('should handle single row map (always filtered)', () => {
      const map = [[{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should handle single column map (always filtered)', () => {
      const map = [
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should handle map with all value-0', () => {
      const map = [
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByFiveGroups(map);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should preserve extra cell properties', () => {
      const map = [
        [{ value: 1, tile: 0 }, { value: 1, tile: 1 }, { value: 1, tile: 2 }],
        [{ value: 1, tile: 3 }, { value: 1, tile: 4 }, { value: 1, tile: 5 }],
        [{ value: 1, tile: 6 }, { value: 1, tile: 7 }, { value: 1, tile: 8 }],
        [{ value: 1, tile: 9 }, { value: 1, tile: 10 }, { value: 1, tile: 11 }],
        [{ value: 1, tile: 12 }, { value: 1, tile: 13 }, { value: 1, tile: 14 }]
      ];
      const result = findThreeByFiveGroups(map);
      expect(result[0][0].tile).toBe(0);
      expect(result[2][1].tile).toBe(7);
      expect(result[4][2].tile).toBe(14);
    });
  });

  describe('Correctness', () => {
    it('should ensure output maps have same dimensions as input', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByFiveGroups(map);
      expect(result).toHaveLength(6);
      expect(result[0]).toHaveLength(4);
    });

    it('should ensure all preserved cells had value: 1 in input', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByFiveGroups(map);

      for (let y = 0; y < result.length; y++) {
        for (let x = 0; x < result[0].length; x++) {
          if (result[y][x].value === 1) {
            expect(map[y][x].value).toBe(1);
          }
        }
      }
    });

    it('should ensure total value-1 count <= input count', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const inputOnes = map.flat().filter(cell => cell.value === 1).length;
      const result = findThreeByFiveGroups(map);
      const outputOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(outputOnes).toBeLessThanOrEqual(inputOnes);
    });
  });

  describe('Immutability', () => {
    it('should not be affected by input modifications after call', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      map[0][0].value = 0;
      expect(result[0][0].value).toBe(1);
    });

    it('should ensure modifying output does not affect input', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByFiveGroups(map);
      result[0][0].value = 0;
      expect(map[0][0].value).toBe(1);
    });
  });
});
