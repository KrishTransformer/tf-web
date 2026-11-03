export const isRectangular = (data) => data?.eTransBodyType === "RECTANGULAR";
export const dimensionPair = (width, depth) => `${width ?? "—"} X ${depth ?? "—"}`;

export function applyCoreDimensionInputs(data) {
  if (!isRectangular(data)) return data;
  const overrides = data.coreDimensionOverrides || {};
  return { ...data, core: { ...data.core,
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
    dsFirstTerm: (rectangular ? (coil.lvOdDepth ?? data.lvFormulas?.lvOdDepth)
      : (data.lvFormulas?.lvOd ?? coil.lvod)) - (data.innerWindings?.condInsulation ?? 0),
  };
}
