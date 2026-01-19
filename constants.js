// Configuration constants for map generation

// Size in pixels of each rendered box (10x10px)
export const BOX_SIZE = 10;

// Grid dimensions (100x100 boxes = 10,000 boxes total)
export const MAP_SIZE = 100;

// Number of iterations for cave generation (increased for better formation)
// Each iteration calculates neighbor counts and applies cave rules
export const ITERATIONS = 4;

// Cave generation thresholds
// Walls need 4+ wall neighbors to survive, floors need 5+ to become walls
export const WALL_SURVIVAL_THRESHOLD = 4;
export const FLOOR_TO_WALL_THRESHOLD = 5;
