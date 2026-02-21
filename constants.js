// Configuration constants for map generation

// Size in pixels of each rendered box (8x8px)
export const BOX_SIZE = 8;

// Grid dimensions (100x100 boxes = 10,000 boxes total)
export const MAP_SIZE = 500;

// Scale factor for rendering (1 = normal, 2 = 2x zoom, etc.)
export const ZOOM = 3;

// Pixels per frame for camera movement
export const CAMERA_SPEED = 5;

// Number of iterations for cave generation (increased for better formation)
// Each iteration calculates neighbor counts and applies cave rules
export const ITERATIONS = 0;

// Cave generation thresholds
// Walls need 4+ wall neighbors to survive, floors need 5+ to become walls
export const WALL_SURVIVAL_THRESHOLD = 4;
export const FLOOR_TO_WALL_THRESHOLD = 5;

// Lake generation parameters
export const LAKE_NOISE_DENSITY = 0.3;
export const LAKE_CA_ITERATIONS = 5;
export const LAKE_SEED_OFFSET = 10000;
export const LAKE_COUNT = 10;
export const LAKE_CLUSTER_RADIUS = 10;

export const BACKGROUND_COLOR = "#7e9432";

export let SEED = 1;

export function setSeed(newSeed) {
  SEED = newSeed;
}

export const GROUND_TILES = [
  { index: 1, chance: 1 },
  { index: 2, chance: 0.5 },
  { index: 3, chance: 0.1 },
  { index: 4, chance: 0.1 },
  { index: 24 + 1, chance: 0.1 },
  { index: 24 + 2, chance: 0.1 },
  { index: 24 + 3, chance: 0.1 },
  { index: 24 + 4, chance: 0.1 },
  { index: 48 + 1, chance: 0.1 },
  { index: 48 + 2, chance: 0.1 },
  { index: 48 + 3, chance: 0.01 },
  { index: 48 + 4, chance: 0.01 },
  { index: 72 + 1, chance: 0.01 },
  { index: 72 + 2, chance: 0.01 },
  { index: 72 + 3, chance: 0.01 },
  { index: 72 + 4, chance: 0.01 },
  { index: 96 + 1, chance: 0.01 },
  { index: 96 + 2, chance: 0.01 },
  { index: 96 + 3, chance: 0.01 },
  { index: 96 + 4, chance: 0.01 },
  { index: 120 + 1, chance: 0.01 },
  { index: 120 + 2, chance: 0.01 },
  { index: 120 + 3, chance: 0.01 },
  { index: 120 + 4, chance: 0.005 },
  { index: 144 + 1, chance: 0.005 },
  { index: 144 + 2, chance: 0.005 },
  { index: 144 + 3, chance: 0.005 },
  { index: 144 + 4, chance: 0.005 },
];
