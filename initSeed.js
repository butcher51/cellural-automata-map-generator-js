import { buildHash } from "./buildHash.js";
import { SEED, setSeed } from "./constants.js";
import { parseHash } from "./parseHash.js";

export function initSeed() {
  // Parse seed from URL hash on page load
  const initialHashParams = parseHash(window.location.hash);
  if (initialHashParams.seed !== undefined) {
    setSeed(initialHashParams.seed);
    return initialHashParams.seed;
  }

  // Set hash from current seed so URL is always shareable
  history.replaceState(null, "", buildHash({ seed: SEED }));
  return SEED;
}
