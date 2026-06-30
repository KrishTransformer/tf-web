import { MULTI_WDG_DEFAULT_COST } from "../constants/MultiWindingDefaults";

const WDG_CONFIGURATION_TO_SELECTION = {
  "2_WDG_LV_HV_MAIN": "2 Wdg (LV and HV-Main)",
  "3_WDG_LV_HV_MAIN_OUTER": "3 Wdg (LV, HV-Main and Outer)",
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": "4 Wdg (LV, HV-Main, Corse and Outer)",
  "4_WDG_LV_HV_MAIN_FINE_OUTER": "4 Wdg (LV, HV-Main, Fine and Outer)",
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
};

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const pickFirst = (...values) => values.find(hasValue);

const asNullable = (value) => (hasValue(value) ? value : null);

const toIntegerOrNull = (value) => {
  if (!hasValue(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

const formatWindingType = (value) => {
  switch (value) {
    case "HELICAL":
      return "Helical";
    case "DISC":
      return "Disc";
    case "XOVER":
      return "X-Over";
    case "FOIL":
      return "Foil";
    case "LAYERDISC":
      return "LayerDisc";
    default:
      return value || "";
  }
};

const buildCostPayload = (formState = {}) =>
  Object.fromEntries(
    Object.entries(MULTI_WDG_DEFAULT_COST).map(([key, defaultValue]) => [
      key,
      asNullable(pickFirst(formState.cost?.[key], defaultValue)),
    ])
  );

const buildRadialGaps = (formState = {}) => {
  const multiCoilGaps = formState.multiCoilDimensions?.gaps || {};

  return {
    coreToLv: pickFirst(
      formState.radialGaps?.coreToLv,
      formState.coilDimensions?.coreGap,
      formState.coreLVClr,
      ""
    ),
    lvToHv: pickFirst(
      formState.radialGaps?.lvToHv,
      formState.coilDimensions?.lvhvgap,
      formState.lVHVClr,
      ""
    ),
    lvToCoarse: pickFirst(
      formState.radialGaps?.lvToCoarse,
      multiCoilGaps.hvMainToCorseGap,
      multiCoilGaps.hvMainToCoarseGap,
      multiCoilGaps.lvToCorseGap,
      multiCoilGaps.lvToCoarseGap,
      ""
    ),
    fineToCoarse: pickFirst(
      formState.radialGaps?.fineToCoarse,
      formState.radialGaps?.corseToFine,
      formState.radialGaps?.coarseToFine,
      multiCoilGaps.corseToFineGap,
      multiCoilGaps.coarseToFineGap,
      multiCoilGaps.fineToCoarseGap,
      ""
    ),
    fineToOuter: pickFirst(
      formState.radialGaps?.fineToOuter,
      multiCoilGaps.fineToOuterGap,
      multiCoilGaps.corseToOuterGap,
      multiCoilGaps.coarseToOuterGap,
      multiCoilGaps.hvMainToOuterGap,
      ""
    ),
  };
};

export const buildMultiWindingPayload = (formState = {}) => {
  const windingConfiguration =
    formState.windingConfiguration || "2_WDG_LV_HV_MAIN";
  const lvWindingType = asNullable(formatWindingType(formState.lvWindingType));
  const hvWindingType = asNullable(formatWindingType(formState.hvWindingType));
  const corseWindingType = asNullable(formatWindingType(formState.corseWindingType));
  const fineWindingType = asNullable(formatWindingType(formState.fineWindingType));
  const outerWindingType = asNullable(formatWindingType(formState.outerWindingType));

  return {
    designId: asNullable(formState.designId),
    windingSelection:
      pickFirst(
        formState.windingSelection,
        WDG_CONFIGURATION_TO_SELECTION[windingConfiguration]
      ) || "2 Wdg (LV and HV-Main)",
    kVA: toIntegerOrNull(formState.kVA),
    kValue: 0.45,
    vectorGroup: asNullable(formState.vectorGroup),
    lowVoltage: toIntegerOrNull(
      pickFirst(formState.primaryVoltage, formState.lowVoltage)
    ),
    highVoltage: toIntegerOrNull(
      pickFirst(formState.secondaryVoltage, formState.highVoltage)
    ),
    tapStepsPercentage: asNullable(pickFirst(
      formState.tapStepsPercentage,
      formState.tapStepsPercent
    )),
    tapStepPositive: asNullable(pickFirst(
      formState.tapStepPositive,
      formState.tapStepsPositive
    )),
    tapStepNegative: asNullable(pickFirst(
      formState.tapStepNegative,
      formState.tapStepsNegative
    )),
    lvWindingType,
    hvWindingType,
    corseWindingType,
    fineWindingType,
    outerWindingType,
    outerWindings: {
      turnsPerPhase: asNullable(pickFirst(
        formState.outerWindings?.turnsPerPhase,
        formState.part2Windings?.outer?.turnsPerPhase
      )),
    },
    cost: buildCostPayload(formState),
    radialGaps: Object.fromEntries(
      Object.entries(buildRadialGaps(formState)).map(([key, value]) => [key, asNullable(value)])
    ),
  };
};
