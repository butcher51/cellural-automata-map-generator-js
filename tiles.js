import { TILESETS, TILE_SIZE } from "./tilesetConfig.js";

const SCALE = 4;

const container = document.getElementById("canvas-container");
const tileIndexDisplay = document.getElementById("tile-index");
const tilesetNameDisplay = document.getElementById("tileset-name");

// Build a column with canvas for each tileset
const tilesetEntries = TILESETS.map((tileset, tilesetIndex) => {
  const col = document.createElement("div");
  col.className = "tileset-column";

  const label = document.createElement("div");
  label.className = "tileset-label";
  label.textContent = tileset.id;
  col.appendChild(label);

  const canvas = document.createElement("canvas");
  col.appendChild(canvas);
  container.appendChild(col);

  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = tileset.path;

  // Compute the global index offset: sum of totalTiles of all preceding tilesets
  let indexOffset = 0;
  for (let i = 0; i < tilesetIndex; i++) {
    indexOffset += TILESETS[i].totalTiles;
  }

  return { tileset, canvas, ctx, image, indexOffset };
});

// Load all images, then draw
Promise.all(
  tilesetEntries.map(
    (entry) =>
      new Promise((resolve) => {
        entry.image.onload = () => {
          entry.canvas.width = entry.image.width * SCALE;
          entry.canvas.height = entry.image.height * SCALE;
          entry.ctx.imageSmoothingEnabled = false;
          entry.ctx.scale(SCALE, SCALE);
          drawTileset(entry);
          resolve();
        };
        entry.image.onerror = resolve;
      }),
  ),
);

function drawTileset(entry, highlightCol = -1, highlightRow = -1) {
  const { ctx, image } = entry;
  ctx.clearRect(0, 0, image.width, image.height);
  ctx.drawImage(image, 0, 0);
  if (highlightCol >= 0 && highlightRow >= 0) {
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      highlightCol * TILE_SIZE - 1,
      highlightRow * TILE_SIZE - 1,
      10,
      10,
    );
  }
}

function getTileFromEvent(e, entry) {
  const rect = entry.canvas.getBoundingClientRect();
  const scaleX = entry.canvas.width / rect.width;
  const scaleY = entry.canvas.height / rect.height;
  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;
  const col = Math.floor(mouseX / TILE_SIZE / SCALE);
  const row = Math.floor(mouseY / TILE_SIZE / SCALE);
  const localIndex = row * entry.tileset.tilesPerRow + col + 1;
  const globalIndex = entry.indexOffset + localIndex;
  return { col, row, localIndex, globalIndex };
}

// Attach events to each canvas
for (const entry of tilesetEntries) {
  entry.canvas.addEventListener("mousemove", (e) => {
    const { col, row, globalIndex } = getTileFromEvent(e, entry);
    tilesetNameDisplay.textContent = entry.tileset.id;
    tileIndexDisplay.textContent = globalIndex;
    drawTileset(entry, col, row);
  });

  entry.canvas.addEventListener("click", (e) => {
    const { col, row, globalIndex } = getTileFromEvent(e, entry);
    navigator.clipboard.writeText(String(globalIndex));
    tileIndexDisplay.textContent = "Copied!";
    setTimeout(() => {
      tileIndexDisplay.textContent = globalIndex;
    }, 800);
  });

  entry.canvas.addEventListener("mouseleave", () => {
    tilesetNameDisplay.textContent = "\u2014";
    tileIndexDisplay.textContent = "\u2014";
    drawTileset(entry);
  });
}
