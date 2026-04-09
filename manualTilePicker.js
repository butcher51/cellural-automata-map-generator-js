import { TILESETS } from "./tilesetConfig.js";

const MANUAL_TILE_SCALE = 3;
const manualTileCanvases = []; // { canvas, ctx, image, tileset, indexOffset, tilesetIndex }

// Picker drag state for multi-tile rectangle selection
let pickerDragStart = null; // { col, row, tilesetIndex }
let pickerDragEnd = null;   // { col, row }

function drawManualTileset(entry, startCol, startRow, endCol, endRow) {
  const { ctx: tileCtx, image } = entry;
  tileCtx.clearRect(0, 0, entry.canvas.width, entry.canvas.height);
  tileCtx.save();
  tileCtx.scale(MANUAL_TILE_SCALE, MANUAL_TILE_SCALE);
  tileCtx.drawImage(image, 0, 0);
  if (startCol >= 0 && startRow >= 0 && endCol >= 0 && endRow >= 0) {
    tileCtx.strokeStyle = "#ff0000";
    tileCtx.lineWidth = 1;
    tileCtx.strokeRect(startCol * 8, startRow * 8, (endCol - startCol + 1) * 8, (endRow - startRow + 1) * 8);
  }
  tileCtx.restore();
}

/**
 * Initializes the manual tile picker panel.
 * @param {Object} config
 * @param {HTMLElement} config.manualTileGrid - DOM element to append canvases to
 * @param {Array<Image>} config.tilesetImages - Pre-loaded tileset images
 * @param {Function} config.onDragStarted - Called on picker mousedown
 * @param {Function} config.onTileSelected - Called on picker mouseup with selection
 */
export function initManualTilePanel(config) {
  const { manualTileGrid, tilesetImages, onDragStarted, onTileSelected } = config;

  manualTileGrid.innerHTML = "";
  manualTileCanvases.length = 0;

  TILESETS.forEach((tileset, tilesetIndex) => {
    let indexOffset = 0;
    for (let i = 0; i < tilesetIndex; i++) {
      indexOffset += TILESETS[i].totalTiles;
    }

    const tileCanvas = document.createElement("canvas");
    tileCanvas.style.imageRendering = "pixelated";
    const tileCtx = tileCanvas.getContext("2d");

    // Use already-loaded tileset images
    const img = tilesetImages[tilesetIndex];

    const entry = { canvas: tileCanvas, ctx: tileCtx, image: img, tileset, indexOffset, tilesetIndex };
    manualTileCanvases.push(entry);

    // Hide all except first tileset
    if (tilesetIndex > 0) {
      tileCanvas.style.display = "none";
    }

    manualTileGrid.appendChild(tileCanvas);

    // Setup canvas once image loads
    function setupCanvas() {
      tileCanvas.width = img.width * MANUAL_TILE_SCALE;
      tileCanvas.height = img.height * MANUAL_TILE_SCALE;
      tileCtx.imageSmoothingEnabled = false;
      drawManualTileset(entry);
    }

    if (img.complete) {
      setupCanvas();
    } else {
      img.addEventListener("load", setupCanvas);
    }

    // Helper to convert mouse event to picker grid cell
    function getPickerCell(e) {
      const rect = tileCanvas.getBoundingClientRect();
      const scaleX = tileCanvas.width / rect.width;
      const scaleY = tileCanvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      const maxCol = tileset.tilesPerRow - 1;
      const maxRow = Math.ceil(tileset.totalTiles / tileset.tilesPerRow) - 1;
      return {
        col: Math.max(0, Math.min(maxCol, Math.floor(mouseX / (8 * MANUAL_TILE_SCALE)))),
        row: Math.max(0, Math.min(maxRow, Math.floor(mouseY / (8 * MANUAL_TILE_SCALE)))),
      };
    }

    // Mousedown: start drag selection
    tileCanvas.addEventListener("mousedown", (e) => {
      const { col, row } = getPickerCell(e);
      pickerDragStart = { col, row, tilesetIndex };
      pickerDragEnd = { col, row };
      onDragStarted();
      drawManualTileset(entry, col, row, col, row);
    });

    // Mousemove: update drag rectangle or show hover highlight
    tileCanvas.addEventListener("mousemove", (e) => {
      const { col, row } = getPickerCell(e);
      if (pickerDragStart && pickerDragStart.tilesetIndex === tilesetIndex) {
        pickerDragEnd = { col, row };
        const minCol = Math.min(pickerDragStart.col, col);
        const minRow = Math.min(pickerDragStart.row, row);
        const maxCol = Math.max(pickerDragStart.col, col);
        const maxRow = Math.max(pickerDragStart.row, row);
        drawManualTileset(entry, minCol, minRow, maxCol, maxRow);
      } else {
        drawManualTileset(entry, col, row, col, row);
      }
    });

    // Mouseup: finalize rectangle selection
    tileCanvas.addEventListener("mouseup", (e) => {
      if (!pickerDragStart || pickerDragStart.tilesetIndex !== tilesetIndex) {
        pickerDragStart = null;
        pickerDragEnd = null;
        return;
      }
      const { col, row } = getPickerCell(e);
      const minCol = Math.min(pickerDragStart.col, col);
      const minRow = Math.min(pickerDragStart.row, row);
      const maxCol = Math.max(pickerDragStart.col, col);
      const maxRow = Math.max(pickerDragStart.row, row);

      // Build 2D tiles array of global indices
      const tiles = [];
      for (let r = minRow; r <= maxRow; r++) {
        const rowTiles = [];
        for (let c = minCol; c <= maxCol; c++) {
          const localIndex = r * tileset.tilesPerRow + c + 1;
          rowTiles.push(indexOffset + localIndex);
        }
        tiles.push(rowTiles);
      }

      const selection = { tilesetIndex, tiles };
      onTileSelected(selection);
      drawManualTileset(entry, minCol, minRow, maxCol, maxRow);
      pickerDragStart = null;
      pickerDragEnd = null;
    });

    // Mouseleave: cancel drag, clear highlight
    tileCanvas.addEventListener("mouseleave", () => {
      pickerDragStart = null;
      pickerDragEnd = null;
      drawManualTileset(entry);
    });
  });

  // Tab switching
  const tabs = document.querySelectorAll(".manual-tile-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetIndex = parseInt(tab.dataset.tileset, 10);
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      pickerDragStart = null;
      pickerDragEnd = null;
      manualTileCanvases.forEach((entry, i) => {
        entry.canvas.style.display = i === targetIndex ? "block" : "none";
      });
    });
  });
}

/**
 * Updates the manual tile info text element.
 * @param {HTMLElement} infoElement - The info text DOM element
 * @param {Object|null} selection - The current tile selection
 */
export function updateManualTileInfo(infoElement, selection) {
  if (!infoElement) return;
  if (selection) {
    const h = selection.tiles.length;
    const w = selection.tiles[0].length;
    if (h === 1 && w === 1) {
      infoElement.textContent = `Selected: tile ${selection.tiles[0][0]}`;
    } else {
      infoElement.textContent = `Selected: ${w}x${h} tiles`;
    }
  } else {
    infoElement.textContent = "Selected: none";
  }
}
