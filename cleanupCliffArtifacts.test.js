import { describe, it, expect } from 'vitest';
import { cleanupCliffArtifacts } from './cleanupCliffArtifacts.js';

describe('cleanupCliffArtifacts', () => {
  it('should return null for null input', () => {
    expect(cleanupCliffArtifacts(null)).toEqual(null);
  });

  it('should return empty array for empty input', () => {
    expect(cleanupCliffArtifacts([])).toEqual([]);
  });

  it('should preserve valid 3x5 block', () => {
    const map = [
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }]
    ];
    const result = cleanupCliffArtifacts(map);
    const totalOnes = result.flat().filter(cell => cell.value === 1).length;
    expect(totalOnes).toBe(15);
  });

  it('should remove 3x3 block (too short for cliff)', () => {
    const map = [
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }, { value: 1 }]
    ];
    const result = cleanupCliffArtifacts(map);
    const totalOnes = result.flat().filter(cell => cell.value === 1).length;
    expect(totalOnes).toBe(0);
  });

  it('should remove 2x5 block (too narrow)', () => {
    const map = [
      [{ value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }],
      [{ value: 1 }, { value: 1 }]
    ];
    const result = cleanupCliffArtifacts(map);
    const totalOnes = result.flat().filter(cell => cell.value === 1).length;
    expect(totalOnes).toBe(0);
  });

  it('should remove single cells and narrow lines', () => {
    const map = [
      [{ value: 1 }, { value: 0 }],
      [{ value: 1 }, { value: 0 }],
      [{ value: 1 }, { value: 0 }],
      [{ value: 1 }, { value: 0 }],
      [{ value: 1 }, { value: 0 }]
    ];
    const result = cleanupCliffArtifacts(map);
    const totalOnes = result.flat().filter(cell => cell.value === 1).length;
    expect(totalOnes).toBe(0);
  });

  describe('Hole Filling', () => {
    it('should fill 1x1 hole surrounded by cliff', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // The 1x1 hole at (2,2) should be filled
      expect(result[2][2].value).toBe(1);
    });

    it('should fill 2x2 hole surrounded by cliff', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // The 2x2 hole should be filled
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[3][2].value).toBe(1);
      expect(result[3][3].value).toBe(1);
    });

    it('should preserve 3x3 hole (minimum allowed)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // The 3x3 hole should remain (minimum allowed)
      expect(result[2][2].value).toBe(0);
      expect(result[2][3].value).toBe(0);
      expect(result[2][4].value).toBe(0);
      expect(result[3][2].value).toBe(0);
      expect(result[4][2].value).toBe(0);
    });

    it('should fill multiple 1x1 holes', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // Both 1x1 holes should be filled
      expect(result[1][1].value).toBe(1);
      expect(result[1][3].value).toBe(1);
    });

    it('should not fill holes at map edges', () => {
      const map = [
        [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // Edge hole should not be filled (not surrounded)
      expect(result[0][0].value).toBe(0);
    });

    it('should fill 1x2 vertical hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[3][2].value).toBe(1);
    });

    it('should fill 2x1 horizontal hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
    });

    it('should fill 2x3 hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[3][2].value).toBe(1);
      expect(result[3][3].value).toBe(1);
      expect(result[4][2].value).toBe(1);
      expect(result[4][3].value).toBe(1);
    });

    it('should fill 3x2 hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[2][4].value).toBe(1);
      expect(result[3][2].value).toBe(1);
      expect(result[3][3].value).toBe(1);
      expect(result[3][4].value).toBe(1);
    });

    it('should fill 1x3 vertical hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[3][2].value).toBe(1);
      expect(result[4][2].value).toBe(1);
    });

    it('should fill 3x1 horizontal hole', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[2][4].value).toBe(1);
    });

    it('should fill L-shaped 2x2 hole (3 cells)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // L-shape should be filled
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[3][2].value).toBe(1);
    });

    it('should fill L-shaped 3x3 hole (8 cells)', () => {
      const map = [
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
        [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }]
      ];
      const result = cleanupCliffArtifacts(map);
      // All 8 cells of L-shape should be filled
      expect(result[2][2].value).toBe(1);
      expect(result[2][3].value).toBe(1);
      expect(result[2][4].value).toBe(1);
      expect(result[3][2].value).toBe(1);
      expect(result[3][3].value).toBe(1);
      expect(result[3][4].value).toBe(1);
      expect(result[4][2].value).toBe(1);
      expect(result[4][3].value).toBe(1);
    });
  });
});
