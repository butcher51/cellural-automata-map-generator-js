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
});
