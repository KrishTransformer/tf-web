import React from "react";
import {
  Container,
  CustomInput,
  FlexContainer,
  ToggleInput,
} from "../../components";

const windingOptions = [
  { label: "2 Wdg (LV and HV-Main)", value: "2_WDG_LV_HV_MAIN" },
  { label: "3 Wdg (LV, HV-Main and Outer)", value: "3_WDG_LV_HV_MAIN_OUTER" },
  { label: "4 Wdg (LV, HV-Main, Corse and Outer)", value: "4_WDG_LV_HV_MAIN_CORSE_OUTER" },
  { label: "4 Wdg (LV, HV-Main, Fine and Outer)", value: "4_WDG_LV_HV_MAIN_FINE_OUTER" },
  { label: "5 Wdg (LV, HV-Main, Corse, Fine and Outer)", value: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER" },
];

const coreMaterialOptions = [
  { label: "NipZD", value: "NipZD" },
  { label: "NipMOH", value: "NipMOH" },
  { label: "NipM3", value: "NipM3" },
  { label: "NipM4", value: "NipM4" },
  { label: "NipM5", value: "NipM5" },
  { label: "NipM6", value: "NipM6" },
  { label: "CRNO", value: "CRNO" },
  { label: "AksAK LC-M2", value: "AksAK LC-M2" },
  { label: "AksAK LC-M3", value: "AksAK LC-M3" },
  { label: "AksAK C-M3", value: "AksAK C-M3" },
  { label: "AksAK C-M4", value: "AksAK C-M4" },
  { label: "AksAK C-M5", value: "AksAK C-M5" },
  { label: "AksAK C-M6", value: "AksAK C-M6" },
  { label: "AksAK H-0DR", value: "AksAK H-0DR" },
  { label: "AksAK H-1DR", value: "AksAK H-1DR" },
  { label: "AksAK H-2DR", value: "AksAK H-2DR" },
  { label: "AksAK H-2C", value: "AksAK H-2C" },
  { label: "Pos23PHD080", value: "Pos23PHD080" },
  { label: "Pos23PHD085", value: "Pos23PHD085" },
  { label: "Pos23PH090", value: "Pos23PH090" },
  { label: "Pos23PH095", value: "Pos23PH095" },
  { label: "Pos23PH100", value: "Pos23PH100" },
  { label: "Pos27PHD090", value: "Pos27PHD090" },
  { label: "Pos27PH095", value: "Pos27PH095" },
  { label: "Pos27PH100", value: "Pos27PH100" },
  { label: "Pos27PG130", value: "Pos27PG130" },
  { label: "Pos30PG120", value: "Pos30PG120" },
  { label: "Pos30PG130", value: "Pos30PG130" },
  { label: "Pos30PG140", value: "Pos30PG140" },
  { label: "Pos30PH105", value: "Pos30PH105" },
  { label: "CRGO", value: "CRGO" },
];

const lvWindingTypeOptions = [
  { label: "Helical", value: "HELICAL" },
  { label: "Disc", value: "DISC" },
  { label: "Foil", value: "FOIL" },
  { label: "LayerDisc", value: "LAYERDISC" },
];

const hvWindingTypeOptions = [
  { label: "Helical", value: "HELICAL" },
  { label: "Disc", value: "DISC" },
  { label: "X-Over", value: "XOVER" },
];

const FieldSlot = ({ children, wide = false }) => (
  <div className={`multi-winding-field${wide ? " multi-winding-field-wide" : ""}`}>
    {children}
  </div>
);

const lossFields = [
  {
    label: "Tank Loss",
    path: "tank.tankLoss",
    getValue: (formState) => formState?.tank?.tankLoss,
    highlighted: true,
  },
  {
    label: "Load Loss",
    path: "loadLoss",
    getValue: (formState) => formState?.loadLoss,
  },
  {
    label: "Core Loss",
    path: "coreLoss",
    getValue: (formState) => formState?.coreLoss,
  },
  {
    label: "Limit W",
    path: "limitW",
    getValue: (formState) => formState?.limitW,
    highlighted: true,
  },
  {
    label: "Limit EZ",
    path: "limitEz",
    getValue: (formState) => formState?.limitEz,
    highlighted: true,
  },
  {
    label: "EZ",
    path: "ez",
    getValue: (formState) => formState?.ez,
  },
  {
    label: "Losses at 50%",
    path: "lossesAt50Percent",
    getValue: (formState) => formState?.lossesAt50Percent,
  },
  {
    label: "Losses at 100%",
    path: "lossesAt100Percent",
    getValue: (formState) => formState?.lossesAt100Percent,
  },
];

const coreDetailFields = [
  {
    label: "Build Factor",
    path: "buildFactor",
    getValue: (formState) => formState?.buildFactor,
  },
  {
    label: "Flux Density",
    path: "fluxDensity",
    getValue: (formState) => formState?.fluxDensity,
  },
  {
    label: "Core Diameter",
    path: "core.coreDia",
    getValue: (formState) => formState?.core?.coreDia,
    highlighted: true,
  },
  {
    label: "Limb Ht.",
    path: "core.limbHt",
    getValue: (formState) => formState?.core?.limbHt,
    highlighted: true,
  },
  {
    label: "Cen Dist",
    path: "core.cenDist",
    getValue: (formState) => formState?.core?.cenDist,
  },
  {
    label: "Net Core Area",
    path: "core.area",
    getValue: (formState) => formState?.core?.area,
    highlighted: true,
  },
  {
    label: "W/Kg",
    path: "hvFormulas.specificLoss",
    getValue: (formState) => formState?.hvFormulas?.specificLoss,
  },
];

const coreTypeOptions = [
  { label: "Prime", value: "PRIME" },
  { label: "Step-Lap", value: "STEP_LAP" },
];

const part1WindingRows = [
  { label: "Cond. Size", key: "conductorSizes" },
  { label: "Load Loss", key: "loadLoss" },
  { label: "Temp. Grad.", key: "tempGradDegC" },
];

const tankDetailFields = [
  { label: "Wdg-Tank Gap", path: "tank.wdgToTankGap", highlighted: true },
  { label: "Connection Gap", path: "tank.connectionGap", highlighted: true },
  { label: "Top Yoke - Cover", path: "tank.topYokeToCoverGap", highlighted: true },
  { label: "Tank Length", path: "tank.tankLength" },
  { label: "Tank Width", path: "tank.tankWidth" },
  { label: "Tank Height", path: "tank.tankHeight" },
  { label: "Tank Capacity", path: "tank.tankCapacity" },
];

const coolingMethodOptions = [
  { label: "Radiator", value: "RADIATOR" },
  { label: "Pipes", value: "PIPES" },
  { label: "Corrugation", value: "CORRUGATION" },
];

const coolingDetailFields = [
  { label: "Winding Temp", path: "windingTemp", highlighted: true },
  { label: "Oil Temp", path: "topOilTemp", highlighted: true },
  { label: "Amb. Temp", path: "ambientTemp", highlighted: true },
  {
    label: "Radiator Width",
    path: "radiatorWidth",
    getValue: (formState) =>
      formState?.radiatorWidth || formState?.tankAndOilFormulas?.radiatorWidth,
  },
  { label: "Conservator Dia", path: "tankAndOilFormulas.conservatorDia" },
  { label: "Conservator Length", path: "tankAndOilFormulas.conservatorLength" },
];

const getValueByPath = (source, path) =>
  path.split(".").reduce((current, key) => current?.[key], source) ?? "";

const Part1 = ({ formState, handleInputChange }) => {
  const selectedWindingConfiguration =
    formState?.windingConfiguration || windingOptions[0].value;
  const sectionColors = {
    lvAccent: "var(--mw-accent-blue)",
    hvAccent: "var(--mw-accent-orange)",
    corseAccent: "#475569",
    fineAccent: "#0f766e",
    outerAccent: "#b45309",
  };
  const showCorse =
    selectedWindingConfiguration === "4_WDG_LV_HV_MAIN_CORSE_OUTER" ||
    selectedWindingConfiguration === "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER";
  const showFine =
    selectedWindingConfiguration === "4_WDG_LV_HV_MAIN_FINE_OUTER" ||
    selectedWindingConfiguration === "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER";
  const showOuter =
    selectedWindingConfiguration === "3_WDG_LV_HV_MAIN_OUTER" ||
    selectedWindingConfiguration === "4_WDG_LV_HV_MAIN_CORSE_OUTER" ||
    selectedWindingConfiguration === "4_WDG_LV_HV_MAIN_FINE_OUTER" ||
    selectedWindingConfiguration === "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER";
  const visibleWindingFields = [
    {
      id: "lv",
      label: "LV",
      labelColor: sectionColors.lvAccent,
      voltagePath: "lowVoltage",
      windingTypePath: "lvWindingType",
      windingTypeOptions: lvWindingTypeOptions,
      windingTypeDefault: "HELICAL",
      currentDensityPath: "lvCurrentDensity",
      conductorMaterialPath: "lVConductorMaterial",
    },
    {
      id: "hvMain",
      label: "HV-Main",
      labelColor: sectionColors.hvAccent,
      voltagePath: "highVoltage",
      windingTypePath: "hvWindingType",
      windingTypeOptions: hvWindingTypeOptions,
      windingTypeDefault: "HELICAL",
      currentDensityPath: "hvCurrentDensity",
      conductorMaterialPath: "hVConductorMaterial",
    },
    ...(showCorse
      ? [
          {
            id: "corse",
            label: "Corse",
            labelColor: sectionColors.corseAccent,
            voltagePath: "corseVoltage",
            windingTypePath: "corseWindingType",
            windingTypeOptions: hvWindingTypeOptions,
            windingTypeDefault: "HELICAL",
            currentDensityPath: "corseCurrentDensity",
            conductorMaterialPath: "corseConductorMaterial",
          },
        ]
      : []),
    ...(showFine
      ? [
          {
            id: "fine",
            label: "Fine",
            labelColor: sectionColors.fineAccent,
            voltagePath: "fineVoltage",
            windingTypePath: "fineWindingType",
            windingTypeOptions: hvWindingTypeOptions,
            windingTypeDefault: "HELICAL",
            currentDensityPath: "fineCurrentDensity",
            conductorMaterialPath: "fineConductorMaterial",
          },
        ]
      : []),
    ...(showOuter
      ? [
          {
            id: "outer",
            label: "Outer",
            labelColor: sectionColors.outerAccent,
            voltagePath: "outerVoltage",
            windingTypePath: "outerWindingType",
            windingTypeOptions: hvWindingTypeOptions,
            windingTypeDefault: "HELICAL",
            currentDensityPath: "outerCurrentDensity",
            conductorMaterialPath: "outerConductorMaterial",
          },
        ]
      : []),
  ];
  const windingTableColumns = `minmax(118px, 0.75fr) repeat(${visibleWindingFields.length}, minmax(120px, 1fr))`;

  return (
    <Container className="multi-winding-card" padding="22px">
      <div className="multi-winding-input-layout">
        <div className="multi-winding-input-main">
          <div className="multi-winding-form-stack">
            <FlexContainer className="multi-winding-form-row" justify="flex-start" wrap="wrap" gap="12px">
              <CustomInput
                  label="Winding Configuration"
                  type="dropdown"
                  options={windingOptions}
                  value={selectedWindingConfiguration}
                  onChange={(e) =>
                    handleInputChange("windingConfiguration", e.target.value)
                  }
                />
            </FlexContainer>

            <FlexContainer className="multi-winding-form-row" align="center" justify="flex-start" wrap="wrap" gap="12px">
              <FieldSlot>
                <CustomInput
                  label="kVA"
                  value={formState?.kVA}
                  onChange={(e) => handleInputChange("kVA", e.target.value)}
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="Primary Voltage"
                  value={formState?.primaryVoltage}
                  onChange={(e) => handleInputChange("primaryVoltage", e.target.value)}
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="Secondary Voltage"
                  value={formState?.secondaryVoltage}
                  onChange={(e) => handleInputChange("secondaryVoltage", e.target.value)}
                />
              </FieldSlot>
               <FieldSlot>
                <CustomInput
                  label="Frequency"
                  value={formState?.frequency}
                  onChange={(e) => handleInputChange("frequency", e.target.value)}
                  bgColor="var(--app-input-accent-bg)"
                  borderColor="var(--app-input-border)"
                />
              </FieldSlot>
            </FlexContainer>

            <FlexContainer className="multi-winding-form-row" align="center" justify="flex-start" wrap="wrap" gap="12px">
              <FieldSlot>
                <CustomInput
                  label="Connection"
                  type="dropdown"
                  options={[
                    { label: "Dyn11", value: "Dyn11" },
                    { label: "Dd0", value: "Dd0" },
                    { label: "Yyn0", value: "Yyn0" },
                    { label: "Yd11", value: "Yd11" },
                  ]}
                  value={formState?.vectorGroup || "Dyn11"}
                  onChange={(e) => handleInputChange("vectorGroup", e.target.value)}
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="Tap Steps %"
                  value={formState?.tapStepsPercent}
                  onChange={(e) =>
                    handleInputChange("tapStepsPercent", e.target.value)
                  }
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="+ ve"
                  value={formState?.tapStepsPositive}
                  onChange={(e) =>
                    handleInputChange("tapStepsPositive", e.target.value)
                  }
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="- ve"
                  value={formState?.tapStepsNegative}
                  onChange={(e) =>
                    handleInputChange("tapStepsNegative", e.target.value)
                  }
                />
              </FieldSlot>
              <FieldSlot>
                <CustomInput
                  label="Tap Changer"
                  type="dropdown"
                  options={[
                    { label: "OCTC", value: "OCTC" },
                    { label: "OLTC", value: "OLTC" },
                  ]}
                  value={formState?.isOLTC ? "OLTC" : "OCTC"}
                  onChange={(e) =>
                    handleInputChange(
                      "isOLTC",
                      e.target.value === "OCTC" ? false : true
                    )
                  }
                />
              </FieldSlot>
            </FlexContainer>

            <div className="multi-winding-part1-table-wrap">
              <div
                className="multi-winding-part1-table"
                style={{ gridTemplateColumns: windingTableColumns }}
              >
                <div className="multi-winding-part1-table-header multi-winding-part1-table-label">
                  Parameter
                </div>
                {visibleWindingFields.map((winding, index) => (
                  <div
                    className={`multi-winding-part1-table-header${
                      index === visibleWindingFields.length - 1 ? " last-column" : ""
                    }`}
                    key={winding.id}
                  >
                    <span style={{ color: winding.labelColor }}>{winding.label}</span>
                  </div>
                ))}

                <div className="multi-winding-part1-table-row-label">Voltage</div>
                {visibleWindingFields.map((winding, index) => (
                  <div
                    className={`multi-winding-part1-table-cell${
                      index === visibleWindingFields.length - 1 ? " last-column" : ""
                    }`}
                    key={`${winding.id}-voltage`}
                  >
                    <CustomInput
                      value={formState?.[winding.voltagePath] || ""}
                      onChange={(e) => handleInputChange(winding.voltagePath, e.target.value)}
                      margin="0"
                      borderColor="var(--app-input-border)"
                    />
                  </div>
                ))}

                <div className="multi-winding-part1-table-row-label">Winding Type</div>
                {visibleWindingFields.map((winding, index) => (
                  <div
                    className={`multi-winding-part1-table-cell${
                      index === visibleWindingFields.length - 1 ? " last-column" : ""
                    }`}
                    key={`${winding.id}-type`}
                  >
                    <CustomInput
                      type="dropdown"
                      options={winding.windingTypeOptions}
                      value={formState?.[winding.windingTypePath] || winding.windingTypeDefault}
                      onChange={(e) =>
                        handleInputChange(winding.windingTypePath, e.target.value)
                      }
                      margin="0"
                      borderColor="var(--app-input-border)"
                    />
                  </div>
                ))}

                <div className="multi-winding-part1-table-row-label">Current Density</div>
                {visibleWindingFields.map((winding, index) => (
                  <div
                    className={`multi-winding-part1-table-cell multi-winding-part1-toggle-cell${
                      index === visibleWindingFields.length - 1 ? " last-column" : ""
                    }`}
                    key={`${winding.id}-current-density`}
                  >
                    <ToggleInput
                      label={`${winding.label} Current Density`}
                      labelColor={winding.labelColor}
                      value={formState?.[winding.currentDensityPath]}
                      valueOfToggle={formState?.[winding.conductorMaterialPath]}
                      onValueChange={(value) =>
                        handleInputChange(winding.currentDensityPath, value)
                      }
                      onLabelChange={(value) =>
                        handleInputChange(winding.conductorMaterialPath, value)
                      }
                      formState={formState}
                    />
                  </div>
                ))}

                {part1WindingRows.map((row, rowIndex) => {
                  const isLastRow = rowIndex === part1WindingRows.length - 1;

                  return (
                    <React.Fragment key={row.key}>
                      <div
                        className={`multi-winding-part1-table-row-label${
                          isLastRow ? " last-row" : ""
                        }`}
                      >
                        {row.label}
                      </div>
                      {visibleWindingFields.map((winding, index) => (
                        <div
                          className={`multi-winding-part1-table-cell${
                            isLastRow ? " last-row" : ""
                          }${
                            index === visibleWindingFields.length - 1
                              ? " last-column"
                              : ""
                          }`}
                          key={`${row.key}-${winding.id}`}
                        >
                          <CustomInput
                            value={formState?.part2Windings?.[winding.id]?.[row.key] || ""}
                            onChange={(e) =>
                              handleInputChange(
                                `part2Windings.${winding.id}.${row.key}`,
                                e.target.value
                              )
                            }
                            margin="0"
                            bgColor={
                              row.key === "conductorSizes"
                                ? "var(--app-input-accent-bg)"
                                : "var(--app-input-bg)"
                            }
                            borderColor="var(--app-input-border)"
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="multi-winding-side-panel-stack">
          <div className="multi-winding-core-details-panel">
            <div className="multi-winding-core-details-grid">
              {coreDetailFields.map((field) => (
                <CustomInput
                  key={field.path}
                  label={field.label}
                  value={field.getValue(formState) || ""}
                  onChange={(e) => handleInputChange(field.path, e.target.value)}
                  bgColor={
                    field.highlighted
                      ? "var(--app-input-accent-bg)"
                      : "var(--app-input-bg)"
                  }
                  borderColor="var(--app-input-border)"
                />
              ))}
              <CustomInput
                label="Core Material"
                type="dropdown"
                options={coreMaterialOptions}
                value={formState?.core?.coreMaterial || "NipM4"}
                onChange={(e) => handleInputChange("core.coreMaterial", e.target.value)}
              />
              <CustomInput
                label="Core Type"
                type="dropdown"
                options={coreTypeOptions}
                value={formState?.core?.coreType || "PRIME"}
                onChange={(e) => handleInputChange("core.coreType", e.target.value)}
              />
            </div>
          </div>

          <div className="multi-winding-vpt-card">
            <span className="multi-winding-vpt-label">Volts Per Turn</span>
            <strong className="multi-winding-vpt-value">
              {formState?.voltsPerTurn || "-"}
            </strong>
          </div>

          <div className="multi-winding-losses-panel">
            <div className="multi-winding-losses-grid">
              {lossFields.map((field) => (
                <CustomInput
                  key={field.path}
                  label={field.label}
                  value={field.getValue(formState) || ""}
                  onChange={(e) => handleInputChange(field.path, e.target.value)}
                  bgColor={
                    field.highlighted
                      ? "var(--app-input-accent-bg)"
                      : "var(--app-input-bg)"
                  }
                  borderColor="var(--app-input-border)"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="multi-winding-tank-cooling-layout">
        <section className="multi-winding-tank-cooling-card">
          <div className="multi-winding-tank-cooling-head">
            <h2 className="multi-winding-card-title">Tank Details</h2>
          </div>
          <div className="multi-winding-tank-cooling-grid">
            {tankDetailFields.map((field) => (
              <CustomInput
                key={field.path}
                label={field.label}
                value={getValueByPath(formState, field.path)}
                onChange={(e) => handleInputChange(field.path, e.target.value)}
                bgColor={
                  field.highlighted
                    ? "var(--app-input-accent-bg)"
                    : "var(--app-input-bg)"
                }
                borderColor="var(--app-input-border)"
              />
            ))}
          </div>
          <div className="multi-winding-detail-summary">
            <span>Tank (L x B x H)</span>
            <strong>{formState?.tank?.tankDimension || "-"}</strong>
            <span>Overall Dimensions</span>
            <strong>{formState?.tank?.overallDimension || "-"}</strong>
          </div>
        </section>

        <section className="multi-winding-tank-cooling-card">
          <div className="multi-winding-tank-cooling-head">
            <h2 className="multi-winding-card-title">Cooling Details</h2>
          </div>
          <div className="multi-winding-tank-cooling-grid">
            <CustomInput
              label="Cooling Method"
              type="dropdown"
              options={coolingMethodOptions}
              value={formState?.eRadiatorType || "RADIATOR"}
              onChange={(e) => handleInputChange("eRadiatorType", e.target.value)}
            />
            {coolingDetailFields.map((field) => (
              <CustomInput  
                key={field.path}
                label={field.label}
                value={field.getValue ? field.getValue(formState) || "" : getValueByPath(formState, field.path)}
                onChange={(e) => handleInputChange(field.path, e.target.value)}
                bgColor={
                  field.highlighted
                    ? "var(--app-input-accent-bg)"
                    : "var(--app-input-bg)"
                }
                borderColor="var(--app-input-border)"
              />
            ))}
          </div>
          <div className="multi-winding-cooling-statement">
            {formState?.tankAndOilFormulas?.coolingStatement || "Details can be displayed"}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Part1;
