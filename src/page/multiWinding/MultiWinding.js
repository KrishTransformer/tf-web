import React, { useEffect, useState } from "react";
import { Container, FlexContainer, Layout, TextTypo } from "../../components";
import { useActions } from "../../app/use-Actions";
import { addCalc, clearCalc } from "../../actions/CalcActions";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectCalc } from "../../selectors/CalcSelector";
import { initialState } from "../../reducers/CalcReducer";
import { buildMultiWindingPayload } from "../../utils/multiWindingPayload";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import "./MultiWindingTheme.css";

const PART2_WINDING_IDS = ["lv", "hvMain", "corse", "fine", "outer"];
const WINDING_IDS_BY_CONFIGURATION = {
  "2_WDG_LV_HV_MAIN": ["lv", "hvMain"],
  "3_WDG_LV_HV_MAIN_OUTER": ["lv", "hvMain", "outer"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": ["lv", "hvMain", "corse", "outer"],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": ["lv", "hvMain", "fine", "outer"],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": ["lv", "hvMain", "corse", "fine", "outer"],
};
const LOCK_GROUP_BY_WINDING_ID = {
  lv: "lvWindings",
  hvMain: "hvWindings",
  corse: "corseWindings",
  fine: "fineWindings",
  outer: "outerWindings",
};
const LOCKED_WINDING_FIELDS = [
  "turnsPerPhase",
  "conductorSizes",
  "noInParallel",
  "condBreadth",
  "condHeight",
];

const hasValue = (value) => value !== undefined && value !== null && value !== "";
const cloneData = (data) => JSON.parse(JSON.stringify(data));

const createDefaultLockedCore = () => ({
  coreDia: false,
  limbHt: false,
});

const createDefaultLockedAttributes = () => ({
  coreLock: createDefaultLockedCore(),
  ...Object.fromEntries(
    PART2_WINDING_IDS.map((windingId) => [
      LOCK_GROUP_BY_WINDING_ID[windingId],
      Object.fromEntries(LOCKED_WINDING_FIELDS.map((field) => [field, false])),
    ])
  ),
});

const cloneLockedAttributes = (source = {}) => {
  const defaults = createDefaultLockedAttributes();
  return {
    coreLock: {
      ...defaults.coreLock,
      ...(source?.coreLock || {}),
    },
    ...Object.fromEntries(
      PART2_WINDING_IDS.map((windingId) => {
        const group = LOCK_GROUP_BY_WINDING_ID[windingId];
        return [
          group,
          {
            ...defaults[group],
            ...(source?.[group] || {}),
          },
        ];
      })
    ),
  };
};

const getWindingLocks = (lockedAttributes, windingId) =>
  lockedAttributes?.[LOCK_GROUP_BY_WINDING_ID[windingId]] || {};

const clearInactiveWindingLocks = (lockedAttributes, windingConfiguration) => {
  const nextState = cloneLockedAttributes(lockedAttributes);
  const activeWindings = new Set(
    WINDING_IDS_BY_CONFIGURATION[windingConfiguration] || WINDING_IDS_BY_CONFIGURATION["2_WDG_LV_HV_MAIN"]
  );

  PART2_WINDING_IDS.forEach((windingId) => {
    if (!activeWindings.has(windingId)) {
      nextState[LOCK_GROUP_BY_WINDING_ID[windingId]] = Object.fromEntries(
        LOCKED_WINDING_FIELDS.map((field) => [field, false])
      );
    }
  });

  return nextState;
};

const formatConductorSizesDisplay = (winding = {}) => {
  if (winding?.isConductorRound) {
    return hasValue(winding?.conductorDiameter)
      ? `Round ${winding.conductorDiameter}`
      : winding?.conductorSizes || "";
  }

  if (hasValue(winding?.condBreadth) && hasValue(winding?.condHeight)) {
    return `${winding.condBreadth} X ${winding.condHeight}`;
  }

  return winding?.conductorSizes || "";
};

const formatNoInParallelDisplay = (winding = {}) => {
  if (!hasValue(winding?.radialParallelCond) && !hasValue(winding?.axialParallelCond)) {
    return winding?.noInParallel || "";
  }

  const radial = winding?.radialParallelCond ?? "";
  const axial = winding?.axialParallelCond ?? "";
  const total =
    Number.isFinite(Number(radial)) && Number.isFinite(Number(axial))
      ? Number(radial) * Number(axial)
      : "";

  return `R${radial} x A${axial} = ${total}`;
};

const formatNoOfDuctsWidthDisplay = (winding = {}) => {
  if (!hasValue(winding?.ducts) && !hasValue(winding?.ductSize)) {
    return winding?.noOfDuctsWidth || "";
  }

  return `${winding?.ducts ?? ""} / ${winding?.ductSize ?? ""}`;
};

const syncPart2WindingDisplayFields = (winding = {}) => ({
  ...winding,
  conductorSizes: formatConductorSizesDisplay(winding),
  noInParallel: formatNoInParallelDisplay(winding),
  noOfDuctsWidth: formatNoOfDuctsWidthDisplay(winding),
});

const getDefaultPart2Winding = (windingId) =>
  cloneData(initialState.multiWindings.data.part2Windings?.[windingId] || {});

const resetPart2Winding = (prevState, windingId, lockedAttributes) => {
  const previousWinding = prevState.part2Windings?.[windingId] || {};
  const locks = getWindingLocks(lockedAttributes, windingId);
  const resetWinding = getDefaultPart2Winding(windingId);

  if (locks.turnsPerPhase) {
    resetWinding.turnsPerPhase = previousWinding.turnsPerPhase;
  }

  if (locks.conductorSizes) {
    resetWinding.conductorSizes = previousWinding.conductorSizes;
    resetWinding.condBreadth = previousWinding.condBreadth;
    resetWinding.condHeight = previousWinding.condHeight;
    resetWinding.conductorDiameter = previousWinding.conductorDiameter;
    resetWinding.isConductorRound = previousWinding.isConductorRound;
  }

  if (locks.noInParallel) {
    resetWinding.noInParallel = previousWinding.noInParallel;
    resetWinding.radialParallelCond = previousWinding.radialParallelCond;
    resetWinding.axialParallelCond = previousWinding.axialParallelCond;
  }

  return syncPart2WindingDisplayFields(resetWinding);
};

const resetPart2Windings = (prevState, lockedAttributes, windingIds = PART2_WINDING_IDS) => ({
  ...(prevState.part2Windings || {}),
  ...Object.fromEntries(
    windingIds.map((windingId) => [
      windingId,
      resetPart2Winding(prevState, windingId, lockedAttributes),
    ])
  ),
});

const resetCalculationResults = (
  prevState,
  lockedAttributes,
  { windingIds = PART2_WINDING_IDS, resetCore = false } = {}
) => {
  const defaults = initialState.multiWindings.data;

  return {
    ...prevState,
    voltsPerTurn: defaults.voltsPerTurn,
    revisedVoltsPerTurn: defaults.revisedVoltsPerTurn,
    kValue: defaults.kValue,
    loadLoss: defaults.loadLoss,
    coreLoss: defaults.coreLoss,
    ez: defaults.ez,
    lossesAt50Percent: defaults.lossesAt50Percent,
    lossesAt100Percent: defaults.lossesAt100Percent,
    radiatorWidth: defaults.radiatorWidth,
    calculationResponse: defaults.calculationResponse,
    commonFormulas: cloneData(defaults.commonFormulas),
    hvFormulas: cloneData(defaults.hvFormulas),
    lvFormulas: cloneData(defaults.lvFormulas),
    innerWindings: cloneData(defaults.innerWindings),
    outerWindings: cloneData(defaults.outerWindings),
    part2Windings: resetPart2Windings(prevState, lockedAttributes, windingIds),
    coilDimensions: {
      ...cloneData(defaults.coilDimensions),
      coreGap: prevState.coilDimensions?.coreGap || defaults.coilDimensions.coreGap,
      lvhvgap: prevState.coilDimensions?.lvhvgap || defaults.coilDimensions.lvhvgap,
      hvhvgap: prevState.coilDimensions?.hvhvgap || defaults.coilDimensions.hvhvgap,
    },
    multiCoilDimensions: {
      ...cloneData(defaults.multiCoilDimensions),
      gaps: {
        ...cloneData(defaults.multiCoilDimensions.gaps),
        ...(prevState.multiCoilDimensions?.gaps || {}),
      },
    },
    core: resetCore
      ? {
          ...cloneData(defaults.core),
          coreMaterial: prevState.core?.coreMaterial ?? defaults.core.coreMaterial,
          coreType: prevState.core?.coreType ?? defaults.core.coreType,
          ...(lockedAttributes.coreLock?.coreDia && {
            coreDia: prevState.core?.coreDia,
          }),
          ...(lockedAttributes.coreLock?.limbHt && {
            limbHt: prevState.core?.limbHt,
          }),
        }
      : {
          ...(prevState.core || {}),
          area: defaults.core.area,
          cenDist: defaults.core.cenDist,
          coreWeight: defaults.core.coreWeight,
          wkgGrade: defaults.core.wkgGrade,
        },
    tank: {
      ...cloneData(defaults.tank),
      wdgToTankGap: prevState.tank?.wdgToTankGap || defaults.tank.wdgToTankGap,
      connectionGap: prevState.tank?.connectionGap || defaults.tank.connectionGap,
      topYokeToCoverGap:
        prevState.tank?.topYokeToCoverGap || defaults.tank.topYokeToCoverGap,
    },
    tankAndOilFormulas: cloneData(defaults.tankAndOilFormulas),
    multiCost: cloneData(defaults.multiCost),
    cost: {
      ...cloneData(defaults.cost),
      copperCostPerKg: prevState.cost?.copperCostPerKg ?? defaults.cost.copperCostPerKg,
      aluminiumCostPerKg:
        prevState.cost?.aluminiumCostPerKg ?? defaults.cost.aluminiumCostPerKg,
      coreCostPerKg: prevState.cost?.coreCostPerKg ?? defaults.cost.coreCostPerKg,
      steelCostPerKg: prevState.cost?.steelCostPerKg ?? defaults.cost.steelCostPerKg,
      oilCostPerKg: prevState.cost?.oilCostPerKg ?? defaults.cost.oilCostPerKg,
      insulationCostPerKg:
        prevState.cost?.insulationCostPerKg ?? defaults.cost.insulationCostPerKg,
      radiatorCostPerKg:
        prevState.cost?.radiatorCostPerKg ?? defaults.cost.radiatorCostPerKg,
    },
  };
};

const getDefaultCurrentDensityForMaterial = (material) =>
  material === "Al" ? "2.37" : "3.63";

const getDefaultsForKva = (kvaValue) => {
  const parsedKva = Number(kvaValue);

  if (!Number.isFinite(parsedKva) || parsedKva <= 0) {
    return null;
  }

  if (parsedKva <= 2500) {
    return {
      windingConfiguration: "2_WDG_LV_HV_MAIN",
      primaryVoltage: 433,
      secondaryVoltage: 11000,
      lvWindingType: "HELICAL",
      hvWindingType: "HELICAL",
    };
  }

  if (parsedKva <= 10000) {
    return {
      windingConfiguration: "3_WDG_LV_HV_MAIN_OUTER",
      primaryVoltage: 11000,
      secondaryVoltage: 33000,
      lvWindingType: "DISC",
      hvWindingType: "DISC",
    };
  }

  if (parsedKva <= 20000) {
    return {
      windingConfiguration: "4_WDG_LV_HV_MAIN_CORSE_OUTER",
      primaryVoltage: 11000,
      secondaryVoltage: 66000,
      lvWindingType: "DISC",
      hvWindingType: "DISC",
    };
  }

  return {
    windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
    primaryVoltage: 33000,
    secondaryVoltage: 132000,
    lvWindingType: "DISC",
    hvWindingType: "DISC",
  };
};

const VOLTAGE_FIELDS = [
  "primaryVoltage",
  "secondaryVoltage",
  "lowVoltage",
  "highVoltage",
  "corseVoltage",
  "fineVoltage",
  "outerVoltage",
];
const WINDING_TYPE_FIELDS = [
  "lvWindingType",
  "hvWindingType",
  "corseWindingType",
  "fineWindingType",
  "outerWindingType",
];
const CURRENT_DENSITY_FIELDS = [
  "lvCurrentDensity",
  "hvCurrentDensity",
  "corseCurrentDensity",
  "fineCurrentDensity",
  "outerCurrentDensity",
];
const WINDING_ID_BY_WINDING_TYPE_FIELD = {
  lvWindingType: "lv",
  hvWindingType: "hvMain",
  corseWindingType: "corse",
  fineWindingType: "fine",
  outerWindingType: "outer",
};
const WINDING_ID_BY_CURRENT_DENSITY_FIELD = {
  lvCurrentDensity: "lv",
  hvCurrentDensity: "hvMain",
  corseCurrentDensity: "corse",
  fineCurrentDensity: "fine",
  outerCurrentDensity: "outer",
};
const WINDING_ID_BY_CONDUCTOR_MATERIAL_FIELD = {
  lVConductorMaterial: "lv",
  hVConductorMaterial: "hvMain",
  corseConductorMaterial: "corse",
  fineConductorMaterial: "fine",
  outerConductorMaterial: "outer",
};
const TAP_STEP_FIELDS = [
  "tapStepsPercent",
  "tapStepsPositive",
  "tapStepsNegative",
];

const MultiWinding = () => {
  const { id } = useParams();
  const { multiWindings } = useSelector(selectCalc);
  const cloneMultiWindingState = (state) =>
    cloneData(state || initialState.multiWindings.data);
  const actions = useActions({
    addCalc,
    clearCalc,
  });
  const [formState, setFormState] = useState(
    cloneMultiWindingState(multiWindings?.data)
  );
  const [lockedAttributes, setLockedAttributes] = useState(() =>
    cloneLockedAttributes(multiWindings?.data?.lockedAttributes)
  );
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("appTheme") === "dark"
  );
  const [activeTab, setActiveTab] = useState("part1");

  useEffect(() => {
    if (!multiWindings?.data) {
      return;
    }

    setFormState(cloneMultiWindingState(multiWindings.data));
    setLockedAttributes(cloneLockedAttributes(multiWindings.data?.lockedAttributes));
  }, [multiWindings?.data]);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("appTheme") === "dark";
    setIsDarkMode(darkModeEnabled);

    if (darkModeEnabled) {
      document.body.classList.add("app-dark-mode");
      document.body.style.backgroundColor = "#101722";
      document.documentElement.style.backgroundColor = "#101722";
    } else {
      document.body.classList.remove("app-dark-mode");
      document.body.style.backgroundColor = "#ebebeb";
      document.documentElement.style.backgroundColor = "#ebebeb";
    }
  }, []);

  const handleInputChange = (fieldPath, value) => {
    if (fieldPath === "windingConfiguration") {
      setLockedAttributes((prevState) => clearInactiveWindingLocks(prevState, value));
    }

    setFormState((prevState) => {
      let nextState = { ...prevState };

      if (fieldPath === "kVA") {
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          resetCore: true,
        });
        nextState.kVA = value;
        const defaults = getDefaultsForKva(value);

        if (defaults) {
          nextState.windingConfiguration = defaults.windingConfiguration;
          nextState.primaryVoltage = defaults.primaryVoltage;
          nextState.secondaryVoltage = defaults.secondaryVoltage;
          nextState.lvWindingType = defaults.lvWindingType;
          nextState.hvWindingType = defaults.hvWindingType;
        }

        return nextState;
      }

      if (VOLTAGE_FIELDS.includes(fieldPath)) {
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          resetCore: true,
        });
        nextState[fieldPath] = value;

        if (fieldPath === "secondaryVoltage") {
          const voltage = Number(value);

          if (Number.isFinite(voltage) && voltage > 0 && voltage < 11000) {
            nextState.lvWindingType = "HELICAL";
          }
        }

        return nextState;
      }

      if (WINDING_TYPE_FIELDS.includes(fieldPath)) {
        const windingId = WINDING_ID_BY_WINDING_TYPE_FIELD[fieldPath];
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          windingIds: windingId ? [windingId] : PART2_WINDING_IDS,
        });
        nextState[fieldPath] = value;
        return nextState;
      }

      if (CURRENT_DENSITY_FIELDS.includes(fieldPath)) {
        const windingId = WINDING_ID_BY_CURRENT_DENSITY_FIELD[fieldPath];
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          windingIds: windingId ? [windingId] : PART2_WINDING_IDS,
        });
        nextState[fieldPath] = value;
        return nextState;
      }

      if (
        fieldPath === "lVConductorMaterial" ||
        fieldPath === "hVConductorMaterial" ||
        fieldPath === "corseConductorMaterial" ||
        fieldPath === "fineConductorMaterial" ||
        fieldPath === "outerConductorMaterial"
      ) {
        const windingId = WINDING_ID_BY_CONDUCTOR_MATERIAL_FIELD[fieldPath];
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          windingIds: windingId ? [windingId] : PART2_WINDING_IDS,
        });
        nextState[fieldPath] = value;

        const densityFieldByMaterialField = {
          lVConductorMaterial: "lvCurrentDensity",
          hVConductorMaterial: "hvCurrentDensity",
          corseConductorMaterial: "corseCurrentDensity",
          fineConductorMaterial: "fineCurrentDensity",
          outerConductorMaterial: "outerCurrentDensity",
        };

        nextState[densityFieldByMaterialField[fieldPath]] =
          getDefaultCurrentDensityForMaterial(value);

        return nextState;
      }

      if (fieldPath === "vectorGroup") {
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          resetCore: true,
        });
        nextState.vectorGroup = value;
        return nextState;
      }

      if (fieldPath === "fluxDensity") {
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          resetCore: true,
        });
        const parsedKva = Number(prevState.kVA);
        const parsedValue = Number(value);

        if (
          Number.isFinite(parsedKva) &&
          Number.isFinite(parsedValue) &&
          parsedKva <= 2500 &&
          parsedValue > 1.7333
        ) {
          nextState.fluxDensity = 1.7333;
        } else if (
          Number.isFinite(parsedKva) &&
          Number.isFinite(parsedValue) &&
          parsedKva > 2500 &&
          parsedValue > 1.69
        ) {
          nextState.fluxDensity = 1.69;
        } else {
          nextState.fluxDensity = value;
        }

        return nextState;
      }

      if (TAP_STEP_FIELDS.includes(fieldPath)) {
        nextState = resetCalculationResults(prevState, lockedAttributes, {
          windingIds: ["hvMain", "outer"],
        });
        nextState[fieldPath] = value;
        return nextState;
      }

      const keys = fieldPath.split(".");
      let current = nextState;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
          return;
        }

        current[key] = { ...(current[key] || {}) };
        current = current[key];
      });

      if (fieldPath === "core.coreDia" || fieldPath === "core.limbHt") {
        nextState = resetCalculationResults(nextState, lockedAttributes);
      }

      if (keys[0] === "part2Windings" && keys.length === 3) {
        const windingId = keys[1];
        const field = keys[2];
        const resetWindingIds =
          field === "turnsPerPhase"
            ? PART2_WINDING_IDS.slice(
                Math.max(PART2_WINDING_IDS.indexOf(windingId), 0)
              )
            : [];

        if (resetWindingIds.length > 0) {
          nextState = resetCalculationResults(nextState, lockedAttributes, {
            windingIds: resetWindingIds,
          });
        }

        const winding = {
          ...(nextState.part2Windings?.[windingId] || {}),
          [field]: value,
        };
        const lockState = getWindingLocks(lockedAttributes, windingId);

        if (field === "isEnamel") {
          winding.condInsulation = "";
        }

        if (field === "radialParallelCond" || field === "axialParallelCond") {
          if (!lockState.conductorSizes) {
            winding.condBreadth = "";
            winding.condHeight = "";
            winding.conductorDiameter = "";
          }
        }

        if (field === "noOfLayers" && !lockState.noInParallel) {
          winding.noInParallel = "";
          winding.radialParallelCond = "";
          winding.axialParallelCond = "";
        }

        if (
          (field === "conductorDiameter" && winding.isConductorRound) ||
          (field === "isConductorRound" && value === true)
        ) {
          winding.condBreadth = winding.conductorDiameter;
          winding.condHeight = winding.conductorDiameter;
        }

        nextState.part2Windings = {
          ...(nextState.part2Windings || {}),
          [windingId]: syncPart2WindingDisplayFields(winding),
        };
      }

      return nextState;
    });
  };

  const handleToggleLock = (fieldPath, value) => {
    const keys = fieldPath.split(".");

    if (keys[0] === "coreLock" && keys.length === 2) {
      const field = keys[1];
      setLockedAttributes((prevState) => {
        const nextState = cloneLockedAttributes(prevState);
        nextState.coreLock[field] = !value;

        // Matching 2Wdg: fixed core dimensions release parallel-conductor locks.
        if (nextState.coreLock.coreDia && nextState.coreLock.limbHt) {
          PART2_WINDING_IDS.forEach((windingId) => {
            nextState[LOCK_GROUP_BY_WINDING_ID[windingId]].noInParallel = false;
          });
        }
        return nextState;
      });
      return;
    }

    if (keys[0] !== "part2Windings" || keys.length !== 3) {
      return;
    }

    const windingId = keys[1];
    const field = keys[2];
    const nextValue = !value;

    // Keep displayed values when unlocking; the payload already omits unlocked overrides.
    setLockedAttributes((prevState) => {
      const nextState = cloneLockedAttributes(prevState);
      const lockGroup = LOCK_GROUP_BY_WINDING_ID[windingId];

      if (field === "conductorSizes") {
        // Breadth and height are one editable conductor-size setting in the UI.
        nextState[lockGroup].conductorSizes = nextValue;
        nextState[lockGroup].condBreadth = nextValue;
        nextState[lockGroup].condHeight = nextValue;
        if (nextValue) {
          nextState[lockGroup].noInParallel = false;
        }
      } else {
        nextState[lockGroup][field] = nextValue;

        if (field === "noInParallel" && nextValue) {
          nextState[lockGroup].conductorSizes = false;
          nextState[lockGroup].condBreadth = false;
          nextState[lockGroup].condHeight = false;
        }
      }

      return nextState;
    });
  };

  const handleReset = () => {
    actions.clearCalc();
    setFormState(initialState.multiWindings.data);
    setLockedAttributes(createDefaultLockedAttributes());
    window.scrollTo(0, 0);
  };

  const handleCalculate = () => {
    actions.addCalc(
      buildMultiWindingPayload(formState, lockedAttributes),
      "multiwindings",
      undefined,
      undefined,
      multiWindings?.metadata
    );
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (!multiWindings?.isLoading) {
          actions.addCalc(
            buildMultiWindingPayload(formState, lockedAttributes),
            "multiwindings",
            undefined,
            undefined,
            multiWindings?.metadata
          );
          window.scrollTo(0, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    actions,
    formState,
    lockedAttributes,
    multiWindings?.isLoading,
    multiWindings?.metadata,
  ]);

  const currentPath = formState?.designId || (id === "new" ? "New Multi Winding" : id);
  const tabs = [
    {
      key: "part1",
      label: "Inputs",
      content: (
        <Part1
          formState={formState}
          handleInputChange={handleInputChange}
          handleToggleLock={handleToggleLock}
          lockedCore={lockedAttributes.coreLock}
        />
      ),
    },
    {
      key: "part2",
      label: "Windings",
      content: (
        <Part2
          formState={formState}
          handleInputChange={handleInputChange}
          handleToggleLock={handleToggleLock}
          lockedAttributes={lockedAttributes}
        />
      ),
    },
    {
      key: "part3",
      label: "Dimensions & Cost",
      content: (
        <Part3
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
  ];

  return (
    <Layout
      id={id}
      isThinHeader={true}
      headProps={{
        currentPath,
      }}
    >
      <div className={`multi-winding-page ${isDarkMode ? "multi-winding-page-dark" : ""}`}>
        <div className="multi-winding-page-shell">
          <div className="row m-1">
            <div className="col-12 mt-3">
              <div className="multi-winding-tabs-shell">
                <div className="multi-winding-topbar">
                  <div className="multi-winding-tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={`multi-winding-tab${
                          activeTab === tab.key ? " active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <FlexContainer
                    className="multi-winding-common-actions"
                    margin="0"
                  >
                    <button
                      className="multi-winding-action-btn secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      className="multi-winding-action-btn primary btn-calculate"
                      onClick={handleCalculate}
                      disabled={multiWindings?.isLoading}
                    >
                      {multiWindings?.isLoading ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only"></span>
                        </div>
                      ) : (
                        "Calculate"
                      )}
                    </button>
                  </FlexContainer>
                </div>
                <div className="multi-winding-tab-panel">
                  {tabs.find((tab) => tab.key === activeTab)?.content}
                </div>
              </div>
            </div>
            <div className="col-12 mt-1 mb-3">
              <Container
                className="multi-winding-card"
                bgColor="var(--mw-surface)"
                padding="20px"
                borderRadius="10px"
              >
                <TextTypo text="Comments" fontWeight="700" margin="0px 0px 10px 0px" />
                <Container
                  className="multi-winding-comments-box"
                  bgColor="var(--mw-surface-soft)"
                  padding="24px"
                  borderRadius="8px"
                  fontSize="16px"
                >
                  Multi-winding calculation now sends the current frontend payload to the dedicated backend. Response fields can be mapped into the UI next.
                </Container>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MultiWinding;
