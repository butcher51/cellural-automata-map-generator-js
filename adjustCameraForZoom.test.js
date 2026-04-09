import { describe, it, expect } from "vitest";
import { adjustCameraForZoom, adjustCameraForZoomAtPoint } from "./adjustCameraForZoom.js";

describe("adjustCameraForZoom", () => {
  it("returns the same camera when zoom does not change", () => {
    const camera = { x: 100, y: 200 };
    const result = adjustCameraForZoom(camera, 3, 3, 800, 600);
    expect(result.x).toBeCloseTo(100);
    expect(result.y).toBeCloseTo(200);
  });

  it("does not mutate the input camera object", () => {
    const camera = { x: 100, y: 200 };
    adjustCameraForZoom(camera, 2, 4, 800, 600);
    expect(camera.x).toBe(100);
    expect(camera.y).toBe(200);
  });

  it("round-trip zoom in then out returns to original camera", () => {
    const camera = { x: 150, y: 250 };
    const zoomed = adjustCameraForZoom(camera, 2, 4, 800, 600);
    const restored = adjustCameraForZoom(zoomed, 4, 2, 800, 600);
    expect(restored.x).toBeCloseTo(150);
    expect(restored.y).toBeCloseTo(250);
  });

  it("keeps the viewport center on the same world point after zoom", () => {
    const camera = { x: 100, y: 200 };
    const oldZoom = 2;
    const newZoom = 4;
    const vw = 800;
    const vh = 600;

    // World point at viewport center before zoom
    const worldX = (camera.x + vw / 2) / oldZoom;
    const worldY = (camera.y + vh / 2) / oldZoom;

    const result = adjustCameraForZoom(camera, oldZoom, newZoom, vw, vh);

    // World point at viewport center after zoom
    const worldX2 = (result.x + vw / 2) / newZoom;
    const worldY2 = (result.y + vh / 2) / newZoom;

    expect(worldX2).toBeCloseTo(worldX);
    expect(worldY2).toBeCloseTo(worldY);
  });

  it("works with camera at origin", () => {
    const camera = { x: 0, y: 0 };
    const result = adjustCameraForZoom(camera, 1, 3, 800, 600);
    // World center before: (400/1, 300/1) = (400, 300)
    // After: (result.x + 400) / 3 should equal 400
    expect((result.x + 400) / 3).toBeCloseTo(400);
    expect((result.y + 300) / 3).toBeCloseTo(300);
  });
});

describe("adjustCameraForZoomAtPoint", () => {
  it("returns the same camera when zoom does not change", () => {
    const camera = { x: 100, y: 200 };
    const result = adjustCameraForZoomAtPoint(camera, 3, 3, 400, 300);
    expect(result.x).toBeCloseTo(100);
    expect(result.y).toBeCloseTo(200);
  });

  it("does not mutate the input camera object", () => {
    const camera = { x: 100, y: 200 };
    adjustCameraForZoomAtPoint(camera, 2, 4, 400, 300);
    expect(camera.x).toBe(100);
    expect(camera.y).toBe(200);
  });

  it("round-trip zoom in then out returns to original camera", () => {
    const camera = { x: 150, y: 250 };
    const zoomed = adjustCameraForZoomAtPoint(camera, 2, 4, 400, 300);
    const restored = adjustCameraForZoomAtPoint(zoomed, 4, 2, 400, 300);
    expect(restored.x).toBeCloseTo(150);
    expect(restored.y).toBeCloseTo(250);
  });

  it("keeps the focal screen point on the same world point after zoom", () => {
    const camera = { x: 100, y: 200 };
    const oldZoom = 2;
    const newZoom = 5;
    const focalX = 300;
    const focalY = 150;

    // World point under focal screen point before zoom
    const worldX = (camera.x + focalX) / oldZoom;
    const worldY = (camera.y + focalY) / oldZoom;

    const result = adjustCameraForZoomAtPoint(camera, oldZoom, newZoom, focalX, focalY);

    // World point under focal screen point after zoom
    const worldX2 = (result.x + focalX) / newZoom;
    const worldY2 = (result.y + focalY) / newZoom;

    expect(worldX2).toBeCloseTo(worldX);
    expect(worldY2).toBeCloseTo(worldY);
  });

  it("is consistent with adjustCameraForZoom when focal point is viewport center", () => {
    const camera = { x: 120, y: 340 };
    const vw = 800;
    const vh = 600;

    const result1 = adjustCameraForZoom(camera, 2, 5, vw, vh);
    const result2 = adjustCameraForZoomAtPoint(camera, 2, 5, vw / 2, vh / 2);

    expect(result2.x).toBeCloseTo(result1.x);
    expect(result2.y).toBeCloseTo(result1.y);
  });
});
