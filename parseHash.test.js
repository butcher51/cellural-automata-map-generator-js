import { describe, it, expect } from "vitest";
import { parseHash } from "./parseHash.js";

describe("parseHash", () => {
  it("returns empty object for empty string", () => {
    expect(parseHash("")).toEqual({});
  });

  it("returns empty object for just #", () => {
    expect(parseHash("#")).toEqual({});
  });

  it('parses "#seed=42" into { seed: 42 }', () => {
    expect(parseHash("#seed=42")).toEqual({ seed: 42 });
  });

  it('parses "#seed=0" into { seed: 0 }', () => {
    expect(parseHash("#seed=0")).toEqual({ seed: 0 });
  });

  it("ignores non-numeric seed value", () => {
    expect(parseHash("#seed=abc")).toEqual({});
  });

  it("parses multiple params", () => {
    expect(parseHash("#seed=42&zoom=5")).toEqual({ seed: 42, zoom: 5 });
  });

  it("handles missing # prefix gracefully", () => {
    expect(parseHash("seed=42")).toEqual({ seed: 42 });
  });

  it("ignores params with empty values", () => {
    expect(parseHash("#seed=")).toEqual({});
  });

  it("ignores params without = sign", () => {
    expect(parseHash("#seed")).toEqual({});
  });

  it("handles negative numeric values", () => {
    expect(parseHash("#seed=-5")).toEqual({ seed: -5 });
  });

  it("ignores float values that are not integers", () => {
    expect(parseHash("#seed=3.14")).toEqual({ seed: 3.14 });
  });

  it("skips mixed valid and invalid params", () => {
    expect(parseHash("#seed=42&bad=abc&zoom=2")).toEqual({
      seed: 42,
      zoom: 2,
    });
  });
});
