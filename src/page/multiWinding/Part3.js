import React from "react";
import { Container, CustomInput, FlexContainer } from "../../components";

const windingColumns = [
  {
    id: "lv",
    label: "LV",
    labelColor: "var(--mw-accent-blue)",
    materialPath: "lVConductorMaterial",
    dimensionKeys: {
      id: "lvid",
      radial: "lvradial",
      od: "lvod",
    },
  },
  {
    id: "hvMain",
    label: "HV-Main",
    labelColor: "var(--mw-accent-orange)",
    materialPath: "hVConductorMaterial",
    dimensionKeys: {
      id: "hvid",
      radial: "hvradial",
      od: "hvod",
    },
  },
  {
    id: "corse",
    label: "Corse",
    labelColor: "#475569",
    materialPath: "corseConductorMaterial",
  },
  {
    id: "fine",
    label: "Fine",
    labelColor: "#0f766e",
    materialPath: "fineConductorMaterial",
  },
  {
    id: "outer",
    label: "Outer",
    labelColor: "#b45309",
    materialPath: "outerConductorMaterial",
  },
];

const configurationColumns = {
  "2_WDG_LV_HV_MAIN": ["lv", "hvMain"],
  "3_WDG_LV_HV_MAIN_OUTER": ["lv", "hvMain", "outer"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": ["lv", "hvMain", "corse", "outer"],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": ["lv", "hvMain", "fine", "outer"],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": ["lv", "hvMain", "corse", "fine", "outer"],
};

const dimensionRows = [
  { key: "id", label: "ID" },
  { key: "radial", label: "Radial x 2" },
  { key: "od", label: "OD" },
];

const getVisibleWindings = (windingConfiguration) => {
  const visibleColumnIds =
    configurationColumns[windingConfiguration] || configurationColumns["2_WDG_LV_HV_MAIN"];

  return windingColumns.filter((column) => visibleColumnIds.includes(column.id));
};

const getDimensionValue = (formState, winding, dimensionKey) => {
  const existingKey = winding.dimensionKeys?.[dimensionKey];

  if (existingKey) {
    return formState?.coilDimensions?.[existingKey] || "";
  }

  return formState?.multiCoilDimensions?.[winding.id]?.[dimensionKey] || "";
};

const getDimensionPath = (winding, dimensionKey) => {
  const existingKey = winding.dimensionKeys?.[dimensionKey];

  if (existingKey) {
    return `coilDimensions.${existingKey}`;
  }

  return `multiCoilDimensions.${winding.id}.${dimensionKey}`;
};

const getGapKey = (leftWinding, rightWinding) =>
  `${leftWinding.id}To${rightWinding.id.charAt(0).toUpperCase()}${rightWinding.id.slice(1)}Gap`;

const getGapPath = (leftWinding, rightWinding) => {
  if (leftWinding.id === "lv" && rightWinding.id === "hvMain") {
    return "coilDimensions.lvhvgap";
  }

  if (leftWinding.id === "hvMain" && rightWinding.id === "outer") {
    return "coilDimensions.hvhvgap";
  }

  return `multiCoilDimensions.gaps.${getGapKey(leftWinding, rightWinding)}`;
};

const getValueByPath = (source, path) =>
  path.split(".").reduce((current, key) => current?.[key], source) ?? "";

const getConductorCostPath = (material) =>
  material === "Al" ? "cost.aluminiumCostPerKg" : "cost.copperCostPerKg";

const materialCostRows = [
  {
    label: "Core",
    weightPath: "core.coreWeight",
    costPath: "cost.coreCostPerKg",
    totalPath: "cost.totalCoreCost",
    highlighted: true,
  },
  {
    label: "Steel",
    weightPath: "tankAndOilFormulas.totalSteelWeight",
    costPath: "cost.steelCostPerKg",
    totalPath: "cost.totalSteelCost",
    highlighted: true,
  },
  {
    label: "Net Oil",
    weightPath: "tankAndOilFormulas.totalOil",
    costPath: "cost.oilCostPerKg",
    totalPath: "cost.totalOilCost",
    highlighted: true,
  },
  {
    label: "Insulation",
    weightPath: "tankAndOilFormulas.insulationWeight",
    costPath: "cost.insulationCostPerKg",
    totalPath: "cost.totalInsCost",
    highlighted: true,
  },
  {
    label: "Radiator",
    weightPath: "tankAndOilFormulas.totalRadiatorWeight",
    costPath: "cost.radiatorCostPerKg",
    totalPath: "cost.totalRadiatorCost",
    highlighted: true,
  },
];

const Part3 = ({ formState, handleInputChange }) => {
  const selectedConfiguration =
    formState?.windingConfiguration || "2_WDG_LV_HV_MAIN";
  const visibleWindings = getVisibleWindings(selectedConfiguration);
  const gridTemplateColumns = `minmax(120px, 0.8fr) repeat(${visibleWindings.length}, minmax(105px, 1fr))`;
  const clearanceFields = [
    {
      label: "Core-LV Clr",
      path: "coilDimensions.coreGap",
    },
    ...visibleWindings.slice(1).map((winding, index) => {
      const leftWinding = visibleWindings[index];

      return {
        label: `${leftWinding.label}-${winding.label} Clr`,
        path: getGapPath(leftWinding, winding),
      };
    }),
  ];
  const conductorCostRows = visibleWindings.map((winding) => {
    const material = getValueByPath(formState, winding.materialPath) || "Cu";

    return {
      label: `Conductor ${winding.label} (${material})`,
      weightPath: `multiCost.conductors.${winding.id}.weight`,
      costPath: getConductorCostPath(material),
      totalPath: `multiCost.conductors.${winding.id}.totalCost`,
      highlighted: true,
    };
  });
  const costRows = [...conductorCostRows, ...materialCostRows];

  return (
    <Container className="multi-winding-card" padding="20px">
      <div className="multi-winding-dimensions-cost-layout">
        <section className="multi-winding-dimensions-pane">
          <div className="multi-winding-card-head">
            <h2 className="multi-winding-section-title">Coil Winding Dimensions</h2>
          </div>

          <FlexContainer className="multi-winding-dimension-clearances" wrap="wrap" gap="12px">
            {clearanceFields.map((field) => (
              <CustomInput
                key={field.path}
                label={field.label}
                value={getValueByPath(formState, field.path)}
                onChange={(e) => handleInputChange(field.path, e.target.value)}
                bgColor="var(--app-input-accent-bg)"
                borderColor="var(--app-input-border)"
                width="130px"
              />
            ))}
          </FlexContainer>

          <div className="multi-winding-dimensions-grid-wrap">
            <div className="multi-winding-dimensions-grid" style={{ gridTemplateColumns }}>
              <div className="multi-winding-dimensions-header-cell multi-winding-dimensions-row-label">
                Parameter
              </div>
              {visibleWindings.map((winding) => (
                <div className="multi-winding-dimensions-header-cell" key={winding.id}>
                  <span
                    className="multi-winding-dimensions-header-text"
                    style={{ color: winding.labelColor }}
                  >
                    {winding.label}
                  </span>
                </div>
              ))}

              {dimensionRows.map((row, rowIndex) => {
                const isLastDimensionRow = rowIndex === dimensionRows.length - 1;

                return (
                  <React.Fragment key={row.key}>
                    <div
                      className={`multi-winding-dimensions-label-cell${
                        isLastDimensionRow ? " last-row" : ""
                      }`}
                    >
                      {row.label}
                    </div>
                    {visibleWindings.map((winding) => (
                      <div
                        className={`multi-winding-dimensions-value-cell${
                          isLastDimensionRow ? " last-row" : ""
                        }`}
                        key={`${winding.id}-${row.key}`}
                      >
                        <CustomInput
                          value={getDimensionValue(formState, winding, row.key)}
                          onChange={(e) =>
                            handleInputChange(
                              getDimensionPath(winding, row.key),
                              e.target.value
                            )
                          }
                          margin="0"
                          borderColor="var(--app-input-border)"
                        />
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="multi-winding-dimensions-footer">
            <span className="multi-winding-summary-label">Core Dia</span>
            <strong className="multi-winding-summary-value">
              {formState?.coilDimensions?.coreDia || "-"}
            </strong>
            <span className="multi-winding-summary-label">Active Part Size</span>
            <strong className="multi-winding-summary-value">
              {formState?.coilDimensions?.activePartSize || "-"}
            </strong>
          </div>
        </section>

        <section className="multi-winding-cost-section">
          <div className="multi-winding-card-head">
            <h2 className="multi-winding-section-title">Cost Estimations</h2>
          </div>

          <div className="multi-winding-cost-summary">
            <CustomInput
              label="Major Material Cost"
              value={formState?.cost?.capitalCost || ""}
              onChange={(e) => handleInputChange("cost.capitalCost", e.target.value)}
              bgColor="var(--app-input-accent-bg)"
              borderColor="var(--app-input-border)"
            />
          </div>

          <div className="multi-winding-cost-grid-wrap">
            <div className="multi-winding-cost-grid">
              <div className="multi-winding-cost-header-cell">Material</div>
              <div className="multi-winding-cost-header-cell">Weight</div>
              <div className="multi-winding-cost-header-cell">Cost / Kg</div>
              <div className="multi-winding-cost-header-cell">Total Cost</div>

              {costRows.map((row, index) => {
                const isLastRow = index === costRows.length - 1;

                return (
                  <React.Fragment key={row.label}>
                    <div
                      className={`multi-winding-cost-label-cell${
                        isLastRow ? " last-row" : ""
                      }`}
                    >
                      {row.label}
                    </div>
                    <div
                      className={`multi-winding-cost-value-cell${
                        isLastRow ? " last-row" : ""
                      }`}
                    >
                      <CustomInput
                        value={getValueByPath(formState, row.weightPath)}
                        onChange={(e) => handleInputChange(row.weightPath, e.target.value)}
                        margin="0"
                        borderColor="var(--app-input-border)"
                      />
                    </div>
                    <div
                      className={`multi-winding-cost-value-cell${
                        isLastRow ? " last-row" : ""
                      }`}
                    >
                      <CustomInput
                        value={getValueByPath(formState, row.costPath)}
                        onChange={(e) => handleInputChange(row.costPath, e.target.value)}
                        margin="0"
                        bgColor={
                          row.highlighted
                            ? "var(--app-input-accent-bg)"
                            : "var(--app-input-bg)"
                        }
                        borderColor="var(--app-input-border)"
                      />
                    </div>
                    <div
                      className={`multi-winding-cost-value-cell${
                        isLastRow ? " last-row" : ""
                      }`}
                    >
                      <CustomInput
                        value={getValueByPath(formState, row.totalPath)}
                        onChange={(e) => handleInputChange(row.totalPath, e.target.value)}
                        margin="0"
                        borderColor="var(--app-input-border)"
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Part3;
