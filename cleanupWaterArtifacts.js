import { findThreeByThreeGroups } from "./findThreeByThreeGroups.js";

export function cleanupWaterArtifacts(waterValueMap) {
  if (!waterValueMap || waterValueMap.length === 0) {
    return waterValueMap;
  }

  // Filter directly and return result
  return findThreeByThreeGroups(waterValueMap);
}
