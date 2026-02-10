import { describe, expect, it } from "vitest";
import { cleanupCliffArtifacts } from "./cleanupCliffArtifacts.js";

// Helper to create cliff value maps
function createCliffMap(pattern) {
  return pattern.map((row) => row.map((v) => ({ tile: 0, value: v })));
}

describe("cleanupCliffArtifacts", () => {
  it("should return the same map if null or empty", () => {
    expect(cleanupCliffArtifacts(null)).toBe(null);
    expect(cleanupCliffArtifacts([])).toEqual([]);
  });

  it("should remove single cliff cells", () => {
    const map = createCliffMap([
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const result = cleanupCliffArtifacts(map);
    expect(result[1][2].value).toBe(0);
  });

  it("should remove 2x2 cliff region (too small)", () => {
    const map = createCliffMap([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const result = cleanupCliffArtifacts(map);
    expect(result[1][1].value).toBe(0);
    expect(result[1][2].value).toBe(0);
    expect(result[2][1].value).toBe(0);
    expect(result[2][2].value).toBe(0);
  });

  it("should remove 1xN narrow lines", () => {
    const map = createCliffMap([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const result = cleanupCliffArtifacts(map);
    for (let x = 0; x < 5; x++) {
      expect(result[1][x].value).toBe(0);
    }
  });

  it("should preserve 3x3 cliff regions", () => {
    const map = createCliffMap([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
    const result = cleanupCliffArtifacts(map);
    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        expect(result[y][x].value).toBe(1);
      }
    }
  });

  it("should preserve large cliff regions", () => {
    const map = createCliffMap([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ]);
    const result = cleanupCliffArtifacts(map);
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(result[y][x].value).toBe(1);
      }
    }
  });

  it("should not modify the original map (immutability)", () => {
    const map = createCliffMap([
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const original = JSON.parse(JSON.stringify(map));
    cleanupCliffArtifacts(map);
    expect(map).toEqual(original);
  });

  it("should handle empty cliff map (all zeros)", () => {
    const map = createCliffMap([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    const result = cleanupCliffArtifacts(map);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(result[y][x].value).toBe(0);
      }
    }
  });
});
