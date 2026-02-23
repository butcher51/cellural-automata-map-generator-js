import { describe, it, expect } from "vitest";
import { createFoliageToolUtils } from "./foliageToolUtils.js";

describe("createFoliageToolUtils", () => {
  const { isTool, getType } = createFoliageToolUtils("tree", ["1", "2", "3", "4"], 1);

  describe("isTool", () => {
    it("returns true for valid tool strings", () => {
      expect(isTool("tree-1")).toBe(true);
      expect(isTool("tree-2")).toBe(true);
      expect(isTool("tree-3")).toBe(true);
      expect(isTool("tree-4")).toBe(true);
    });

    it("returns false for invalid tool strings", () => {
      expect(isTool("tree")).toBe(false);
      expect(isTool("tree-0")).toBe(false);
      expect(isTool("tree-5")).toBe(false);
      expect(isTool("pine-1")).toBe(false);
      expect(isTool("eraser")).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isTool(undefined)).toBe(false);
    });
  });

  describe("getType", () => {
    it("extracts the number from the tool string", () => {
      expect(getType("tree-1")).toBe(1);
      expect(getType("tree-2")).toBe(2);
      expect(getType("tree-3")).toBe(3);
      expect(getType("tree-4")).toBe(4);
    });

    it("returns defaultType for invalid input", () => {
      expect(getType("eraser")).toBe(1);
      expect(getType("tree")).toBe(1);
      expect(getType("tree-0")).toBe(1);
      expect(getType("tree-5")).toBe(1);
    });
  });

  describe("with pine config", () => {
    const pine = createFoliageToolUtils("pine", ["1"], 1);

    it("isTool returns true for pine-1", () => {
      expect(pine.isTool("pine-1")).toBe(true);
    });

    it("isTool returns false for pine-2", () => {
      expect(pine.isTool("pine-2")).toBe(false);
    });

    it("getType returns 1 for pine-1", () => {
      expect(pine.getType("pine-1")).toBe(1);
    });

    it("getType returns defaultType for invalid", () => {
      expect(pine.getType("tree-1")).toBe(1);
    });
  });
});
