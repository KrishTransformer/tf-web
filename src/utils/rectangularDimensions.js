export const isRectangular = (data) => data?.eTransBodyType === "RECTANGULAR";
export const dimensionPair = (width, depth) => `${width ?? "—"} X ${depth ?? "—"}`;

export const coilDimensionsKey = (data) => isRectangular(data) ? "rectCoilDimensions" : "coilDimensions";

export function editableCoilDimensions(data) {
  if (!isRectangular(data)) return data.coilDimensions || {};
  // Migrate older saved designs only when the rectangular object is absent.
  const source = data.rectCoilDimensions ?? data.coilDimensions ?? {};
  const fields = ["coreWidth", "coreDepth", "coreGap", "lvIdWidth", "lvIdDepth", "lvradial",
    "lvOdWidth", "lvOdDepth", "lvhvgap", "hvIdWidth", "hvIdDepth", "hvRadial",
    "hvOdWidth", "hvOdDepth", "hvhvgap", "centerDist", "activePartSize"];
  const result = data.rectCoilDimensions
    ? Object.fromEntries(Object.entries(source).filter(([key]) => fields.includes(key)))
    : Object.prototype.hasOwnProperty.call(source, "coreGap") ? { coreGap: source.coreGap } : {};
  for (const [key, alias] of [["lvhvgap", "lVHVGap"], ["hvhvgap", "hVHVGap"]]) {
    result[key] = Object.prototype.hasOwnProperty.call(source, key) ? source[key] : source[alias];
    delete result[alias];
  }
  return result;
}

export function resetCoilDimensions(data, defaults, preserveClearances = true) {
  const key = coilDimensionsKey(data);
  const source = editableCoilDimensions(data);
  const reset = { ...(defaults[key] || {}) };
  if (preserveClearances) {
    for (const field of ["coreGap", "lvhvgap", "hvhvgap"]) reset[field] = source[field];
  }
  return reset;
}

export function applyCoreDimensionInputs(data) {
  if (!isRectangular(data)) return data;
  const overrides = data.coreDimensionOverrides || {};
  const dimensions = editableCoilDimensions(data);
  for (const field of ["coreGap", "lvhvgap", "hvhvgap"]) {
    const value = dimensions[field];
    dimensions[field] = value == null || String(value).trim() === "" || !Number.isFinite(Number(value))
      ? null : Number(value);
  }
  return { ...data, rectCoilDimensions: dimensions, core: { ...data.core,
    coreWidth: overrides.coreWidth ?? null,
    coreDepth: overrides.coreDepth ?? null,
  }};
}

export function retainCoreDimensionInputs(response, request) {
  return isRectangular(request)
    ? { ...response, coreDimensionOverrides: request.coreDimensionOverrides || {} }
    : response;
}

// Use physical rectangular dimensions in printouts, rather than the backend's
// perimeter-equivalent diameters used for the impedance estimate.
export function designPrintDimensions(data) {
  const rectangular = isRectangular(data);
  const coil = rectangular ? (data.rectCoilDimensions || {}) : (data.coilDimensions || {});
  const winding = (prefix, edge) => rectangular
    ? dimensionPair(coil[`${prefix}${edge}Width`], coil[`${prefix}${edge}Depth`])
    : coil[`${prefix}${edge.toLowerCase()}`];
  return {
    core: rectangular ? dimensionPair(coil.coreWidth ?? data.core?.coreWidth, coil.coreDepth ?? data.core?.coreDepth) : data.core?.coreDia,
    coreGap: coil.coreGap, lvId: winding("lv", "Id"), lvOd: winding("lv", "Od"),
    hvId: winding("hv", "Id"), hvOd: winding("hv", "Od"),
    lvRadial: coil.lvradial, hvRadial: rectangular ? coil.hvRadial : coil.hvradial,
    lvHvGap: coil.lvhvgap, hvHvGap: coil.hvhvgap,
    dsFirstTerm: (rectangular ? (coil.lvOdWidth ?? data.lvFormulas?.lvOdWidth)
      : (data.lvFormulas?.lvOd ?? coil.lvod)) - (data.innerWindings?.condInsulation ?? 0),
  };
}
