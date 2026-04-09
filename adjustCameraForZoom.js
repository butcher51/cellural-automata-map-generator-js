export function adjustCameraForZoom(camera, oldZoom, newZoom, viewportWidth, viewportHeight) {
  const ratio = newZoom / oldZoom;
  return {
    x: (camera.x + viewportWidth / 2) * ratio - viewportWidth / 2,
    y: (camera.y + viewportHeight / 2) * ratio - viewportHeight / 2,
  };
}

export function adjustCameraForZoomAtPoint(camera, oldZoom, newZoom, focalScreenX, focalScreenY) {
  const ratio = newZoom / oldZoom;
  return {
    x: (camera.x + focalScreenX) * ratio - focalScreenX,
    y: (camera.y + focalScreenY) * ratio - focalScreenY,
  };
}
