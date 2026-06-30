import { initialState } from "../reducers/CalcReducer";
import { MULTI_WDG_DEFAULT_COST } from "../constants/MultiWindingDefaults";

const SELECTED_CODE_TO_CONFIGURATION = {
  "2WDG": "2_WDG_LV_HV_MAIN",
  "2_WDG": "2_WDG_LV_HV_MAIN",
  "3_WDG": "3_WDG_LV_HV_MAIN_OUTER",
  "4_WDG_C": "4_WDG_LV_HV_MAIN_CORSE_OUTER",
  "4_WDG_F": "4_WDG_LV_HV_MAIN_FINE_OUTER",
  "5_WDG": "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
};

const roundIfNumber = (value, digits = 3) =>
  typeof value === "number" ? Number(value.toFixed(digits)) : value;

const pickDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const asObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};

const normalizeUiConductorMaterial = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === "COPPER") {
    return "Cu";
  }

  if (value === "ALUMINIUM") {
    return "Al";
  }

  return value || "";
};

const formatWeightPair = (bareWeight, insulatedWeight) => {
  if (bareWeight === undefined && insulatedWeight === undefined) {
    return "";
  }

  return `${bareWeight ?? ""} / ${insulatedWeight ?? ""}`.trim();
};

const formatParallel = (radialParallelCond, axialParallelCond) => {
  if (radialParallelCond === undefined && axialParallelCond === undefined) {
    return "";
  }

  const radial = radialParallelCond ?? "";
  const axial = axialParallelCond ?? "";
  const total =
    Number.isFinite(Number(radialParallelCond)) && Number.isFinite(Number(axialParallelCond))
      ? Number(radialParallelCond) * Number(axialParallelCond)
      : "";

  return `Rad ${radial} X Axi ${axial} = ${total}`;
};

const buildPart2Winding = (inputModel = {}, resultModel = {}, extra = {}) => {
  const normalizedInputModel = asObject(inputModel);
  const normalizedResultModel = asObject(resultModel);

  return ({
  turnsPerPhase: normalizedInputModel.turnsPerPhase ?? normalizedResultModel.turnsPerPhase ?? "",
  phaseCurrent: normalizedInputModel.phaseCurrent ?? normalizedResultModel.phaseCurrent ?? "",
  currentDensity: normalizedInputModel.currentDensity ?? normalizedResultModel.currentDensity ?? "",
  condCrossSec: normalizedInputModel.condCrossSec ?? normalizedResultModel.condCrossSec ?? "",
  conductorSizes:
    normalizedInputModel.conductorSizes ??
    (normalizedResultModel.breadth && normalizedResultModel.height
      ? `${normalizedResultModel.breadth} L X ${normalizedResultModel.height} B`
      : ""),
  condInsulation: normalizedInputModel.condInsulation ?? normalizedResultModel.conductorInsulation ?? "",
  noInParallel:
    normalizedInputModel.noInParallel ??
    formatParallel(normalizedResultModel.radialParallelCond, normalizedResultModel.axialParallelCond),
  windingLength: normalizedInputModel.windingLength ?? normalizedResultModel.windingLength ?? "",
  noOfLayers: normalizedInputModel.noOfLayers ?? normalizedResultModel.noOfLayers ?? "",
  interLayerInsulation:
    normalizedInputModel.interLayerInsulation ?? normalizedResultModel.interLayerInsulation ?? "",
  noOfDuctsWidth:
    normalizedInputModel.noOfDuctsWidth ??
    (normalizedResultModel.ducts !== undefined || normalizedResultModel.ductSize !== undefined
      ? `${normalizedResultModel.ducts ?? ""} / ${normalizedResultModel.ductSize ?? ""}`
      : ""),
  discDuctSize: extra.discDuctSize ?? normalizedInputModel.discDuctSize ?? "",
  turnsLayers: normalizedInputModel.turnsLayers ?? "",
  endClearances: normalizedInputModel.endClearances ?? normalizedResultModel.endClearance ?? "",
  eddyStrayLoss: normalizedInputModel.eddyStrayLoss ?? normalizedResultModel.strayLoss ?? "",
  tempGradDegC: normalizedInputModel.tempGradDegC ?? normalizedResultModel.gradient ?? "",
  weightBareInsulated:
    normalizedInputModel.weightBareInsulated ??
    formatWeightPair(normalizedResultModel.bareWeight, normalizedResultModel.insulatedWeight),
  loadLoss: normalizedInputModel.loadLoss ?? normalizedResultModel.loadLoss ?? "",
  radialParallelCond:
    normalizedInputModel.radialParallelCond ?? normalizedResultModel.radialParallelCond ?? "",
  axialParallelCond:
    normalizedInputModel.axialParallelCond ?? normalizedResultModel.axialParallelCond ?? "",
  condBreadth: normalizedInputModel.condBreadth ?? normalizedResultModel.breadth ?? "",
  condHeight: normalizedInputModel.condHeight ?? normalizedResultModel.height ?? "",
  conductorDiameter: normalizedInputModel.conductorDiameter ?? normalizedResultModel.conductorDiameter ?? "",
  isConductorRound: normalizedInputModel.isConductorRound ?? normalizedResultModel.isConductorRound ?? false,
  isEnamel: normalizedInputModel.isEnamel ?? normalizedResultModel.isEnamel ?? false,
  });
};

const setConfiguredGaps = (configuration, resultCoilDimensions = {}) => {
  const gaps = {};

  if (configuration === "3_WDG_LV_HV_MAIN_OUTER") {
    gaps.hvMainToOuterGap = resultCoilDimensions.hVHVGap ?? "";
    return gaps;
  }

  if (configuration === "4_WDG_LV_HV_MAIN_CORSE_OUTER") {
    gaps.hvMainToCorseGap = resultCoilDimensions.corseGap ?? "";
    gaps.corseToOuterGap = resultCoilDimensions.outerGap ?? "";
    return gaps;
  }

  if (configuration === "4_WDG_LV_HV_MAIN_FINE_OUTER") {
    gaps.hvMainToFineGap = resultCoilDimensions.fineGap ?? "";
    gaps.fineToOuterGap = resultCoilDimensions.outerGap ?? "";
    return gaps;
  }

  if (configuration === "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER") {
    gaps.hvMainToCorseGap = resultCoilDimensions.corseGap ?? "";
    gaps.corseToFineGap = resultCoilDimensions.fineGap ?? "";
    gaps.fineToOuterGap = resultCoilDimensions.outerGap ?? "";
    return gaps;
  }

  return gaps;
};

const computeConductorCost = (weight, rate) => {
  if (!Number.isFinite(Number(weight)) || !Number.isFinite(Number(rate))) {
    return "";
  }

  return roundIfNumber(Number(weight) * Number(rate), 2);
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const deepMerge = (target, source) => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  const merged = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (sourceValue === undefined) {
      return;
    }

    if (Array.isArray(sourceValue)) {
      merged[key] = sourceValue;
      return;
    }

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      merged[key] = deepMerge(targetValue, sourceValue);
      return;
    }

    merged[key] = sourceValue;
  });

  return merged;
};

const createDefaultMultiWindingData = () =>
  JSON.parse(JSON.stringify(initialState.multiWindings.data));

export const mapMultiWindingResponseToFormState = (responseData = {}) => {
  const inputs = responseData.inputs || {};
  const results = responseData.results || {};
  const ratings = inputs.ratings || {};
  const currentDensity = inputs.currentDensity || {};
  const conductorMaterial = inputs.conductorMaterial || {};
  const tapSteps = inputs.tapSteps || {};
  const windingModels = asObject(inputs.windingModels);
  const resultCoilDimensions = results.coilDimensions || {};
  const tankAndOil = results.tankAndOil || {};
  const common = results.common || {};
  const lvWinding = asObject(results.lvWinding);
  const hvWinding = asObject(results.hvWinding);
  const corseWinding = asObject(results.corseWinding);
  const fineWinding = asObject(results.fineWinding);
  const outerWinding = asObject(results.outerWinding);
  const configuration =
    SELECTED_CODE_TO_CONFIGURATION[responseData.selectedCode] ||
    "2_WDG_LV_HV_MAIN";
  const copperRate =
    inputs.cost?.copperCostPerKg ?? MULTI_WDG_DEFAULT_COST.copperCostPerKg;
  const aluminiumRate =
    inputs.cost?.aluminiumCostPerKg ?? MULTI_WDG_DEFAULT_COST.aluminiumCostPerKg;

  const getRateForMaterial = (material) =>
    normalizeUiConductorMaterial(material) === "Al" ? aluminiumRate : copperRate;

  return deepMerge(createDefaultMultiWindingData(), {
    designId: pickDefined(inputs.designId, ""),
    windingConfiguration: configuration,
    primaryVoltage: pickDefined(ratings.lowVoltage),
    secondaryVoltage: pickDefined(ratings.highVoltage),
    lowVoltage: pickDefined(
      results.phaseVoltages?.lv,
      results.phaseVoltageDivision?.lv,
      lvWinding.voltsPerPhase
    ),
    highVoltage: pickDefined(
      results.phaseVoltages?.hvMain,
      results.phaseVoltageDivision?.hvMain,
      hvWinding.voltsPerPhase
    ),
    corseVoltage: pickDefined(
      results.phaseVoltages?.corse,
      results.phaseVoltageDivision?.corse,
      corseWinding.voltsPerPhase
    ),
    fineVoltage: pickDefined(
      results.phaseVoltages?.fine,
      results.phaseVoltageDivision?.fine,
      fineWinding.voltsPerPhase
    ),
    outerVoltage: pickDefined(
      results.phaseVoltages?.outer,
      results.phaseVoltageDivision?.outer,
      outerWinding.voltsPerPhase
    ),
    kVA: pickDefined(ratings.kVA),
    kValue: pickDefined(ratings.kValue, common.kValue),
    frequency: pickDefined(ratings.frequency, common.frequency),
    fluxDensity: pickDefined(ratings.fluxDensity, common.fluxDensity),
    vectorGroup: pickDefined(inputs.vectorGroup, common.vectorGroup),
    tapStepsPercent: pickDefined(tapSteps.percentage),
    tapStepsPositive: pickDefined(tapSteps.positive),
    tapStepsNegative: pickDefined(tapSteps.negative),
    lvCurrentDensity: pickDefined(currentDensity.lv),
    hvCurrentDensity: pickDefined(currentDensity.hv),
    fineCurrentDensity: pickDefined(currentDensity.fine),
    corseCurrentDensity: pickDefined(currentDensity.corse),
    outerCurrentDensity: pickDefined(currentDensity.outer),
    lVConductorMaterial: pickDefined(normalizeUiConductorMaterial(conductorMaterial.lv)),
    hVConductorMaterial: pickDefined(normalizeUiConductorMaterial(conductorMaterial.hv)),
    fineConductorMaterial: pickDefined(normalizeUiConductorMaterial(conductorMaterial.fine)),
    corseConductorMaterial: pickDefined(normalizeUiConductorMaterial(conductorMaterial.corse)),
    outerConductorMaterial: pickDefined(normalizeUiConductorMaterial(conductorMaterial.outer)),
    lvWindingType: pickDefined(results.windingTypes?.lv, inputs.windingTypes?.lv),
    hvWindingType: pickDefined(results.windingTypes?.hv, inputs.windingTypes?.hv),
    corseWindingType: pickDefined(results.windingTypes?.corse, inputs.windingTypes?.corse),
    fineWindingType: pickDefined(results.windingTypes?.fine, inputs.windingTypes?.fine),
    outerWindingType: pickDefined(results.windingTypes?.outer, inputs.windingTypes?.outer),
    dryType: pickDefined(lvWinding.dryType),
    dryTempClass: pickDefined(lvWinding.dryTempClass),
    eTransCostType: pickDefined(lvWinding.transCostType),
    buildFactor: pickDefined(common.buildFactor),
    limitEz: pickDefined(results.ez?.limit),
    ez: pickDefined(results.ez?.value, common.ek),
    loadLoss: pickDefined(hvWinding.totalLoadLoss),
    coreLoss: pickDefined(
      results.nlCurrentPercentage !== undefined
        ? roundIfNumber(results.nlCurrentPercentage, 2)
        : undefined
    ),
    lossesAt50Percent: pickDefined(results.lossesAt50Percent),
    lossesAt100Percent: pickDefined(results.lossesAt100Percent),
    voltsPerTurn: pickDefined(results.revisedVoltsPerTurn, results.voltsPerTurn),
    ambientTemp: pickDefined(lvWinding.ambientTemp),
    windingTemp: pickDefined(lvWinding.windingTemp),
    topOilTemp: pickDefined(tankAndOil.topOilTemperature),
    eRadiatorType: pickDefined(inputs.eRadiatorType),
    radiatorWidth: pickDefined(tankAndOil.radiatorWidth),
    core: {
      ...(results.core || inputs.core || {}),
      area: results.core?.area ?? inputs.core?.area ?? "",
    },
    commonFormulas: {
      ampereTurns: common.ampereTurns ?? "",
      er: results.impedance?.er ?? common.er ?? "",
      ex: results.impedance?.ex ?? common.ex ?? "",
      ek: results.impedance?.ek ?? common.ek ?? "",
      l: results.impedance?.l ?? common.l ?? "",
      b: results.impedance?.b ?? common.b ?? "",
      ls: results.impedance?.ls ?? common.ls ?? "",
    },
    hvFormulas: {
      specificLoss: common.wKgGrade ?? inputs.core?.wKgGrade ?? "",
      centerDistance: resultCoilDimensions.centerDistance ?? results.core?.cenDist ?? "",
      hvDiscDuctsSize: hvWinding.model?.ductSize ?? hvWinding.ductSize ?? "",
      tapVoltages: hvWinding.tapVoltages || [],
      tapCurrent: hvWinding.tapCurrent || [],
      hvTurnsPerPhase: hvWinding.turnsPerPhase ?? "",
      turnsPerTap: hvWinding.hvTurnsPerTap ?? "",
      totalLoadLoss: hvWinding.totalLoadLoss ?? "",
      hvHvGap: resultCoilDimensions.hVHVGap ?? "",
      kW55: tankAndOil.kw55 ?? "",
    },
    lvFormulas: {
      revisedFluxDensity: lvWinding.revisedFluxDensity ?? "",
      lvConnectionWeight: tankAndOil.lvConnectionWeight ?? "",
      lvProcurementWeight: lvWinding.lvProcurementWeight ?? "",
      lvCurrentPerPhase: results.lvCurrentPerPhase ?? lvWinding.lvCurrentPerPhase ?? "",
      lvDiscDuctsSize: lvWinding.lvDiscDuctsSize ?? "",
      lvGradient: lvWinding.lvGradient ?? "",
      lvTransposition: lvWinding.lvTransposition ?? "",
    },
    tank: {
      tankLoss: tankAndOil.tankLoss ?? inputs.tank?.tankLoss ?? "",
      wdgToTankGap: tankAndOil.wdgTankGap ?? inputs.tank?.wdgToTankGap ?? "",
      connectionGap: tankAndOil.connectionGap ?? inputs.tank?.connectionGap ?? "",
      topYokeToCoverGap:
        tankAndOil.topYokeCoverGap ?? inputs.tank?.topYokeToCoverGap ?? "",
      tankLength: tankAndOil.tankLength ?? "",
      tankWidth: tankAndOil.tankWidth ?? "",
      tankHeight: tankAndOil.tankHeight ?? "",
      tankCapacity: tankAndOil.tankCapacity ?? "",
      tankDimension: tankAndOil.tankDimension ?? "",
      overallDimension: tankAndOil.overallDimension ?? "",
    },
    tankAndOilFormulas: {
      coolingStatement: tankAndOil.coolingStatement ?? "",
      conservatorDia: tankAndOil.conservatorDia ?? "",
      conservatorLength: tankAndOil.conservatorLength ?? "",
      wdgTankGap: tankAndOil.wdgTankGap ?? "",
      connectionGap: tankAndOil.connectionGap ?? "",
      topYokeCoverGap: tankAndOil.topYokeCoverGap ?? "",
      totalConductorWeight: tankAndOil.totalConductorWeight ?? "",
      totalSteelWeight: tankAndOil.totalSteelWeight ?? "",
      totalOil: tankAndOil.totalOil ?? "",
      insulationWeight: tankAndOil.insulationWeight ?? "",
      totalRadiatorWeight: tankAndOil.totalRadiatorWeight ?? "",
      weightOfTankAndAcc: tankAndOil.weightOfTankAndAcc ?? "",
      totalRadiatorCost: tankAndOil.radiatorCost ?? "",
      radiatorWidth: tankAndOil.radiatorWidth ?? "",
    },
    coilDimensions: {
      coreDia: resultCoilDimensions.coreDia ?? "",
      coreGap: resultCoilDimensions.coreGap ?? "",
      activePartSize: resultCoilDimensions.activePartSize ?? "",
      lvid: resultCoilDimensions.lVID ?? "",
      lvradial: resultCoilDimensions.lVRadial ?? "",
      lvod: resultCoilDimensions.lVOD ?? "",
      lvhvgap: resultCoilDimensions.lVHVGap ?? "",
      hvid: resultCoilDimensions.hVID ?? "",
      hvradial: resultCoilDimensions.hVRadial ?? "",
      hvod: resultCoilDimensions.hVOD ?? "",
      hvhvgap: resultCoilDimensions.hVHVGap ?? "",
      centerDistance: resultCoilDimensions.centerDistance ?? "",
    },
    multiCoilDimensions: {
      corse: {
        id: resultCoilDimensions.corseID ?? "",
        radial: resultCoilDimensions.corseRadial ?? "",
        od: resultCoilDimensions.corseOD ?? "",
      },
      fine: {
        id: resultCoilDimensions.fineID ?? "",
        radial: resultCoilDimensions.fineRadial ?? "",
        od: resultCoilDimensions.fineOD ?? "",
      },
      outer: {
        id: resultCoilDimensions.outerID ?? "",
        radial: resultCoilDimensions.outerRadial ?? "",
        od: resultCoilDimensions.outerOD ?? "",
      },
      gaps: setConfiguredGaps(configuration, resultCoilDimensions),
    },
    part2Windings: {
      lv: buildPart2Winding(windingModels.lv, lvWinding, {
        discDuctSize: lvWinding.lvDiscDuctsSize ?? "",
      }),
      hvMain: buildPart2Winding(windingModels.hv, hvWinding, {
        discDuctSize: hvWinding.hvDiscDuctsSize ?? hvWinding.model?.ductSize ?? "",
      }),
      corse: buildPart2Winding(windingModels.corse, corseWinding),
      fine: buildPart2Winding(windingModels.fine, fineWinding),
      outer: buildPart2Winding(windingModels.outer, outerWinding),
    },
    innerWindings: {
      discDuctSize: lvWinding.lvDiscDuctsSize ?? "",
    },
    outerWindings: {
      discDuctSize: hvWinding.hvDiscDuctsSize ?? hvWinding.model?.ductSize ?? "",
    },
    multiCost: {
      conductors: {
        lv: {
          weight: lvWinding.insulatedWeight ?? windingModels.lv?.insulatedWeight ?? "",
          totalCost: computeConductorCost(
            lvWinding.insulatedWeight ?? windingModels.lv?.insulatedWeight,
            getRateForMaterial(conductorMaterial.lv)
          ),
        },
        hvMain: {
          weight: hvWinding.insulatedWeight ?? windingModels.hv?.insulatedWeight ?? "",
          totalCost: computeConductorCost(
            hvWinding.insulatedWeight ?? windingModels.hv?.insulatedWeight,
            getRateForMaterial(conductorMaterial.hv)
          ),
        },
        corse: {
          weight: corseWinding.insulatedWeight ?? windingModels.corse?.insulatedWeight ?? "",
          totalCost: computeConductorCost(
            corseWinding.insulatedWeight ?? windingModels.corse?.insulatedWeight,
            getRateForMaterial(conductorMaterial.corse)
          ),
        },
        fine: {
          weight: fineWinding.insulatedWeight ?? windingModels.fine?.insulatedWeight ?? "",
          totalCost: computeConductorCost(
            fineWinding.insulatedWeight ?? windingModels.fine?.insulatedWeight,
            getRateForMaterial(conductorMaterial.fine)
          ),
        },
        outer: {
          weight: outerWinding.insulatedWeight ?? windingModels.outer?.insulatedWeight ?? "",
          totalCost: computeConductorCost(
            outerWinding.insulatedWeight ?? windingModels.outer?.insulatedWeight,
            getRateForMaterial(conductorMaterial.outer)
          ),
        },
      },
    },
    cost: {
      copperCostPerKg:
        inputs.cost?.copperCostPerKg ?? MULTI_WDG_DEFAULT_COST.copperCostPerKg,
      aluminiumCostPerKg:
        inputs.cost?.aluminiumCostPerKg ?? MULTI_WDG_DEFAULT_COST.aluminiumCostPerKg,
      coreCostPerKg: inputs.cost?.coreCostPerKg ?? MULTI_WDG_DEFAULT_COST.coreCostPerKg,
      steelCostPerKg: inputs.cost?.steelCostPerKg ?? MULTI_WDG_DEFAULT_COST.steelCostPerKg,
      oilCostPerKg: inputs.cost?.oilCostPerKg ?? MULTI_WDG_DEFAULT_COST.oilCostPerKg,
      insulationCostPerKg:
        inputs.cost?.insulationCostPerKg ?? MULTI_WDG_DEFAULT_COST.insulationCostPerKg,
      radiatorCostPerKg:
        inputs.cost?.radiatorCostPerKg ?? MULTI_WDG_DEFAULT_COST.radiatorCostPerKg,
      totalCondCost: tankAndOil.conductorCost ?? "",
      totalCoreCost: tankAndOil.coreCost ?? "",
      totalSteelCost: tankAndOil.steelCost ?? "",
      totalOilCost: tankAndOil.oilCost ?? "",
      totalInsCost: tankAndOil.insulationCost ?? "",
      totalRadiatorCost: tankAndOil.radiatorCost ?? "",
      capitalCost: tankAndOil.capitalCost ?? "",
    },
    calculationResponse: responseData,
  });
};
