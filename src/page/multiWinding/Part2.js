import React from "react";
import { Container, CustomInput } from "../../components";

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

const getPart2FieldValue = (formState, columnId, fieldKey) => {
  if (fieldKey === "discDuctSize") {
    if (columnId === "lv") {
      return (
        formState?.innerWindings?.discDuctSize ||
        formState?.part2Windings?.lv?.discDuctSize ||
        ""
      );
    }

    if (columnId === "hvMain") {
      return (
        formState?.outerWindings?.discDuctSize ||
        formState?.part2Windings?.hvMain?.discDuctSize ||
        ""
      );
    }
  }

  return formState?.part2Windings?.[columnId]?.[fieldKey] || "";
};

const getPart2FieldPath = (columnId, fieldKey) => {
  if (fieldKey === "discDuctSize") {
    if (columnId === "lv") {
      return "innerWindings.discDuctSize";
    }

    if (columnId === "hvMain") {
      return "outerWindings.discDuctSize";
    }
  }

  return `part2Windings.${columnId}.${fieldKey}`;
};

const Part2 = ({ formState, handleInputChange }) => {
  const selectedConfiguration =
    formState?.windingConfiguration || "2_WDG_LV_HV_MAIN";
  const visibleColumns = windingColumns.filter((column) =>
    (configurationColumns[selectedConfiguration] || configurationColumns["2_WDG_LV_HV_MAIN"]).includes(
      column.id
    )
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

                {visibleColumns.map((column) => (
                  <div
                    className={`multi-winding-part2-input-cell${
                      field.highlighted ? " highlighted" : ""
                    }${isLastRow ? " last-row" : ""}`}
                    key={`${field.key}-${column.id}`}
                  >
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
                    />
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Part2;
