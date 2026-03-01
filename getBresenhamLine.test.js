import { describe, it, expect } from "vitest";
import { getBresenhamLine } from "./getBresenhamLine.js";

describe("getBresenhamLine", () => {
  it("returns a single point when start equals end", () => {
    const result = getBresenhamLine(5, 5, 5, 5);
    expect(result).toEqual([{ x: 5, y: 5 }]);
  });

  it("draws a horizontal line left to right", () => {
    const result = getBresenhamLine(0, 0, 4, 0);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ]);
  });

  it("draws a horizontal line right to left", () => {
    const result = getBresenhamLine(4, 0, 0, 0);
    expect(result).toEqual([
      { x: 4, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]);
  });

  it("draws a vertical line top to bottom", () => {
    const result = getBresenhamLine(0, 0, 0, 4);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ]);
  });

  it("draws a vertical line bottom to top", () => {
    const result = getBresenhamLine(0, 4, 0, 0);
    expect(result).toEqual([
      { x: 0, y: 4 },
      { x: 0, y: 3 },
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ]);
  });

  it("draws a diagonal line (45 degrees)", () => {
    const result = getBresenhamLine(0, 0, 3, 3);
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ]);
  });

  it("draws a reverse diagonal line", () => {
    const result = getBresenhamLine(3, 3, 0, 0);
    expect(result).toEqual([
      { x: 3, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 0, y: 0 },
    ]);
  });

  it("draws a shallow line (dx > dy)", () => {
    const result = getBresenhamLine(0, 0, 6, 2);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual({ x: 0, y: 0 });
    expect(result[result.length - 1]).toEqual({ x: 6, y: 2 });
  });

  it("draws a steep line (dy > dx)", () => {
    const result = getBresenhamLine(0, 0, 2, 6);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual({ x: 0, y: 0 });
    expect(result[result.length - 1]).toEqual({ x: 2, y: 6 });
  });

  it("ensures continuity - each adjacent cell differs by at most 1 in x and y", () => {
    const result = getBresenhamLine(0, 0, 7, 3);
    for (let i = 1; i < result.length; i++) {
      const dx = Math.abs(result[i].x - result[i - 1].x);
      const dy = Math.abs(result[i].y - result[i - 1].y);
      expect(dx).toBeLessThanOrEqual(1);
      expect(dy).toBeLessThanOrEqual(1);
    }
  });

  it("ensures continuity for steep lines", () => {
    const result = getBresenhamLine(1, 1, 3, 10);
    for (let i = 1; i < result.length; i++) {
      const dx = Math.abs(result[i].x - result[i - 1].x);
      const dy = Math.abs(result[i].y - result[i - 1].y);
      expect(dx).toBeLessThanOrEqual(1);
      expect(dy).toBeLessThanOrEqual(1);
    }
  });

  it("first cell is the start point", () => {
    const result = getBresenhamLine(3, 7, 10, 2);
    expect(result[0]).toEqual({ x: 3, y: 7 });
  });

  it("last cell is the end point", () => {
    const result = getBresenhamLine(3, 7, 10, 2);
    expect(result[result.length - 1]).toEqual({ x: 10, y: 2 });
  });

  it("handles negative coordinates", () => {
    const result = getBresenhamLine(-2, -3, 2, 1);
    expect(result[0]).toEqual({ x: -2, y: -3 });
    expect(result[result.length - 1]).toEqual({ x: 2, y: 1 });
  });
});
