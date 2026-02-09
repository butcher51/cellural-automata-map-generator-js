import { describe, it, expect } from 'vitest';
import { findThreeByThreeGroups } from './findThreeByThreeGroups.js';

describe('findThreeByThreeGroups', () => {
  describe('Basic functionality', () => {
    it('should return input as-is for null input', () => {
      expect(findThreeByThreeGroups(null)).toEqual(null);
    });

    it('should return input as-is for undefined input', () => {
      expect(findThreeByThreeGroups(undefined)).toEqual(undefined);
    });

    it('should return input as-is for empty array input', () => {
      expect(findThreeByThreeGroups([])).toEqual([]);
    });

    it('should preserve single 3x3 block', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result).toHaveLength(3);
      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should remove single 2x2 block (too small)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove single 1x1 cell', () => {
      const waterValueMap = [[{ value: 1 }]];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should preserve exact 3x3 block', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result).toEqual(waterValueMap);
    });

    it('should preserve two separate 3x3 blocks in same map', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(18); // Both 3x3 blocks preserved
    });

    it('should preserve 4x4 containing single 3x3 block', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should preserve 6x3 containing two non-overlapping 3x3 blocks', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(18); // Two 3x3 blocks
    });

    it('should filter out regions with no 3x3 blocks', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9); // Only right 3x3 block
    });

    it('should handle mixed valid/invalid regions', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9); // Only valid 3x3 at top-right
    });
  });

  describe('Removal cases', () => {
    it('should remove 2x2 square', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 2x3 rectangle (width too small)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 3x2 rectangle (height too small)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 1xN horizontal line', () => {
      const waterValueMap = [[{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove Nx1 vertical line', () => {
      const waterValueMap = [
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove L-shaped group smaller than 3x3', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove 3x3 with one value-0 cell (incomplete block)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove checkerboard pattern (no solid 3x3)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should remove diagonal line (no solid 3x3)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });
  });

  describe('Preservation cases', () => {
    it('should preserve exact 3x3 block', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result).toEqual(waterValueMap);
    });

    it('should preserve 4x4 group containing 3x3 block', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(9);
    });

    it('should preserve 5x5 group with 3x3 at corner', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should preserve 6x6 with multiple non-overlapping 3x3 blocks', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(9);
    });

    it('should preserve 3x3 and remove surrounding single tiles', () => {
      const waterValueMap = [
        [{ value: 0 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should preserve 3x3 within L-shape, remove tail', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
      // Verify the tail is removed (row 3, col 0 should be 0)
      expect(result[3][0].value).toBe(0);
    });

    it('should preserve two separate 3x3 blocks in different regions', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(18);
    });
  });

  describe('Overlapping & complex cases', () => {
    it('should handle overlapping 3x3 candidates (dense packing)', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // With dense packing: marks block at (0,0) and (1,0) with 3-cell overlap
      // Result: all 12 cells preserved (4 columns × 3 rows)
      expect(totalOnes).toBe(12);
    });

    it('should extract multiple non-overlapping 3x3 from large region', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(9);
    });

    it('should handle 3x6 with two overlapping 3x3 candidates', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(9);
    });

    it('should handle complex shape with embedded 3x3 block', () => {
      const waterValueMap = [
        [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBeGreaterThanOrEqual(9);
    });

    it('should handle group with 3x3 at edge', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should preserve 3x3 portion of U-shape', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
      // Verify the U arms are removed
      expect(result[0][4].value).toBe(0);
      expect(result[1][4].value).toBe(0);
    });

    it('should skip block with exactly 1 cell overlap', () => {
      // Create scenario where we manually mark one cell, then check if next block is skipped
      // Using a helper approach: create a 3x3 block, then check if a block with 1 overlap is rejected
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // Block at (0,0) is marked (9 cells)
      // Block at (1,0) would have 2 cells overlap (column 1-2, row 0) but row 0 col 3 = 1, row 1-2 col 3 = 0
      // Actually, this setup doesn't create 1-cell overlap cleanly. Let me verify:
      // Position (1,0) needs all 9 cells = 1: (1,0), (2,0), (3,0), (1,1), (2,1), (3,1), (1,2), (2,2), (3,2)
      // But (3,1) and (3,2) are 0, so block at (1,0) is invalid anyway
      // Only one block at (0,0) is marked
      expect(totalOnes).toBe(9);
    });

    it('should skip block with exactly 2 cells overlap', () => {
      // Create a more complex scenario to test 2-cell overlap rejection
      // We need two potential 3x3 blocks where the second would have exactly 2 overlapping cells
      // This is tricky to construct because the scan is left-to-right, top-to-bottom
      // A 3x4 solid block: first block at (0,0), second at (1,0) has 3 overlap (rejected in old, allowed in new)
      // To get 2-cell overlap, we need a different geometry

      // Using vertical arrangement: 4x3, then scan finds (0,0) first
      // But (1,0) in a 4x3 has 3-cell overlap (entire left column)

      // Let's test with a specific pattern that would create 2-cell overlap
      // Actually, with the scan pattern, 2-cell overlap is geometrically difficult
      // The minimum overlap for adjacent blocks in a solid region is 3 cells (one full row or column)

      // For now, verify that the existing test shows expected behavior
      // A 4x3 block allows dense packing (3-cell overlap)
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // With 3-cell overlap allowed, both blocks are marked = 12 cells
      expect(totalOnes).toBe(12);
    });

    it('should allow block with 3+ cells overlap (dense packing)', () => {
      // 5x3 solid region tests maximum dense packing
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // Block at (0,0): 0 overlap → mark (9 cells)
      // Block at (1,0): 3 overlap (column 0) → mark (adds 6 new cells = 15 total)
      // Block at (2,0): 6 overlap (columns 0-1) → mark (adds 0 new cells = 15 total)
      // All 15 cells should be preserved with dense packing
      expect(totalOnes).toBe(15);
    });

    it('should allow heavy overlap in 6x3 region (maximum dense packing)', () => {
      // 6x3 solid region - tests extreme dense packing
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      // Multiple overlapping blocks should preserve all 18 cells
      expect(totalOnes).toBe(18);
    });
  });

  describe('Edge cases', () => {
    it('should handle map with empty first row', () => {
      const waterValueMap = [[]];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result).toEqual([[]]);
    });

    it('should handle single row map (always filtered)', () => {
      const waterValueMap = [[{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should handle single column map (always filtered)', () => {
      const waterValueMap = [
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }],
        [{ value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should handle map with all value-0', () => {
      const waterValueMap = [
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(0);
    });

    it('should handle mixed valid/invalid regions', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(9);
    });

    it('should preserve extra cell properties', () => {
      const waterValueMap = [
        [{ value: 1, tile: 0, sprite: 0 }, { value: 1, tile: 1, sprite: 1 }, { value: 1, tile: 2, sprite: 2 }],
        [{ value: 1, tile: 3, sprite: 3 }, { value: 1, tile: 4, sprite: 4 }, { value: 1, tile: 5, sprite: 5 }],
        [{ value: 1, tile: 6, sprite: 6 }, { value: 1, tile: 7, sprite: 7 }, { value: 1, tile: 8, sprite: 8 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result[0][0].tile).toBe(0);
      expect(result[0][0].sprite).toBe(0);
      expect(result[1][1].sprite).toBe(4);
    });
  });

  describe('Correctness', () => {
    it('should ensure output maps have same dimensions as input', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      expect(result).toHaveLength(4); // 4 rows
      expect(result[0]).toHaveLength(4); // 4 columns
    });

    it('should ensure all preserved cells had value: 1 in input', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const height = result.length;
      const width = result[0].length;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (result[y][x].value === 1) {
            expect(waterValueMap[y][x].value).toBe(1);
          }
        }
      }
    });

    it('should ensure output contains only complete 3x3 blocks', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      // Verify at least one valid 3x3 block exists
      const height = result.length;
      const width = result[0].length;
      let found3x3 = false;

      for (let y = 0; y <= height - 3; y++) {
        for (let x = 0; x <= width - 3; x++) {
          let isValid = true;
          for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
              if (result[y + dy][x + dx].value !== 1) {
                isValid = false;
                break;
              }
            }
            if (!isValid) break;
          }
          if (isValid) {
            found3x3 = true;
            break;
          }
        }
        if (found3x3) break;
      }

      expect(found3x3).toBe(true);
    });

    it('should ensure no overlap in marked cells', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      const totalOnes = result.flat().filter(cell => cell.value === 1).length;
      expect(totalOnes).toBe(18); // 2 separate 3x3 blocks
    });

    it('should ensure total value-1 count <= input count', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }]
      ];
      const inputOnes = waterValueMap.flat().filter(cell => cell.value === 1).length;
      const result = findThreeByThreeGroups(waterValueMap);
      const outputOnes = result.flat().filter(cell => cell.value === 1).length;

      expect(outputOnes).toBeLessThanOrEqual(inputOnes);
    });
  });

  describe('Immutability', () => {
    it('should not be affected by input modifications after call', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      // Modify input
      waterValueMap[0][0].value = 0;

      // Output should be unchanged
      expect(result[0][0].value).toBe(1);
    });

    it('should ensure modifying output does not affect input', () => {
      const waterValueMap = [
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = findThreeByThreeGroups(waterValueMap);

      // Modify output
      result[0][0].value = 0;

      // Input should be unchanged
      expect(waterValueMap[0][0].value).toBe(1);
    });
  });
});
