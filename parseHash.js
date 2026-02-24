/**
 * Parses a URL hash string into an object of numeric key-value pairs.
 * @param {string} hash - Hash string like "#seed=42&zoom=5"
 * @returns {Object} Parsed params with numeric values, e.g. { seed: 42, zoom: 5 }
 */
export function parseHash(hash) {
  const cleaned = hash.replace(/^#/, "");
  if (!cleaned) return {};

  const result = {};

  for (const part of cleaned.split("&")) {
    const [key, val] = part.split("=");
    if (!key || val === undefined || val === "") continue;
    const num = Number(val);
    if (!isNaN(num)) {
      result[key] = num;
    }
  }

  return result;
}
