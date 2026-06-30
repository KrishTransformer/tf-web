import { buildMultiWindingPayload } from "./multiWindingPayload";

describe("buildMultiWindingPayload", () => {
  test("maps the minimum five-winding payload contract", () => {
    const payload = buildMultiWindingPayload({
      windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
      kVA: "100.9",
      kValue: null,
      vectorGroup: "Dyn11",
      primaryVoltage: 433,
      secondaryVoltage: 11000,
      tapStepsPercent: 2.5,
      tapStepsPositive: 2,
      tapStepsNegative: 2,
      lvWindingType: "LAYERDISC",
      hvWindingType: "DISC",
      corseWindingType: "XOVER",
      fineWindingType: "FOIL",
      outerWindingType: "DISC",
      cost: {
        copperCostPerKg: 900,
      },
      part2Windings: {
        outer: {
          turnsPerPhase: 100,
        },
      },
      multiCoilDimensions: {
        gaps: {
          hvMainToCorseGap: 8,
          corseToFineGap: 6,
          fineToOuterGap: 10,
        },
      },
      coilDimensions: {
        coreGap: 5,
        lvhvgap: 10,
      },
    });

    expect(payload).toEqual({
      designId: null,
      windingSelection: "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
      kVA: 100,
      kValue: 0.45,
      vectorGroup: "Dyn11",
      lowVoltage: 433,
      highVoltage: 11000,
      tapStepsPercentage: 2.5,
      tapStepPositive: 2,
      tapStepNegative: 2,
      lvWindingType: "LayerDisc",
      hvWindingType: "Disc",
      corseWindingType: "X-Over",
      fineWindingType: "Foil",
      outerWindingType: "Disc",
      outerWindings: {
        turnsPerPhase: 100,
      },
      cost: {
        copperCostPerKg: 900,
        aluminiumCostPerKg: 235,
        coreCostPerKg: 250,
        steelCostPerKg: 90,
        oilCostPerKg: 80,
        insulationCostPerKg: 170,
        radiatorCostPerKg: 200,
      },
      radialGaps: {
        coreToLv: 5,
        lvToHv: 10,
        lvToCoarse: 8,
        fineToCoarse: 6,
        fineToOuter: 10,
      },
    });
  });

  test("prefers explicit outerWindings turnsPerPhase when present", () => {
    const payload = buildMultiWindingPayload({
      outerWindings: {
        turnsPerPhase: 123,
      },
      part2Windings: {
        outer: {
          turnsPerPhase: 100,
        },
      },
    });

    expect(payload.outerWindings).toEqual({ turnsPerPhase: 123 });
  });

  test("casts edited voltages to integers before sending", () => {
    const payload = buildMultiWindingPayload({
      primaryVoltage: "433",
      secondaryVoltage: "11000",
    });

    expect(payload.lowVoltage).toBe(433);
    expect(payload.highVoltage).toBe(11000);
  });

  test("sends null for fields without a value", () => {
    const payload = buildMultiWindingPayload({
      designId: "",
      windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
      outerWindings: {},
      radialGaps: {},
    });

    expect(payload).toEqual({
      designId: null,
      windingSelection: "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
      kVA: null,
      kValue: 0.45,
      vectorGroup: null,
      lowVoltage: null,
      highVoltage: null,
      tapStepsPercentage: null,
      tapStepPositive: null,
      tapStepNegative: null,
      lvWindingType: null,
      hvWindingType: null,
      corseWindingType: null,
      fineWindingType: null,
      outerWindingType: null,
      outerWindings: {
        turnsPerPhase: null,
      },
      cost: {
        copperCostPerKg: 850,
        aluminiumCostPerKg: 235,
        coreCostPerKg: 250,
        steelCostPerKg: 90,
        oilCostPerKg: 80,
        insulationCostPerKg: 170,
        radiatorCostPerKg: 200,
      },
      radialGaps: {
        coreToLv: null,
        lvToHv: null,
        lvToCoarse: null,
        fineToCoarse: null,
        fineToOuter: null,
      },
    });
  });
});
