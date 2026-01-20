import { BOX_SIZE, MAP_SIZE, ITERATIONS } from './constants.js';
import { generateMap, getCellColor, getCellColorWithDrawingState, getCellsInBrushArea, deepCopyMap, applyOrganicIterations, pixelToGridCoordinate, toggleCellValue, setCellValue } from './map-utils.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill canvas with blank color
ctx.fillStyle = '#2a2a2a';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize the map with organic cave patterns
let map = applyOrganicIterations(generateMap(MAP_SIZE), ITERATIONS);

// State for drag-to-paint interaction
let isDrawing = false;
let paintedCellsInStroke = new Set();
let paintTargetValue = null; // null when not painting, 0 or 1 during stroke

// Load number sprite sheet (100x10 PNG: nine 10x10 digits 0-8)
const numberSprite = new Image();
numberSprite.src = './numbers.png';

// Wait for image to load before starting animation
let spriteLoaded = false;
numberSprite.onload = () => {
    spriteLoaded = true;
    animate();
};

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Helper function to paint cells during drag with 2x2 brush
function paintCellAtPosition(event) {
    // Safety: ensure we have a target value
    if (paintTargetValue === null) return;

    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    // Convert to grid coordinates (center of brush)
    const { x, y } = pixelToGridCoordinate(pixelX, pixelY, BOX_SIZE);

    // Validate center cell bounds
    if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) {
        return;
    }

    // Get all cells in 2x2 brush area
    const brushSize = 2;
    const cellsToPaint = getCellsInBrushArea(x, y, brushSize, MAP_SIZE);

    // Paint each cell (avoid redundant sets within a single stroke)
    for (const cell of cellsToPaint) {
        const cellKey = `${cell.x},${cell.y}`;
        if (!paintedCellsInStroke.has(cellKey)) {
            map = setCellValue(map, cell.x, cell.y, paintTargetValue);
            paintedCellsInStroke.add(cellKey);
        }
    }
}

// Handle mouse down to start painting
function handleMouseDown(event) {
    isDrawing = true;
    paintedCellsInStroke = new Set();

    // Determine target value from first clicked cell
    const rect = canvas.getBoundingClientRect();
    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;
    const { x, y } = pixelToGridCoordinate(pixelX, pixelY, BOX_SIZE);

    // Validate bounds and set target value
    if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
        const currentValue = map[y][x].value;
        paintTargetValue = currentValue === 0 ? 0 : 1; // Invert current value
    } else {
        paintTargetValue = 1; // Default if clicking out of bounds
    }

    // Paint the initial cells with brush
    paintCellAtPosition(event);
}

// Handle mouse move to continue painting
function handleMouseMove(event) {
    if (!isDrawing) return;

    // Continue painting while dragging
    paintCellAtPosition(event);
}

// Handle mouse up to finish painting and rerun iterations
function handleMouseUp(event) {
    if (!isDrawing) return;

    isDrawing = false;
    paintedCellsInStroke = new Set();
    paintTargetValue = null; // Clear target value

    // NOW rerun cellular automaton iterations (clears isBeingDrawn flags)
    map = applyOrganicIterations(map, ITERATIONS);
}

// Attach mouse event listeners for drag-to-paint
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

// Also handle mouse leaving canvas
canvas.addEventListener('mouseleave', handleMouseUp);

// Render the map with colors based on cell objects and sprite numbers
function renderMap(map, ctx, boxSize, sprite) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = map[y][x];
            const cellX = x * boxSize;
            const cellY = y * boxSize;

            // Draw background (uses drawing state for temporary colors)
            ctx.fillStyle = getCellColorWithDrawingState(cell);
            ctx.fillRect(cellX, cellY, boxSize, boxSize);

            // Draw friend count number from sprite sheet
            if (cell.friendCount !== undefined && sprite) {
                const digit = cell.friendCount;
                // Source position in sprite sheet: digit * 10 (each digit is 10px wide)
                const spriteX = digit * 10;

                ctx.drawImage(
                    sprite,           // Image source
                    spriteX, 0,       // Source x, y (which digit in sprite)
                    10, 10,           // Source width, height (10x10)
                    cellX, cellY,     // Destination x, y (on canvas)
                    boxSize, boxSize  // Destination width, height (10x10)
                );
            }
        }
    }
}

// Animation loop
function animate() {
    if (!spriteLoaded) return; // Don't render until sprite is loaded

    // Clear canvas with background color
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the map with sprite
    renderMap(map, ctx, BOX_SIZE, numberSprite);

    requestAnimationFrame(animate);
}

// Note: animate() is now called from numberSprite.onload instead of immediately
