import { BOX_SIZE, MAP_SIZE, ITERATIONS } from './constants.js';
import { generateOrganicMap, getCellColor } from './map-utils.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill canvas with blank color
ctx.fillStyle = '#2a2a2a';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize the map with organic generation
const map = generateOrganicMap(MAP_SIZE, ITERATIONS);

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

// Render the map with colors based on cell objects and sprite numbers
function renderMap(map, ctx, boxSize, sprite) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = map[y][x];
            const cellX = x * boxSize;
            const cellY = y * boxSize;

            // Draw background
            ctx.fillStyle = getCellColor(cell);
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
