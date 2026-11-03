export function applyLvLayerInput(payload) {
  const value = payload.innerWindings?.noOfLayers;
  const layers = value === null || value === undefined || String(value).trim() === ""
    ? null : Number(value);
  return {
    ...payload,
    lvNumberOfLayers: Number.isFinite(layers) ? layers : null,
  };
}
