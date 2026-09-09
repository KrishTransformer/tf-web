import { MULTI_WDG_DEFAULT_COST } from "../constants/MultiWindingDefaults";

const WDG_CONFIGURATION_TO_SELECTION = {
  "2_WDG_LV_HV_MAIN": "2 Wdg (LV and HV-Main)",
  "3_WDG_LV_HV_MAIN_OUTER": "3 Wdg (LV, HV-Main and Outer)",
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": "4 Wdg (LV, HV-Main, Corse and Outer)",
  "4_WDG_LV_HV_MAIN_FINE_OUTER": "4 Wdg (LV, HV-Main, Fine and Outer)",
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": "5 Wdg (LV, HV-Main, Corse, Fine and Outer)",
};

const CONFIGURATION_TO_ACTIVE_WINDINGS = {
  "2_WDG_LV_HV_MAIN": ["lv", "hvMain"],
  "3_WDG_LV_HV_MAIN_OUTER": ["lv", "hvMain", "outer"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": ["lv", "hvMain", "corse", "outer"],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": ["lv", "hvMain", "fine", "outer"],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": ["lv", "hvMain", "corse", "fine", "outer"],
};

const CONFIGURATION_TO_ACTIVE_RADIAL_GAPS = {
  "2_WDG_LV_HV_MAIN": ["coreToLv", "lvToHv"],
  "3_WDG_LV_HV_MAIN_OUTER": ["coreToLv", "lvToHv", "hvToOuter"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": [
    "coreToLv",
    "lvToHv",
    "hvToCorse",
    "corseToOuter",
  ],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": [
    "coreToLv",
    "lvToHv",
    "hvToFine",
    "fineToOuter",
  ],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": [
    "coreToLv",
    "lvToHv",
    "hvToCorse",
    "corseToFine",
    "fineToOuter",
  ],
};

const UI_TO_BACKEND_WINDING_KEY = {
  lv: "lvWindings",
  hvMain: "hvWindings",
  corse: "corseWindings",
  fine: "fineWindings",
  outer: "outerWindings",
};
const CONDUCTOR_MATERIAL_FIELDS = {
  lv: ["lVConductorMaterial", "lvConductorMaterial"],
  hvMain: ["hVConductorMaterial", "hvConductorMaterial"],
  corse: ["corseConductorMaterial", "corseConductorMaterial"],
  fine: ["fineConductorMaterial", "fineConductorMaterial"],
  outer: ["outerConductorMaterial", "outerConductorMaterial"],
};
const CONDUCTOR_MATERIAL_CODES = {
  Cu: "COPPER",
  Al: "ALUMINIUM",
  COPPER: "COPPER",
  ALUMINIUM: "ALUMINIUM",
};
const LOCKED_WINDING_FIELDS = [
  "turnsPerPhase",
  "conductorSizes",
  "noInParallel",
  "condBreadth",
  "condHeight",
];

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const pickFirst = (...values) => values.find(hasValue);

const asNullable = (value) => (hasValue(value) ? value : null);

const omitEmptyEntries = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== "")
  );

const toIntegerOrNull = (value) => {
  if (!hasValue(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

const toNumberOrNull = (value) => {
  if (!hasValue(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toBooleanOrNull = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return Boolean(value);
};

const normalizeWindingTypeCode = (value) => {
  switch (value) {
    case "HELICAL":
    case "Helical":
      return "HELICAL";
    case "DISC":
    case "Disc":
      return "DISC";
    case "XOVER":
    case "X-Over":
      return "XOVER";
    case "FOIL":
    case "Foil":
      return "FOIL";
    case "LAYERDISC":
    case "LayerDisc":
      return "LAYERDISC";
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
    hvToCorse: pickFirst(
      formState.radialGaps?.hvToCorse,
      formState.radialGaps?.lvToCoarse,
      multiCoilGaps.hvMainToCorseGap,
      multiCoilGaps.hvMainToCoarseGap,
      multiCoilGaps.lvToCorseGap,
      multiCoilGaps.lvToCoarseGap,
      ""
    ),
    corseToFine: pickFirst(
      formState.radialGaps?.corseToFine,
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
      ""
    ),
    hvToFine: pickFirst(
      formState.radialGaps?.hvToFine,
      formState.radialGaps?.lvToFine,
      multiCoilGaps.hvMainToFineGap,
      ""
    ),
    hvToOuter: pickFirst(
      formState.radialGaps?.hvToOuter,
      multiCoilGaps.hvMainToOuterGap,
      ""
    ),
    corseToOuter: pickFirst(
      formState.radialGaps?.corseToOuter,
      formState.radialGaps?.coarseToOuter,
      multiCoilGaps.corseToOuterGap,
      multiCoilGaps.coarseToOuterGap,
      ""
    ),
  };
};

const filterRadialGapsForConfiguration = (radialGaps, windingConfiguration) => {
  const activeGapKeys =
    CONFIGURATION_TO_ACTIVE_RADIAL_GAPS[windingConfiguration] ||
    CONFIGURATION_TO_ACTIVE_RADIAL_GAPS["2_WDG_LV_HV_MAIN"];

  return Object.fromEntries(
    activeGapKeys.map((key) => [key, asNullable(radialGaps[key])])
  );
};

const pruneInactiveWindings = (payload, activeWindings) => {
  const removableFieldsByWinding = {
    lv: ["lvWindingType", "lvCurrentDensity", "lvWindings"],
    hvMain: ["hvWindingType", "hvCurrentDensity", "hvWindings"],
    corse: ["corseWindingType", "corseCurrentDensity", "corseWindings"],
    fine: ["fineWindingType", "fineCurrentDensity", "fineWindings"],
    outer: ["outerWindingType", "outerCurrentDensity", "outerWindings"],
  };

  Object.entries(removableFieldsByWinding).forEach(([windingKey, fields]) => {
    if (activeWindings.includes(windingKey)) {
      return;
    }

    fields.forEach((field) => {
      delete payload[field];
    });
  });

  return payload;
};

const formatConductorSizes = (winding = {}) => {
  if (toBooleanOrNull(winding.isConductorRound)) {
    return hasValue(winding.conductorDiameter)
      ? `Round ${winding.conductorDiameter}`
      : "";
  }

  if (hasValue(winding.condBreadth) && hasValue(winding.condHeight)) {
    return `${winding.condBreadth} L X ${winding.condHeight} B`;
  }

  return "";
};

const formatNoInParallel = (winding = {}) => {
  if (!hasValue(winding.radialParallelCond) && !hasValue(winding.axialParallelCond)) {
    return "";
  }

  const radial = winding.radialParallelCond ?? "";
  const axial = winding.axialParallelCond ?? "";
  const total =
    Number.isFinite(Number(radial)) && Number.isFinite(Number(axial))
      ? Number(radial) * Number(axial)
      : "";

  return `Rad ${radial} X Axi ${axial} = ${total}`;
};

const getResolvedDuctSize = (winding = {}, windingType) => {
  if (
    ["DISC", "LAYERDISC", "LAYER_DISC"].includes(normalizeWindingTypeCode(windingType)) &&
    hasValue(winding.discDuctSize)
  ) {
    return toIntegerOrNull(winding.discDuctSize);
  }

  return toIntegerOrNull(winding.ductSize);
};

const buildWindingPayload = (winding = {}, windingType, lockState = {}) => {
  if (!winding || typeof winding !== "object") {
    return null;
  }

  const conductorSizesLocked = Boolean(lockState.conductorSizes);
  const noInParallelLocked = Boolean(lockState.noInParallel);
  const turnsPerPhaseLocked = Boolean(lockState.turnsPerPhase);

  return omitEmptyEntries({
    turnsPerPhase: turnsPerPhaseLocked ? toNumberOrNull(winding.turnsPerPhase) : null,
    conductorSizes: conductorSizesLocked ? formatConductorSizes(winding) : "",
    condInsulation: toNumberOrNull(winding.condInsulation),
    noInParallel: noInParallelLocked ? formatNoInParallel(winding) : "",
    noOfLayers: toNumberOrNull(winding.noOfLayers),
    endClearances: toNumberOrNull(winding.endClearances),
    ducts: toIntegerOrNull(winding.ducts),
    ductSize: getResolvedDuctSize(winding, windingType),
    interLayerInsulation: toNumberOrNull(winding.interLayerInsulation),
    radialParallelCond: noInParallelLocked ? toIntegerOrNull(winding.radialParallelCond) : null,
    axialParallelCond: noInParallelLocked ? toIntegerOrNull(winding.axialParallelCond) : null,
    condBreadth: conductorSizesLocked ? toNumberOrNull(winding.condBreadth) : null,
    condHeight: conductorSizesLocked ? toNumberOrNull(winding.condHeight) : null,
    conductorDiameter: conductorSizesLocked ? toNumberOrNull(winding.conductorDiameter) : null,
    isConductorRound: conductorSizesLocked ? toBooleanOrNull(winding.isConductorRound) : null,
    isEnamel: Boolean(winding.isEnamel),
  });
};

const normalizeLockedAttributes = (value = {}, legacyLockedCore) => {
  const source = value && typeof value === "object" ? value : {};
  const coreLock = legacyLockedCore || source.coreLock || {};
  const normalizedCoreLock = {
    coreDia: Boolean(coreLock.coreDia),
    limbHt: Boolean(coreLock.limbHt),
  };
  const normalizedWindingLocks = Object.fromEntries(
    Object.entries(UI_TO_BACKEND_WINDING_KEY).map(([uiKey, backendKey]) => {
      const group = source[backendKey] || source[uiKey] || {};
      const locks = Object.fromEntries(
        LOCKED_WINDING_FIELDS.map((field) => [field, Boolean(group[field])])
      );

      if (locks.conductorSizes) {
        locks.condBreadth = true;
        locks.condHeight = true;
      }

      return [backendKey, locks];
    })
  );

  if (normalizedCoreLock.coreDia && normalizedCoreLock.limbHt) {
    Object.values(normalizedWindingLocks).forEach((locks) => {
      locks.noInParallel = false;
    });
  }

  return {
    coreLock: normalizedCoreLock,
    ...normalizedWindingLocks,
  };
};

export const buildMultiWindingPayload = (
  formState = {},
  lockedAttributes = {},
  legacyLockedCore
) => {
  const normalizedLocks = normalizeLockedAttributes(lockedAttributes, legacyLockedCore);
  const windingConfiguration =
    formState.windingConfiguration || "2_WDG_LV_HV_MAIN";
  const lvWindingType = asNullable(normalizeWindingTypeCode(formState.lvWindingType));
  const hvWindingType = asNullable(normalizeWindingTypeCode(formState.hvWindingType));
  const corseWindingType = asNullable(normalizeWindingTypeCode(formState.corseWindingType));
  const fineWindingType = asNullable(normalizeWindingTypeCode(formState.fineWindingType));
  const outerWindingType = asNullable(normalizeWindingTypeCode(formState.outerWindingType));
  const activeWindings =
    CONFIGURATION_TO_ACTIVE_WINDINGS[windingConfiguration] ||
    CONFIGURATION_TO_ACTIVE_WINDINGS["2_WDG_LV_HV_MAIN"];
  const isWindingActive = (uiKey) => activeWindings.includes(uiKey);
  const windingTypesByUiKey = {
    lv: lvWindingType,
    hvMain: hvWindingType,
    corse: corseWindingType,
    fine: fineWindingType,
    outer: outerWindingType,
  };
  const radialGaps = filterRadialGapsForConfiguration(
    buildRadialGaps(formState),
    windingConfiguration
  );
  const lvCurrentDensity = toNumberOrNull(formState.lvCurrentDensity);
  const hvCurrentDensity = toNumberOrNull(formState.hvCurrentDensity);
  const corseCurrentDensity = toNumberOrNull(formState.corseCurrentDensity);
  const fineCurrentDensity = toNumberOrNull(formState.fineCurrentDensity);
  const outerCurrentDensity = toNumberOrNull(formState.outerCurrentDensity);
  const windingPayloads = Object.fromEntries(
    activeWindings.map((uiKey) => [
      UI_TO_BACKEND_WINDING_KEY[uiKey],
      buildWindingPayload(
        formState.part2Windings?.[uiKey],
        windingTypesByUiKey[uiKey],
        normalizedLocks[UI_TO_BACKEND_WINDING_KEY[uiKey]]
      ),
    ])
  );

  const payload = {
    designId: asNullable(formState.designId),
    windingSelection:
      pickFirst(
        formState.windingSelection,
        WDG_CONFIGURATION_TO_SELECTION[windingConfiguration]
      ) || "2 Wdg (LV and HV-Main)",
    kVA: toIntegerOrNull(formState.kVA),
    kValue: 0.45,
    fluxDensity: toNumberOrNull(formState.fluxDensity),
    vectorGroup: asNullable(formState.vectorGroup),
    lowVoltage: toIntegerOrNull(
      pickFirst(formState.primaryVoltage, formState.lowVoltage)
    ),
    highVoltage: toIntegerOrNull(
      pickFirst(formState.secondaryVoltage, formState.highVoltage)
    ),
    tapStepsPercentage: toNumberOrNull(pickFirst(
      formState.tapStepsPercentage,
      formState.tapStepsPercent
    )),
    tapStepPositive: toIntegerOrNull(pickFirst(
      formState.tapStepPositive,
      formState.tapStepsPositive
    )),
    tapStepNegative: toIntegerOrNull(pickFirst(
      formState.tapStepNegative,
      formState.tapStepsNegative
    )),
    lvWindings: windingPayloads.lvWindings ?? null,
    hvWindings: windingPayloads.hvWindings ?? null,
    core: {
      coreDia: normalizedLocks.coreLock.coreDia
        ? toIntegerOrNull(formState.core?.coreDia)
        : null,
      limbHt: normalizedLocks.coreLock.limbHt
        ? toIntegerOrNull(formState.core?.limbHt)
        : null,
    },
    lockedAttributes: normalizedLocks,
    cost: buildCostPayload(formState),
    radialGaps,
  };

  if (hasValue(lvWindingType)) {
    payload.lvWindingType = lvWindingType;
  }

  if (hasValue(hvWindingType)) {
    payload.hvWindingType = hvWindingType;
  }

  if (lvCurrentDensity !== null) {
    payload.lvCurrentDensity = lvCurrentDensity;
  }

  if (hvCurrentDensity !== null) {
    payload.hvCurrentDensity = hvCurrentDensity;
  }

  if (isWindingActive("corse")) {
    if (hasValue(corseWindingType)) {
      payload.corseWindingType = corseWindingType;
    }
    if (corseCurrentDensity !== null) {
      payload.corseCurrentDensity = corseCurrentDensity;
    }
    payload.corseWindings = windingPayloads.corseWindings ?? null;
  }

  if (isWindingActive("fine")) {
    if (hasValue(fineWindingType)) {
      payload.fineWindingType = fineWindingType;
    }
    if (fineCurrentDensity !== null) {
      payload.fineCurrentDensity = fineCurrentDensity;
    }
    payload.fineWindings = windingPayloads.fineWindings ?? null;
  }

  if (isWindingActive("outer")) {
    if (hasValue(outerWindingType)) {
      payload.outerWindingType = outerWindingType;
    }
    if (outerCurrentDensity !== null) {
      payload.outerCurrentDensity = outerCurrentDensity;
    }
    payload.outerWindings = windingPayloads.outerWindings ?? null;
  }

  activeWindings.forEach((windingKey) => {
    const [uiField, backendField] = CONDUCTOR_MATERIAL_FIELDS[windingKey];
    const material = CONDUCTOR_MATERIAL_CODES[formState[uiField]];
    if (material) {
      payload[backendField] = material;
    }
  });

  return pruneInactiveWindings(payload, activeWindings);
};
