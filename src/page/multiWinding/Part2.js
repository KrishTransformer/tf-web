import React from "react";
import { Container, CustomInput } from "../../components";
import Input2WithModal from "../../components/input2WithModal/Input2WithModal";
import Input2WithRadioModal from "../../components/input2WithRadioModal/Input2WithRadioModal";
import ToggleInput2 from "../../components/toggleInput2/ToggleInput2";

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const windingColumns = [
  {
    id: "lv",
    label: "LV",
    labelColor: "var(--mw-accent-blue)",
  },
  {
    id: "hvMain",
    label: "HV-Main",
    labelColor: "var(--mw-accent-orange)",
  },
  {
    id: "corse",
    label: "Corse",
    labelColor: "#475569",
  },
  {
    id: "fine",
    label: "Fine",
    labelColor: "#0f766e",
  },
  {
    id: "outer",
    label: "Outer",
    labelColor: "#b45309",
  },
];

const LOCK_GROUP_BY_WINDING_ID = {
  lv: "lvWindings",
  hvMain: "hvWindings",
  corse: "corseWindings",
  fine: "fineWindings",
  outer: "outerWindings",
};

const configurationColumns = {
  "2_WDG_LV_HV_MAIN": ["lv", "hvMain"],
  "3_WDG_LV_HV_MAIN_OUTER": ["lv", "hvMain", "outer"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": ["lv", "hvMain", "corse", "outer"],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": ["lv", "hvMain", "fine", "outer"],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": ["lv", "hvMain", "corse", "fine", "outer"],
};

const part2Fields = [
  { key: "turnsPerPhase", label: "No. of Turns", highlighted: true },
  { key: "phaseCurrent", label: "Phase Current (A)" },
  { key: "currentDensity", label: "Current Density (A/mm2)" },
  { key: "condCrossSec", label: "Cond. Cross Sec (mm2)" },
  { key: "conductorSizes", label: "Conductor Sizes (mm)", highlighted: true },
  { key: "condInsulation", label: "Cond. Insulation (mm)", highlighted: true },
  { key: "noInParallel", label: "No. in Parallel", highlighted: true },
  { key: "windingLength", label: "Winding Length (mm)" },
  { key: "noOfLayers", label: "No. of Layers", highlighted: true },
  { key: "interLayerInsulation", label: "Inter Layer Insulation (mm)", highlighted: true },
  { key: "noOfDuctsWidth", label: "No. of Ducts / Width", highlighted: true },
  { key: "discDuctSize", label: "Disc Duct Size (mm)", highlighted: true },
  { key: "turnsLayers", label: "Turns / Layers" },
  { key: "endClearances", label: "End Clearances (mm)", highlighted: true },
  { key: "eddyStrayLoss", label: "Eddy (Stray) Loss (%)" },
  { key: "tempGradDegC", label: "Temp. Grad. deg C" },
  { key: "weightBareInsulated", label: "Wgt Bare / Insulated (Kg)" },
  { key: "loadLoss", label: "Load Loss (W)" },
];

const getPart2Winding = (formState, columnId) =>
  formState?.part2Windings?.[columnId] || {};

const getPart2FieldValue = (formState, columnId, fieldKey) => {
  if (fieldKey === "discDuctSize") {
    const legacyWinding = columnId === "lv" ? "innerWindings" : columnId === "hvMain" ? "outerWindings" : null;
    return formState?.part2Windings?.[columnId]?.discDuctSize ?? formState?.[legacyWinding]?.discDuctSize ?? "";
  }

  return formState?.part2Windings?.[columnId]?.[fieldKey] ?? "";
};

const getPart2FieldPath = (columnId, fieldKey) =>
  `part2Windings.${columnId}.${fieldKey}`;

const formatConductorValue = (winding = {}) => {
  if (winding?.isConductorRound) {
    return hasValue(winding?.conductorDiameter)
      ? `Round ${winding.conductorDiameter}`
      : "";
  }

  if (hasValue(winding?.condBreadth) && hasValue(winding?.condHeight)) {
    return `${winding.condBreadth} x ${winding.condHeight}`;
  }

  return winding?.conductorSizes || "";
};

const formatParallelValue = (winding = {}) => {
  if (
    !hasValue(winding?.radialParallelCond) &&
    !hasValue(winding?.axialParallelCond)
  ) {
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

const formatDuctValue = (winding = {}) => {
  if (!hasValue(winding?.ducts) && !hasValue(winding?.ductSize)) {
    return winding?.noOfDuctsWidth || "";
  }

  return `${winding?.ducts ?? ""} / ${winding?.ductSize ?? ""}`;
};

const Part2 = ({
  formState,
  handleInputChange,
  handleToggleLock,
  lockedAttributes,
}) => {
  const selectedConfiguration =
    formState?.windingConfiguration || "2_WDG_LV_HV_MAIN";
  const visibleColumns = windingColumns.filter((column) =>
    (
      configurationColumns[selectedConfiguration] ||
      configurationColumns["2_WDG_LV_HV_MAIN"]
    ).includes(column.id)
  );
  const gridTemplateColumns = `minmax(220px, 1.2fr) repeat(${visibleColumns.length}, minmax(160px, 1fr))`;

  return (
    <Container className="multi-winding-card" padding="20px">
      <div className="multi-winding-part2-grid-wrap">
        <div className="multi-winding-part2-grid" style={{ gridTemplateColumns }}>
          <div className="multi-winding-part2-header-cell multi-winding-part2-header-label">
            Parameter
          </div>
          {visibleColumns.map((column) => (
            <div className="multi-winding-part2-header-cell" key={column.id}>
              <span
                className="multi-winding-part2-header-text"
                style={{ color: column.labelColor }}
              >
                {column.label}
              </span>
            </div>
          ))}

          {part2Fields.map((field, index) => {
            const isLastRow = index === part2Fields.length - 1;

            return (
              <React.Fragment key={field.key}>
                <div
                  className={`multi-winding-part2-label-cell${
                    isLastRow ? " last-row" : ""
                  }`}
                >
                  <span className="multi-winding-part2-label-text">{field.label}</span>
                </div>

                {visibleColumns.map((column) => {
                  const winding = getPart2Winding(formState, column.id);
                  const lockState = lockedAttributes?.[LOCK_GROUP_BY_WINDING_ID[column.id]] || {};

                  return (
                    <div
                      className={`multi-winding-part2-input-cell${
                        field.highlighted ? " highlighted" : ""
                      }${isLastRow ? " last-row" : ""}`}
                      key={`${field.key}-${column.id}`}
                    >
                      {field.key === "conductorSizes" ? (
                        <Input2WithRadioModal
                          modalLabel={field.label}
                          value={formatConductorValue(winding)}
                          label1="Breadth"
                          label2="Height"
                          label3="Diameter"
                          value1={winding?.condBreadth}
                          value2={winding?.condHeight}
                          value3={winding?.conductorDiameter}
                          attributeName1={getPart2FieldPath(column.id, "condBreadth")}
                          attributeName2={getPart2FieldPath(column.id, "condHeight")}
                          attributeName3={getPart2FieldPath(column.id, "conductorDiameter")}
                          attributeName4={getPart2FieldPath(column.id, "isConductorRound")}
                          radio1="Round"
                          radio2="Strip"
                          isConductorRound={
                            winding?.isConductorRound === true ? "Round" : "Strip"
                          }
                          onChange={handleInputChange}
                          showUnlockIcon={true}
                          handleToggleLock={() =>
                            handleToggleLock(
                              getPart2FieldPath(column.id, field.key),
                              lockState?.conductorSizes
                            )
                          }
                          isLocked={lockState?.conductorSizes}
                        />
                      ) : field.key === "noInParallel" ? (
                        <Input2WithModal
                          modalLabel={field.label}
                          label1="No in Radial"
                          label2="No in Axial"
                          description="Enter number in Radial and number in Axial"
                          value={formatParallelValue(winding)}
                          value1={winding?.radialParallelCond}
                          value2={winding?.axialParallelCond}
                          attributeName1={getPart2FieldPath(column.id, "radialParallelCond")}
                          attributeName2={getPart2FieldPath(column.id, "axialParallelCond")}
                          onChange={handleInputChange}
                          showUnlockIcon={true}
                          handleToggleLock={() =>
                            handleToggleLock(
                              getPart2FieldPath(column.id, field.key),
                              lockState?.noInParallel
                            )
                          }
                          isLocked={lockState?.noInParallel}
                        />
                      ) : field.key === "noOfDuctsWidth" ? (
                        <Input2WithModal
                          modalLabel={field.label}
                          label1="No Of Ducts"
                          label2="Duct Width"
                          description="Enter no of Ducts and Width"
                          value={formatDuctValue(winding)}
                          value1={winding?.ducts}
                          value2={winding?.ductSize}
                          attributeName1={getPart2FieldPath(column.id, "ducts")}
                          attributeName2={getPart2FieldPath(column.id, "ductSize")}
                          onChange={handleInputChange}
                          isLocked={false}
                          handleToggleLock={() => {}}
                        />
                      ) : field.key === "condInsulation" ? (
                        <ToggleInput2
                          label=""
                          labelColor={column.labelColor}
                          value={winding?.condInsulation ?? ""}
                          onValueChange={(val) =>
                            handleInputChange(
                              getPart2FieldPath(column.id, "condInsulation"),
                              val
                            )
                          }
                          isEnamel={Boolean(winding?.isEnamel)}
                          onToggleChange={(val) =>
                            handleInputChange(
                              getPart2FieldPath(column.id, "isEnamel"),
                              val
                            )
                          }
                        />
                      ) : (
                        <CustomInput
                          value={getPart2FieldValue(formState, column.id, field.key)}
                          onChange={(e) =>
                            handleInputChange(
                              getPart2FieldPath(column.id, field.key),
                              e.target.value
                            )
                          }
                          margin="0"
                          bgColor={
                            field.highlighted
                              ? "var(--app-input-accent-bg)"
                              : "var(--app-input-bg)"
                          }
                          borderColor="var(--app-input-border)"
                          placeholder={column.label}
                          showUnlockIcon={field.key === "turnsPerPhase"}
                          readOnly={field.key === "discDuctSize" ? false : field.key === "turnsPerPhase" && lockState?.turnsPerPhase}
                          handleToggleLock={() =>
                            handleToggleLock(
                              getPart2FieldPath(column.id, field.key),
                              lockState?.turnsPerPhase
                            )
                          }
                          isLocked={field.key === "turnsPerPhase" && lockState?.turnsPerPhase}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Part2;
