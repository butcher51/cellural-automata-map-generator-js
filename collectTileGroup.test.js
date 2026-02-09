import { describe, it, expect } from 'vitest';
import { collectTileGroup } from './collectTileGroup.js';

describe('collectTileGroup', () => {
  describe('Basic functionality', () => {
    it('should return empty array for null input', () => {
      expect(collectTileGroup(null)).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      expect(collectTileGroup(undefined)).toEqual([]);
    });

    it('should return empty array for empty array input', () => {
      expect(collectTileGroup([])).toEqual([]);
    });

    it('should return 1 group for single value-1 tile', () => {
      const tileMap = [[{ value: 1 }]];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([[{ value: 1 }]]);
    });

    it('should return 2 groups for two disconnected tiles', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);
      // Each group should have one value-1 tile
      const totalOnes = result.reduce((sum, group) => {
        return sum + group.flat().filter(cell => cell.value === 1).length;
      }, 0);
      expect(totalOnes).toBe(2);
    });

    it('should return 1 group for horizontal line', () => {
      const tileMap = [[{ value: 1 }, { value: 1 }, { value: 1 }]];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([[{ value: 1 }, { value: 1 }, { value: 1 }]]);
    });

    it('should return 1 group for vertical line', () => {
      const tileMap = [
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ]);
    });

    it('should return 1 group for L-shape', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      const totalOnes = result[0].flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(4);
    });

    it('should return 2 groups for two 2x2 squares', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);
      result.forEach(group => {
        const ones = group.flat().filter(cell => cell.value === 1).length;
        expect(ones).toBe(4);
      });
    });

    it('should match JSDoc example (L-shape + 2x2 square)', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);

      // Check total value-1 count
      const totalOnes = result.reduce((sum, group) => {
        return sum + group.flat().filter(cell => cell.value === 1).length;
      }, 0);
      expect(totalOnes).toBe(9);
    });

    it('should return 1 group for full map of value-1', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(tileMap);
    });

    it('should return empty array for full map of value-0', () => {
      const tileMap = [
        [{ value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should return empty array for array with no columns', () => {
      const tileMap = [[]];
      expect(collectTileGroup(tileMap)).toEqual([]);
    });

    it('should work correctly for single row map', () => {
      const tileMap = [[{ value: 1 }, { value: 0 }, { value: 1 }]];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);
    });

    it('should work correctly for single column map', () => {
      const tileMap = [
        [{ value: 1 }],
        [{ value: 0 }],
        [{ value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);
    });

    it('should create 2 groups for diagonal-only connection', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);
    });

    it('should return 1 group for complex spiral shape', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      const totalOnes = result[0].flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(7);
    });

    it('should preserve extra properties in cells', () => {
      const tileMap = [
        [{ value: 1, tile: 'grass', spritePosition: 0 }],
        [{ value: 1, tile: 'grass', spritePosition: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      expect(result[0][0][0]).toEqual({ value: 1, tile: 'grass', spritePosition: 0 });
      expect(result[0][1][0]).toEqual({ value: 1, tile: 'grass', spritePosition: 1 });
    });

    it('should handle boundary cells correctly', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(1);
      const totalOnes = result[0].flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(8);
    });

    it('should handle mixed regions of different sizes', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 0 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(4);
    });
  });

  describe('Correctness', () => {
    it('should ensure each group map shows only that group', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      // Each group should have exactly 1 value-1 tile
      result.forEach(group => {
        const ones = group.flat().filter(cell => cell.value === 1).length;
        expect(ones).toBe(1);
      });
    });

    it('should ensure total value-1 count across groups equals input', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }]
      ];

      const inputOnes = tileMap.flat().filter(cell => cell.value === 1).length;
      const result = collectTileGroup(tileMap);
      const outputOnes = result.reduce((sum, group) => {
        return sum + group.flat().filter(cell => cell.value === 1).length;
      }, 0);

      expect(outputOnes).toBe(inputOnes);
    });

    it('should ensure output maps have same dimensions as input', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = collectTileGroup(tileMap);

      result.forEach(group => {
        expect(group).toHaveLength(2); // 2 rows
        expect(group[0]).toHaveLength(3); // 3 columns
      });
    });

    it('should ensure no tiles appear in multiple groups', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      // Count value-1 tiles at each position across all groups
      const height = tileMap.length;
      const width = tileMap[0].length;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const countInGroups = result.filter(group => group[y][x].value === 1).length;
          if (tileMap[y][x].value === 1) {
            expect(countInGroups).toBe(1); // Should appear in exactly 1 group
          } else {
            expect(countInGroups).toBe(0); // Should not appear in any group
          }
        }
      }
    });
  });

  describe('Immutability', () => {
    it('should not share references with input', () => {
      const tileMap = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      // Modify input
      tileMap[0][0].value = 0;

      // Output should be unchanged
      expect(result[0][0][0].value).toBe(1);
    });

    it('should not be affected by input modifications after call', () => {
      const tileMap = [
        [{ value: 1, extra: 'data' }],
        [{ value: 1, extra: 'data' }]
      ];
      const result = collectTileGroup(tileMap);

      // Modify input
      tileMap[0][0].extra = 'modified';

      // Output should retain original value
      expect(result[0][0][0].extra).toBe('data');
    });

    it('should ensure modifying one group map does not affect others', () => {
      const tileMap = [
        [{ value: 1 }, { value: 0 }, { value: 1 }]
      ];
      const result = collectTileGroup(tileMap);

      expect(result).toHaveLength(2);

      // Modify first group
      result[0][0][0].value = 0;

      // Second group should be unchanged
      expect(result[1][0][2].value).toBe(1);
    });
  });
});
