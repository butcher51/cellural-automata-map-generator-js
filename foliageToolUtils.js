export function createFoliageToolUtils(prefix, validSuffixes, defaultType) {
  const validTools = new Set(validSuffixes.map(s => `${prefix}-${s}`));

  function isTool(tool) {
    return validTools.has(tool);
  }

  function getType(tool) {
    if (!isTool(tool)) return defaultType;
    return parseInt(tool.split("-")[1], 10);
  }

  return { isTool, getType };
}
