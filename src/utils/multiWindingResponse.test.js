import { mapMultiWindingResponseToFormState } from "./multiWindingResponse";

describe("mapMultiWindingResponseToFormState", () => {
  test("preserves 2-winding-style defaults for unmapped multi-winding fields", () => {
    const formState = mapMultiWindingResponseToFormState({
      selectedCode: "2WDG",
      inputs: {},
      results: {},
    });

    expect(formState.windingConfiguration).toBe("2_WDG_LV_HV_MAIN");
    expect(formState.primaryVoltage).toBe(433);
    expect(formState.secondaryVoltage).toBe(11000);
    expect(formState.lowVoltage).toBe("");
    expect(formState.highVoltage).toBe("");
    expect(formState.corseVoltage).toBe("");
    expect(formState.fineVoltage).toBe("");
    expect(formState.outerVoltage).toBe("");
    expect(formState.lVConductorMaterial).toBe("Cu");
    expect(formState.hVConductorMaterial).toBe("Cu");
    expect(formState.corseConductorMaterial).toBe("Cu");
    expect(formState.corseWindingType).toBe("HELICAL");
    expect(formState.fineWindingType).toBe("HELICAL");
    expect(formState.outerWindingType).toBe("HELICAL");
    expect(formState.lvCurrentDensity).toBe("4.24");
    expect(formState.fineCurrentDensity).toBe("4.24");
    expect(formState.tapStepsPercent).toBe(2.5);
    expect(formState.tapStepsPositive).toBe(2);
    expect(formState.tapStepsNegative).toBe(2);
    expect(formState.fluxDensity).toBe(1.6888);
    expect(formState.vectorGroup).toBe("Dyn11");
    expect(formState.eTransCostType).toBe("ECONOMIC");
    expect(formState.eRadiatorType).toBe("RADIATOR");
    expect(formState.core.coreType).toBe("PRIME");
    expect(formState.core.coreMaterial).toBe("NipM4");
    expect(formState.lockedAttributes.innerWindings.noInParallel).toBe(false);
    expect(formState.comments.hvToHvClrComment).toBe("");
    expect(formState.multiCoilDimensions.gaps.hvMainToCorseGap).toBe("");
    expect(formState.part2Windings.lv.isEnamel).toBe(false);
    expect(formState.cost.copperCostPerKg).toBe(850);
    expect(formState.cost.aluminiumCostPerKg).toBe(235);
    expect(formState.cost.coreCostPerKg).toBe(250);
    expect(formState.cost.steelCostPerKg).toBe(90);
    expect(formState.cost.oilCostPerKg).toBe(80);
    expect(formState.cost.insulationCostPerKg).toBe(170);
    expect(formState.cost.radiatorCostPerKg).toBe(200);
  });

  test("handles null optional winding blocks for 2-winding responses", () => {
    const formState = mapMultiWindingResponseToFormState({
      selectedCode: "2WDG",
      inputs: {
        ratings: {
          kVA: 100,
          lowVoltage: 433,
          highVoltage: 11000,
        },
        windingModels: {
          lv: {
            conductorSizes: "9.1 L X 3.6 B",
          },
          hv: {
            conductorSizes: "Round 1.0",
          },
          corse: null,
          fine: null,
          outer: null,
        },
      },
      results: {
        phaseVoltages: {
          lv: 249,
          hvMain: 10450,
        },
        windingTypes: {
          lv: "HELICAL",
          hv: "HELICAL",
        },
        lvWinding: {
          insulatedWeight: 23.1,
        },
        hvWinding: {
          insulatedWeight: 32.6,
        },
        corseWinding: null,
        fineWinding: null,
        outerWinding: null,
      },
    });

    expect(formState.windingConfiguration).toBe("2_WDG_LV_HV_MAIN");
    expect(formState.lowVoltage).toBe(249);
    expect(formState.highVoltage).toBe(10450);
    expect(formState.part2Windings.corse.conductorSizes).toBe("");
    expect(formState.part2Windings.fine.turnsPerPhase).toBe("");
    expect(formState.part2Windings.outer.weightBareInsulated).toBe("");
    expect(formState.multiCost.conductors.corse.weight).toBe("");
    expect(formState.multiCost.conductors.outer.totalCost).toBe("");
  });

  test("maps a 5-winding backend response into the current multi-winding form state", () => {
    const formState = mapMultiWindingResponseToFormState({
      selectedCode: "5_WDG",
      inputs: {
        designId: "D-1",
        vectorGroup: "Dyn11",
        ratings: {
          kVA: 1000,
          kValue: 0.45,
          frequency: 50,
          fluxDensity: 1.7333,
          lowVoltage: 11000,
          highVoltage: 33000,
        },
        currentDensity: {
          lv: 4.24,
          hv: 4.24,
          corse: 4.24,
          fine: 4.24,
          outer: 4.24,
        },
        conductorMaterial: {
          lv: "COPPER",
          hv: "COPPER",
          corse: "COPPER",
          fine: "ALUMINIUM",
          outer: "COPPER",
        },
        tapSteps: {
          percentage: 2.5,
          positive: 2,
          negative: 2,
        },
        windingModels: {
          lv: { conductorSizes: "7.5 L X 1.8 B", tempGradDegC: 18 },
          hv: { conductorSizes: "4.4 L X 0.8 B", tempGradDegC: 33.4 },
          corse: { conductorSizes: "3.1 L X 1.0 B" },
          fine: { conductorSizes: "3.1 L X 1.0 B" },
          outer: { conductorSizes: "3.1 L X 1.0 B" },
        },
        windingTypes: {
          lv: "DISC",
          hv: "DISC",
          corse: "HELICAL",
          fine: "HELICAL",
          outer: "HELICAL",
        },
        cost: {
          copperCostPerKg: 850,
          aluminiumCostPerKg: 235,
        },
      },
      results: {
        revisedVoltsPerTurn: 14.208,
        phaseVoltages: {
          lv: 6351,
          hvMain: 31351,
          corse: 1,
          fine: 2476,
          outer: 826,
        },
        phaseVoltageDivision: {
          lv: 6350,
          hvMain: 31350,
          corse: 0,
          fine: 2475,
          outer: 825,
        },
        lossesAt50Percent: 4389,
        lossesAt100Percent: 12050,
        ez: {
          value: 5.99,
          limit: 5,
        },
        common: {
          buildFactor: 1.25,
          frequency: 50,
          kValue: 0.45,
          fluxDensity: 1.7333,
          vectorGroup: "Dyn11",
          ampereTurns: 23464,
          er: 1.05,
          ex: 5.9,
          ek: 5.99,
          wKgGrade: 1.3,
        },
        lvWinding: {
          ambientTemp: 50,
          windingTemp: 55,
          lvDiscDuctsSize: 3,
          insulatedWeight: 137.1,
          lvProcurementWeight: 139,
        },
        hvWinding: {
          turnsPerPhase: 2206,
          totalLoadLoss: 10915,
          insulatedWeight: 248.7,
          tapVoltages: [34650, 33825],
          tapCurrent: [9.62, 9.85],
        },
        corseWinding: {
          insulatedWeight: 0,
        },
        fineWinding: {
          insulatedWeight: 21.2,
        },
        outerWinding: {
          insulatedWeight: 7.5,
        },
        coilDimensions: {
          coreDia: 227,
          coreGap: 8,
          lVID: 243,
          lVRadial: 27,
          lVOD: 297,
          lVHVGap: 10,
          hVID: 317,
          hVRadial: 46,
          hVOD: 409,
          corseID: 425,
          corseRadial: 2,
          corseOD: 429,
          corseGap: 8,
          fineID: 441,
          fineRadial: 6,
          fineOD: 453,
          fineGap: 6,
          outerID: 473,
          outerRadial: 3,
          outerOD: 479,
          outerGap: 10,
          centerDistance: 495,
          activePartSize: "1469 L X 479 W X 974 H mm",
        },
        tankAndOil: {
          topOilTemperature: 29.3,
          tankLoss: 400,
          tankLength: 1570,
          tankWidth: 610,
          tankHeight: 1165,
          tankCapacity: 1116,
          tankDimension: "1570 L X 610 W X 1165 H mm",
          overallDimension: "3970 L X 10010 W X 2659 H mm",
          conservatorDia: 625,
          conservatorLength: 1860,
          coolingStatement: "L X W = 800 X 520 : 12 X 93",
          radiatorWidth: 520,
          conductorCost: 358190,
          capitalCost: 3029640,
        },
      },
    });

    expect(formState.windingConfiguration).toBe("5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER");
    expect(formState.primaryVoltage).toBe(11000);
    expect(formState.secondaryVoltage).toBe(33000);
    expect(formState.lowVoltage).toBe(6351);
    expect(formState.highVoltage).toBe(31351);
    expect(formState.corseVoltage).toBe(1);
    expect(formState.fineVoltage).toBe(2476);
    expect(formState.outerVoltage).toBe(826);
    expect(formState.fineConductorMaterial).toBe("Al");
    expect(formState.voltsPerTurn).toBe(14.208);
    expect(formState.coilDimensions).toEqual({
      coreDia: 227,
      coreGap: 8,
      activePartSize: "1469 L X 479 W X 974 H mm",
      lvid: 243,
      lvradial: 27,
      lvod: 297,
      lvhvgap: 10,
      hvid: 317,
      hvradial: 46,
      hvod: 409,
      hvhvgap: "",
      centerDistance: 495,
    });
    expect(formState.multiCoilDimensions.gaps).toEqual(
      expect.objectContaining({
        hvMainToCorseGap: 8,
        corseToFineGap: 6,
        fineToOuterGap: 10,
      })
    );
    expect(formState.part2Windings.lv.conductorSizes).toBe("7.5 L X 1.8 B");
    expect(formState.part2Windings.hvMain.turnsPerPhase).toBe(2206);
    expect(formState.cost.totalCondCost).toBe(358190);
    expect(formState.cost.capitalCost).toBe(3029640);
    expect(formState.tank.tankDimension).toBe("1570 L X 610 W X 1165 H mm");
    expect(formState.tankAndOilFormulas.coolingStatement).toBe("L X W = 800 X 520 : 12 X 93");
    expect(formState.calculationResponse.results.coilDimensions.outerOD).toBe(479);
  });
});
