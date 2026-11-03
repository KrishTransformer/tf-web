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
