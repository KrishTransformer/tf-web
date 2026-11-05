import { applyCoreDimensionInputs, dimensionPair, retainCoreDimensionInputs, designPrintDimensions, editableCoilDimensions, resetCoilDimensions } from "./rectangularDimensions";
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

test("rectangular print uses physical dimensions and LV OD width for Ds", () => {
  const result = designPrintDimensions({ eTransBodyType: "RECTANGULAR", core: {},
    rectCoilDimensions: { coreWidth: 90, coreDepth: 183, lvIdWidth: 100, lvIdDepth: 193,
      lvOdWidth: 120, lvOdDepth: 213, hvIdWidth: 140, hvIdDepth: 233, hvOdWidth: 160, hvOdDepth: 253 },
    innerWindings: { condInsulation: 0.4 }, lvFormulas: {} });
  expect(result.core).toBe("90 X 183");
  expect(result.lvId).toBe("100 X 193");
  expect(result.lvOd).toBe("120 X 213");
  expect(result.hvId).toBe("140 X 233");
  expect(result.hvOd).toBe("160 X 253");
  expect(result.dsFirstTerm).toBeCloseTo(119.6);
});
test("circular print keeps diameters and its Ds formula", () => {
  const result = designPrintDimensions({ eTransBodyType: "CIRCULAR", core: { coreDia: 150 },
    coilDimensions: { lvid: 170, lvod: 190 }, lvFormulas: { lvOd: 190 }, innerWindings: { condInsulation: 0.5 } });
  expect(result.core).toBe(150);
  expect(result.lvOd).toBe(190);
  expect(result.dsFirstTerm).toBe(189.5);
});

test("rectangular payload clearances use rectangular values over circular values", () => {
  const state = { ...response, rectCoilDimensions: { coreGap: "4", lvhvgap: "12", hvhvgap: "20" },
    coilDimensions: { coreGap: 90, lvhvgap: 90, hvhvgap: 90 } };
  expect(applyCoreDimensionInputs(state).rectCoilDimensions).toEqual({ coreGap: 4, lvhvgap: 12, hvhvgap: 20 });
});
test("blank rectangular clearances clear overrides instead of using circular values", () => {
  const result = applyCoreDimensionInputs({ ...response, rectCoilDimensions: { coreGap: "", lvhvgap: "", hvhvgap: "" }, coilDimensions: { coreGap: 90 } });
  expect(result.rectCoilDimensions).toEqual({ coreGap: null, lvhvgap: null, hvhvgap: null });
});
test("normalizes legacy response aliases without sending conflicting keys", () => {
  expect(editableCoilDimensions({ ...response, rectCoilDimensions: { lVHVGap: 7, hVHVGap: 8, lvhvgap: "12" } }))
    .toEqual({ lvhvgap: "12", hvhvgap: 8 });
});
test("older saved designs migrate clearances when rectangular object is absent", () => {
  expect(applyCoreDimensionInputs({ ...response, coilDimensions: { coreGap: 3, lvhvgap: 7, hvhvgap: 8 } }).rectCoilDimensions)
    .toEqual({ coreGap: 3, lvhvgap: 7, hvhvgap: 8 });
});
test("reset clears derived rectangular geometry and preserves clearances when requested", () => {
  const state = { ...response, rectCoilDimensions: { coreGap: 4, lvhvgap: 12, hvhvgap: 20, hvOdDepth: 300 } };
  expect(resetCoilDimensions(state, {})).toEqual({ coreGap: 4, lvhvgap: 12, hvhvgap: 20 });
  expect(resetCoilDimensions(state, {}, false)).toEqual({});
});

test("new rectangular payload never copies circular geometry into the rectangular request", () => {
  const result = applyCoreDimensionInputs({ ...response,
    coilDimensions: { coreDia: "", lvid: "", lvod: "", hvid: "", hvod: "", hvradial: "", coreGap: "", lvhvgap: "", hvhvgap: "" } });
  expect(result.rectCoilDimensions).toEqual({ coreGap: null, lvhvgap: null, hvhvgap: null });
});
test("repairs previously saved rectangular payloads containing circular-only keys", () => {
  const result = applyCoreDimensionInputs({ ...response, rectCoilDimensions: {
    coreDia: "", lvid: "", lvod: "", hvid: "", hvod: "", hvradial: "", coreGap: null,
    lvhvgap: null, hvhvgap: null, coreWidth: 80, coreDepth: 160, hvOdDepth: 260 } });
  expect(result.rectCoilDimensions).toEqual({ coreGap: null, lvhvgap: null, hvhvgap: null,
    coreWidth: 80, coreDepth: 160, hvOdDepth: 260 });
});
