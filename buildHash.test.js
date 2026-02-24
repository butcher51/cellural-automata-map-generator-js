import { describe, it, expect } from "vitest";
import { buildHash } from "./buildHash.js";

describe("buildHash", () => {
  it('builds "#seed=42" from { seed: 42 }', () => {
    expect(buildHash({ seed: 42 })).toBe("#seed=42");
  });

  it("returns empty string for empty object", () => {
    expect(buildHash({})).toBe("");
  });

  it("builds string with multiple params", () => {
    const result = buildHash({ seed: 42, zoom: 5 });
    expect(result).toBe("#seed=42&zoom=5");
  });

  it("skips undefined values", () => {
    expect(buildHash({ seed: 42, zoom: undefined })).toBe("#seed=42");
  });

  it("skips null values", () => {
    expect(buildHash({ seed: 42, zoom: null })).toBe("#seed=42");
  });

  it("includes zero values", () => {
    expect(buildHash({ seed: 0 })).toBe("#seed=0");
  });

  it("returns empty string when all values are null/undefined", () => {
    expect(buildHash({ seed: undefined, zoom: null })).toBe("");
  });
});
