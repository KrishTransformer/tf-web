import { buildMultiWindingPayload } from "./multiWindingPayload";

describe("buildMultiWindingPayload", () => {
  test("maps the backend-shaped five-winding payload contract", () => {
    const payload = buildMultiWindingPayload(
      {
        windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
        kVA: "100.9",
        kValue: null,
        fluxDensity: "1.6888",
        vectorGroup: "Dyn11",
        primaryVoltage: 433,
        secondaryVoltage: 11000,
        tapStepsPercent: 2.5,
        tapStepsPositive: 2,
        tapStepsNegative: "2",
        lvCurrentDensity: "4.24",
        hvCurrentDensity: "3.95",
        corseCurrentDensity: "3.5",
        fineCurrentDensity: "3.25",
        outerCurrentDensity: "3.1",
        lvWindingType: "LAYERDISC",
        hvWindingType: "DISC",
        corseWindingType: "XOVER",
        fineWindingType: "FOIL",
        outerWindingType: "DISC",
        core: {
          coreDia: "520.9",
          limbHt: "1140",
        },
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
      },
      {
        outerWindings: { turnsPerPhase: true },
      },
      { coreDia: true, limbHt: true }
    );

    expect(payload).toEqual(
      expect.objectContaining({
        designId: null,
        windingSelection: "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
        kVA: 100,
        kValue: 0.45,
        fluxDensity: 1.6888,
        vectorGroup: "Dyn11",
        lowVoltage: 433,
        highVoltage: 11000,
        tapStepsPercentage: 2.5,
        tapStepPositive: 2,
        tapStepNegative: 2,
        lvWindingType: "LAYERDISC",
        hvWindingType: "DISC",
        corseWindingType: "XOVER",
        fineWindingType: "FOIL",
        outerWindingType: "DISC",
        lvCurrentDensity: 4.24,
        hvCurrentDensity: 3.95,
        corseCurrentDensity: 3.5,
        fineCurrentDensity: 3.25,
        outerCurrentDensity: 3.1,
        core: {
          coreDia: 520,
          limbHt: 1140,
        },
        outerWindings: expect.objectContaining({
          turnsPerPhase: 100,
        }),
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
          hvToCorse: 8,
          corseToFine: 6,
          fineToOuter: 10,
        },
      })
    );
  });

  test("maps editable winding fields into backend winding blocks when locked", () => {
    const payload = buildMultiWindingPayload(
      {
        windingConfiguration: "3_WDG_LV_HV_MAIN_OUTER",
        hvWindingType: "DISC",
        part2Windings: {
          lv: {
            condBreadth: "6.2",
            condHeight: "2.8",
            condInsulation: "0.4",
            interLayerInsulation: "1",
            ducts: "1",
            ductSize: "5",
            radialParallelCond: "2",
            axialParallelCond: "1",
            isConductorRound: false,
            isEnamel: false,
            endClearances: "65",
          },
          hvMain: {
            condBreadth: "5.4",
            condHeight: "2.4",
            conductorDiameter: "5.4",
            condInsulation: "0.5",
            interLayerInsulation: "1",
            ducts: "1",
            ductSize: "4",
            discDuctSize: "7",
            radialParallelCond: "3",
            axialParallelCond: "1",
            isConductorRound: true,
            isEnamel: true,
            endClearances: "70",
          },
          outer: {
            turnsPerPhase: "100",
          },
        },
      },
      {
        lv: {
          conductorSizes: true,
          noInParallel: true,
        },
        hvMain: {
          conductorSizes: true,
          noInParallel: true,
        },
        outer: {
          turnsPerPhase: true,
        },
      }
    );

    expect(payload.lvWindings).toEqual({
      conductorSizes: "6.2 L X 2.8 B",
      condInsulation: 0.4,
      noInParallel: "Rad 2 X Axi 1 = 2",
      endClearances: 65,
      ducts: 1,
      ductSize: 5,
      interLayerInsulation: 1,
      radialParallelCond: 2,
      axialParallelCond: 1,
      condBreadth: 6.2,
      condHeight: 2.8,
      isConductorRound: false,
      isEnamel: false,
    });
    expect(payload.hvWindings).toEqual({
      conductorSizes: "Round 5.4",
      condInsulation: 0.5,
      noInParallel: "Rad 3 X Axi 1 = 3",
      endClearances: 70,
      ducts: 1,
      ductSize: 7,
      interLayerInsulation: 1,
      radialParallelCond: 3,
      axialParallelCond: 1,
      condBreadth: 5.4,
      condHeight: 2.4,
      conductorDiameter: 5.4,
      isConductorRound: true,
      isEnamel: true,
    });
    expect(payload.outerWindings).toEqual(
      expect.objectContaining({
        turnsPerPhase: 100,
      })
    );
    expect(payload).not.toHaveProperty("fineWindings");
    expect(payload).not.toHaveProperty("fineWindingType");
    expect(payload).not.toHaveProperty("fineCurrentDensity");
  });

  test("sends unlocked conductor and parallel fields as null", () => {
    const payload = buildMultiWindingPayload(
      {
        part2Windings: {
          lv: {
            condBreadth: "6.2",
            condHeight: "2.8",
            radialParallelCond: "2",
            axialParallelCond: "1",
          },
        },
      }
    );

    expect(payload.lvWindings).toEqual({
      isEnamel: false,
    });
  });

  test("sends turns only when the native winding lock is enabled", () => {
    const formState = {
      part2Windings: {
        lv: { turnsPerPhase: "99" },
      },
    };

    const unlockedPayload = buildMultiWindingPayload(formState);
    const lockedPayload = buildMultiWindingPayload(formState, {
      lvWindings: { turnsPerPhase: true },
    });

    expect(unlockedPayload.lvWindings).not.toHaveProperty("turnsPerPhase");
    expect(lockedPayload.lvWindings.turnsPerPhase).toBe(99);
    expect(lockedPayload.lockedAttributes.lvWindings.turnsPerPhase).toBe(true);
    expect(lockedPayload.lockedAttributes.hvWindings.turnsPerPhase).toBe(false);
  });

  test("normalizes grouped conductor locks and releases parallel locks for a fixed core", () => {
    const payload = buildMultiWindingPayload(
      {
        core: { coreDia: "250", limbHt: "900" },
        part2Windings: {
          lv: {
            condBreadth: "6.2",
            condHeight: "2.8",
            radialParallelCond: "2",
            axialParallelCond: "1",
          },
        },
      },
      {
        coreLock: { coreDia: true, limbHt: true },
        lvWindings: { conductorSizes: true, noInParallel: true },
      }
    );

    expect(payload.lockedAttributes.lvWindings.conductorSizes).toBe(true);
    expect(payload.lockedAttributes.lvWindings.condBreadth).toBe(true);
    expect(payload.lockedAttributes.lvWindings.condHeight).toBe(true);
    expect(payload.lockedAttributes.lvWindings.noInParallel).toBe(false);
    expect(payload.lvWindings).not.toHaveProperty("noInParallel");
    expect(payload.lvWindings.condBreadth).toBe(6.2);
    expect(payload.lvWindings.condHeight).toBe(2.8);
  });

  test("casts edited voltages to integers before sending", () => {
    const payload = buildMultiWindingPayload({
      primaryVoltage: "433",
      secondaryVoltage: "11000",
    });

    expect(payload.lowVoltage).toBe(433);
    expect(payload.highVoltage).toBe(11000);
  });

  test("casts tapStepNegative to an integer before sending", () => {
    const payload = buildMultiWindingPayload({
      tapStepsNegative: "3",
    });

    expect(payload.tapStepNegative).toBe(3);
  });

  test("casts tap step percentage and positive step to backend number types", () => {
    const payload = buildMultiWindingPayload({
      tapStepsPercent: "1.25",
      tapStepsPositive: "4",
    });

    expect(payload.tapStepsPercentage).toBe(1.25);
    expect(payload.tapStepPositive).toBe(4);
  });

  test("casts fluxDensity to a number before sending", () => {
    const payload = buildMultiWindingPayload({
      fluxDensity: "1.7333",
    });

    expect(payload.fluxDensity).toBe(1.7333);
  });

  test("casts current density values to numbers before sending", () => {
    const payload = buildMultiWindingPayload({
      windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
      lvCurrentDensity: "4.24",
      hvCurrentDensity: "3.8",
      corseCurrentDensity: "3.2",
      fineCurrentDensity: "3.1",
      outerCurrentDensity: "2.95",
    });

    expect(payload.lvCurrentDensity).toBe(4.24);
    expect(payload.hvCurrentDensity).toBe(3.8);
    expect(payload.corseCurrentDensity).toBe(3.2);
    expect(payload.fineCurrentDensity).toBe(3.1);
    expect(payload.outerCurrentDensity).toBe(2.95);
  });

  test("casts coreDia and limbHt to integers before sending", () => {
    const payload = buildMultiWindingPayload(
      {
        core: {
          coreDia: "510",
          limbHt: "1180.6",
        },
      },
      {},
      { coreDia: true, limbHt: true }
    );

    expect(payload.core).toEqual({
      coreDia: 510,
      limbHt: 1180,
    });
  });

  test("sends null for fields without a value", () => {
    const payload = buildMultiWindingPayload({
      designId: "",
      windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
      radialGaps: {},
    });

    expect(payload).toEqual(
      expect.objectContaining({
        designId: null,
        windingSelection: "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
        kVA: null,
        kValue: 0.45,
        fluxDensity: null,
        vectorGroup: null,
        lowVoltage: null,
        highVoltage: null,
        tapStepsPercentage: null,
        tapStepPositive: null,
        tapStepNegative: null,
        core: {
          coreDia: null,
          limbHt: null,
        },
        lvWindings: {
          isEnamel: false,
        },
        hvWindings: {
          isEnamel: false,
        },
        corseWindings: {
          isEnamel: false,
        },
        fineWindings: {
          isEnamel: false,
        },
        outerWindings: {
          isEnamel: false,
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
          hvToCorse: null,
          corseToFine: null,
          fineToOuter: null,
        },
      })
    );
    expect(payload).not.toHaveProperty("lvWindingType");
    expect(payload).not.toHaveProperty("hvWindingType");
    expect(payload).not.toHaveProperty("corseWindingType");
    expect(payload).not.toHaveProperty("fineWindingType");
    expect(payload).not.toHaveProperty("outerWindingType");
    expect(payload).not.toHaveProperty("lvCurrentDensity");
    expect(payload).not.toHaveProperty("hvCurrentDensity");
    expect(payload).not.toHaveProperty("corseCurrentDensity");
    expect(payload).not.toHaveProperty("fineCurrentDensity");
    expect(payload).not.toHaveProperty("outerCurrentDensity");
  });

  test("filters radial gaps to the selected winding configuration", () => {
    const payload = buildMultiWindingPayload({
      windingConfiguration: "4_WDG_LV_HV_MAIN_CORSE_OUTER",
      radialGaps: {
        coreToLv: 5,
        lvToHv: 10,
        hvToCorse: 8,
        corseToOuter: 12,
        corseToFine: 6,
        fineToOuter: 10,
      },
    });

    expect(payload.radialGaps).toEqual({
      coreToLv: 5,
      lvToHv: 10,
      hvToCorse: 8,
      corseToOuter: 12,
    });
  });

  test("strips stale fine winding fields for the 4-winding corse and outer configuration", () => {
    const payload = buildMultiWindingPayload({
      windingConfiguration: "4_WDG_LV_HV_MAIN_CORSE_OUTER",
      fineWindingType: "HELICAL",
      fineCurrentDensity: "3.63",
      part2Windings: {
        fine: {
          turnsPerPhase: "99",
        },
      },
    });

    expect(payload).not.toHaveProperty("fineWindingType");
    expect(payload).not.toHaveProperty("fineCurrentDensity");
    expect(payload).not.toHaveProperty("fineWindings");
  });

  test("sends unlocked core fields as null and locked core fields as values", () => {
    const unlockedPayload = buildMultiWindingPayload({
      core: {
        coreDia: "510",
        limbHt: "1180",
      },
    });
    const lockedPayload = buildMultiWindingPayload(
      {
        core: {
          coreDia: "510",
          limbHt: "1180",
        },
      },
      {},
      { coreDia: true, limbHt: false }
    );

    expect(unlockedPayload.core).toEqual({
      coreDia: null,
      limbHt: null,
    });
    expect(lockedPayload.core).toEqual({
      coreDia: 510,
      limbHt: null,
    });
  });
});
