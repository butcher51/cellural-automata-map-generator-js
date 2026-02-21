const TILE_SIZE = 8;
const GRID_COLS = 24;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tileIndexDisplay = document.getElementById('tile-index');

const image = new Image();
image.src = 'assets/overworld.png';

image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.imageSmoothingEnabled = false;
    draw();
};

function draw(highlightCol = -1, highlightRow = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    if (highlightCol >= 0 && highlightRow >= 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        // 10x10 border: offset by -1 from tile position, size 10x10
        ctx.strokeRect(
            highlightCol * TILE_SIZE - 1,
            highlightRow * TILE_SIZE - 1,
            10, 10
        );
    }
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(mouseX / TILE_SIZE);
    const row = Math.floor(mouseY / TILE_SIZE);
    const tileIndex = row * GRID_COLS + col + 1;

    tileIndexDisplay.textContent = tileIndex;
    draw(col, row);
});

canvas.addEventListener('mouseleave', () => {
    tileIndexDisplay.textContent = '—';
    draw();
});
