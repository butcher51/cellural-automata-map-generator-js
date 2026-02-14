import { findThreeByFiveGroups } from "./findThreeByFiveGroups.js";

export function cleanupCliffArtifacts(cliffValueMap) {
  if (!cliffValueMap || cliffValueMap.length === 0) {
    return cliffValueMap;
  }

  // Filter directly and return result
  return findThreeByFiveGroups(cliffValueMap);
}
