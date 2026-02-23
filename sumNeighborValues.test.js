import { describe, it, expect, vi } from "vitest";

vi.mock("./constants.js", () => ({ MAP_SIZE: 4 }));

import { sumNeighborValues } from "./sumNeighborValues.js";

function makeValueMap(size, defaultValue) {
  const map = [];
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = { value: defaultValue };
    }
  }
  return map;
}

describe("sumNeighborValues", () => {
  it("returns 4 when all neighbors are present and have value 0", () => {
    const map = makeValueMap(4, 0);
    expect(sumNeighborValues(map, 1, 1)).toBe(4);
  });

  it("returns 0 when all neighbors have value 1", () => {
    const map = makeValueMap(4, 1);
    expect(sumNeighborValues(map, 1, 1)).toBe(0);
  });

  it("counts out-of-bounds cells as 1 (adds to sum)", () => {
    const map = makeValueMap(4, 1);
    // At (0, 0): top-left OOB (+1), top-right OOB (+1), bottom-left OOB (+1), bottom-right value=1 (+0)
    expect(sumNeighborValues(map, 0, 0)).toBe(3);
  });

  it("counts mixed values correctly", () => {
    const map = makeValueMap(4, 0);
    // Set top-left neighbor to value 1 (does NOT add to sum)
    map[0][0].value = 1;
    // At (1, 1): top-left (0,0) value=1 -> 0, top-right (1,0) value=0 -> +1,
    //            bottom-left (0,1) value=0 -> +1, bottom-right (1,1) value=0 -> +1
    expect(sumNeighborValues(map, 1, 1)).toBe(3);
  });

  it("handles corner at max boundary", () => {
    const map = makeValueMap(4, 0);
    // At (4, 0): top-left (3,-1) OOB -> +1, top-right (4,0) x=MAP_SIZE OOB -> +1,
    //            bottom-left (3,0) value=0 -> +1, bottom-right (4,0) x=MAP_SIZE OOB -> +1
    expect(sumNeighborValues(map, 4, 0)).toBe(4);
  });
});
