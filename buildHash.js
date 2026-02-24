/**
 * Builds a URL hash string from an object of key-value pairs.
 * @param {Object} params - Object with params, e.g. { seed: 42, zoom: 5 }
 * @returns {string} Hash string like "#seed=42&zoom=5", or "" if no valid params
 */
export function buildHash(params) {
  const pairs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${v}`);

  return pairs.length > 0 ? `#${pairs.join("&")}` : "";
}
