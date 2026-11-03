import { applyCoreDimensionInputs, dimensionPair, retainCoreDimensionInputs } from "./rectangularDimensions";
const response = { eTransBodyType: "RECTANGULAR", core: { coreWidth: 80, coreDepth: 160 } };
test.each([[{}, null, null], [{ coreWidth: 90 }, 90, null], [{ coreDepth: 183 }, null, 183], [{ coreWidth: 90, coreDepth: 183 }, 90, 183]])("sends only explicit overrides %j", (overrides, width, depth) => {
  const result = applyCoreDimensionInputs({ ...response, coreDimensionOverrides: overrides });
  expect(result.core).toEqual({ coreWidth: width, coreDepth: depth });
  expect(response.core.coreWidth).toBe(80);
});
test("saved responses retain overrides separately", () => {
  const saved = retainCoreDimensionInputs(response, { ...response, coreDimensionOverrides: { coreWidth: 90 } });
  expect(saved.coreDimensionOverrides).toEqual({ coreWidth: 90 });
  expect(applyCoreDimensionInputs(saved).core.coreDepth).toBeNull();
});
test("circular payload and response remain unchanged", () => {
  const circular = { ...response, eTransBodyType: "CIRCULAR" };
  expect(applyCoreDimensionInputs(circular)).toBe(circular);
  expect(retainCoreDimensionInputs(circular, circular)).toBe(circular);
});
test("formats dimensions", () => expect(dimensionPair(90, 183)).toBe("90 X 183"));
