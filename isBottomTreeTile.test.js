import { describe, it, expect } from "vitest";
import { isBottomRightTreeTile, isBottomLeftTreeTile } from "./isBottomTreeTile.js";

describe("isBottomRightTreeTile", () => {
  it("returns true for tree type 1 bottomRight (1256)", () => {
    expect(isBottomRightTreeTile(1256)).toBe(true);
  });

  it("returns true for tree type 2 bottomRight (1496)", () => {
    expect(isBottomRightTreeTile(1496)).toBe(true);
  });

  it("returns true for tree type 3 bottomRight (1502)", () => {
    expect(isBottomRightTreeTile(1502)).toBe(true);
  });

  it("returns true for tree type 4 bottomRight (1508)", () => {
    expect(isBottomRightTreeTile(1508)).toBe(true);
  });

  it("returns false for bottomLeft values", () => {
    expect(isBottomRightTreeTile(1255)).toBe(false);
    expect(isBottomRightTreeTile(1495)).toBe(false);
    expect(isBottomRightTreeTile(1501)).toBe(false);
    expect(isBottomRightTreeTile(1507)).toBe(false);
  });

  it("returns false for topLeft/topRight values", () => {
    expect(isBottomRightTreeTile(1231)).toBe(false);
    expect(isBottomRightTreeTile(1232)).toBe(false);
  });

  it("returns false for 0 and arbitrary numbers", () => {
    expect(isBottomRightTreeTile(0)).toBe(false);
    expect(isBottomRightTreeTile(999)).toBe(false);
  });

  it("returns false for undefined and null", () => {
    expect(isBottomRightTreeTile(undefined)).toBe(false);
    expect(isBottomRightTreeTile(null)).toBe(false);
  });
});

describe("isBottomLeftTreeTile", () => {
  it("returns true for tree type 1 bottomLeft (1255)", () => {
    expect(isBottomLeftTreeTile(1255)).toBe(true);
  });

  it("returns true for tree type 2 bottomLeft (1495)", () => {
    expect(isBottomLeftTreeTile(1495)).toBe(true);
  });

  it("returns true for tree type 3 bottomLeft (1501)", () => {
    expect(isBottomLeftTreeTile(1501)).toBe(true);
  });

  it("returns true for tree type 4 bottomLeft (1507)", () => {
    expect(isBottomLeftTreeTile(1507)).toBe(true);
  });

  it("returns false for bottomRight values", () => {
    expect(isBottomLeftTreeTile(1256)).toBe(false);
    expect(isBottomLeftTreeTile(1496)).toBe(false);
    expect(isBottomLeftTreeTile(1502)).toBe(false);
    expect(isBottomLeftTreeTile(1508)).toBe(false);
  });

  it("returns false for topLeft/topRight values", () => {
    expect(isBottomLeftTreeTile(1231)).toBe(false);
    expect(isBottomLeftTreeTile(1232)).toBe(false);
  });

  it("returns false for 0 and arbitrary numbers", () => {
    expect(isBottomLeftTreeTile(0)).toBe(false);
    expect(isBottomLeftTreeTile(999)).toBe(false);
  });

  it("returns false for undefined and null", () => {
    expect(isBottomLeftTreeTile(undefined)).toBe(false);
    expect(isBottomLeftTreeTile(null)).toBe(false);
  });
});
