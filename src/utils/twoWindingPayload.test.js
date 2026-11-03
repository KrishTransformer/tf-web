import { applyLvLayerInput } from "./twoWindingPayload";

test.each(["RECTANGULAR", "CIRCULAR"])("uses the displayed LV layer count for %s", (eTransBodyType) => {
  const payload = { eTransBodyType, lvNumberOfLayers: 2, innerWindings: { noOfLayers: "4" }, outerWindings: { noOfLayers: 20 } };
  const result = applyLvLayerInput(payload);
  expect(result.lvNumberOfLayers).toBe(4);
  expect(result.innerWindings.noOfLayers).toBe("4");
  expect(result.outerWindings.noOfLayers).toBe(20);
  expect(payload.lvNumberOfLayers).toBe(2);
});
test("keeps the numeric LV field value", () => {
  expect(applyLvLayerInput({ innerWindings: { noOfLayers: 3 } }).lvNumberOfLayers).toBe(3);
});
test.each(["", " ", null, undefined, "invalid"])("blank or invalid layer input %j does not send a stale root value", (noOfLayers) => {
  expect(applyLvLayerInput({ lvNumberOfLayers: 2, innerWindings: { noOfLayers } }).lvNumberOfLayers).toBeNull();
});
