# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple procedural map generator built with vanilla JavaScript and HTML5 Canvas. The project uses ES6 modules and runs on an Express static file server.

## Development Commands

```bash
# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm start
# or
npm run dev

# Run tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

## Architecture

### File Structure

- **server.js** - Express server that serves static files on port 3000
- **index.html** - Entry point with canvas element and dark theme styling
- **generator.js** - Main rendering logic with animation loop (DOM-dependent)
- **map-utils.js** - Pure utility functions for map generation (testable, DOM-free)
- **constants.js** - Configuration values for map generation (BOX_SIZE, MAP_SIZE)
- **generator.test.js** - Unit tests for map generation functions

### Module System

The project uses ES6 modules (`"type": "module"` in package.json). All JavaScript files use `import`/`export` syntax.

### Rendering Pipeline

1. **Map Generation** - `generateMap()` creates a 2D array filled with random 0s and 1s
2. **Canvas Setup** - Canvas is sized to fill the viewport and responds to window resize events
3. **Animation Loop** - `animate()` runs via `requestAnimationFrame()` to continuously render the map
4. **Rendering** - `renderMap()` draws the map as grey boxes on a dark background

### Current Behavior

The generator creates a 10x10 grid (MAP_SIZE) where each cell is rendered as a 10x10 pixel box (BOX_SIZE). Currently, the map is generated once on load and rendered continuously in an animation loop, but all boxes appear grey regardless of their 0 or 1 value (the random values are generated but not visually differentiated).

### Key Constants

- `BOX_SIZE`: Size in pixels of each rendered grid cell (default: 10)
- `MAP_SIZE`: Dimensions of the grid (default: 10x10)

Both constants are defined in constants.js and can be modified to change the grid size and resolution.

## Testing

The project uses **Vitest** as its testing framework. Tests are located in `*.test.js` files.

### Code Organization for Testing

To enable unit testing in a Node.js environment while keeping DOM-dependent code in the browser:

- **map-utils.js** - Contains pure, testable functions (no DOM dependencies)
- **generator.js** - Contains browser-specific code (uses `document`, `window`, canvas API)

When adding new features, place pure logic in map-utils.js and rendering/DOM manipulation in generator.js. This separation allows comprehensive unit testing without needing a browser environment.

### Test-Driven Development (TDD) Workflow

**This project follows TDD practices. Always write tests before implementation code.**

When adding new features or fixing bugs:

1. **Write the test first**
   - Create or update a `*.test.js` file
   - Write test cases that describe the expected behavior
   - Tests will initially fail (Red phase)

2. **Implement the minimal code**
   - Write just enough code to make the tests pass
   - Add the implementation to map-utils.js (for pure functions) or generator.js (for DOM code)
   - Run `npm test` to verify

3. **Iterate until all tests pass**
   - Fix implementation issues
   - Run tests frequently: `npm run test:watch` for continuous feedback
   - Continue until all tests are green (Green phase)

4. **Refactor if needed**
   - Improve code quality while keeping tests green
   - Ensure tests still pass after refactoring

**Example TDD workflow:**
```bash
# 1. Write test first (it will fail)
# Edit: map-utils.test.js - add test for new function

# 2. Run tests to see failure
npm test

# 3. Implement minimal code
# Edit: map-utils.js - add new function

# 4. Run tests again
npm test

# 5. Iterate until green, then refactor
npm run test:watch  # Keep running while you work
```

Only and just only unit test. Do not open browser and try to test it, always let the user to test it manually. 

### Current Test Coverage

- **generateMap()**: Tests verify correct dimensions, value constraints (0 or 1), randomness, edge cases, and array independence.
