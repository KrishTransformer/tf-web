import React from "react";
import {
  CustomInput,
  Container,
  TextTypo,
} from "../../components";
import Input2WithModal from "../../components/input2WithModal/Input2WithModal";
import Input2WithRadioModal from "../../components/input2WithRadioModal/Input2WithRadioModal";
import ToggleInput2 from "../../components/toggleInput2/ToggleInput2";

const Part2 = ({
  formState,
  handleInputChange,
  handleToggleLock,
  lockedAttributes,
  handleHover,
  handleMouseLeave,
}) => {
  const isDryType = formState.dryType === true || formState.dryType === "true";
  const sectionColors = {
    lvAccent: "var(--tw-accent-blue)",
    hvAccent: "var(--tw-accent-orange)",
    fieldBase: "var(--app-input-bg)",
    fieldHighlight: "var(--app-input-accent-bg)",
  };
  const defaultFieldColors = {
    bgColorLV: sectionColors.fieldBase,
    bgColorHV: sectionColors.fieldBase,
  };
  const highlightedFieldColors = {
    bgColorLV: sectionColors.fieldHighlight,
    bgColorHV: sectionColors.fieldHighlight,
  };
  const showDiscDuctSizeRow =
    formState?.lvWindingType === "DISC" || formState?.hvWindingType === "DISC";
  const fieldData = [
    {
      key: "turnsPerPhase",
      label: "No. of Turns",
      ...highlightedFieldColors,
      showUnlockIconLv: true,
    },
    { key: "phaseCurrent", label: "Phase Current (A)" },
    {
      key: "currentDensity",
      label: "Current Density (A/mm2)",
    },
    {
      key: "condCrossSec",
      label: "Cond. Cross Sec (mm2)",
    },
    {
      key: "conductorSizes",
      label: "Conductor Sizes (mm)",
      ...highlightedFieldColors,
      showUnlockIconLv: true,
      showUnlockIconHv: true,
      label1: "Breadth",
      label2: "Height",
      label3: "Diameter",
      key1: "condBreadth",
      key2: "condHeight",
      key3: "conductorDiameter",
      key4: "isConductorRound",
      radio1: "Round",
      radio2: "Strip",
    },
    {
      key: "condInsulation",
      label: "Cond. Insulation (mm)",
      ...highlightedFieldColors,
    },
    {
      key: "noInParallel",
      label: "No. in Parallel",
      ...highlightedFieldColors,
      showUnlockIconLv: true,
      showUnlockIconHv: true,
      label1: "No in Radial",
      label2: "No in Axial",
      key1: "radialParallelCond",
      key2: "axialParallelCond",
      description: "Enter number in Radial and number in Axial",
    },
    {
      key: "windingLength",
      label: "Winding Length (mm)",
    },
    {
      key: "noOfLayers",
      label: "No. of Layers",
      ...highlightedFieldColors,
    },
    {
      key: "interLayerInsulation",
      label: "Inter Layer Insulation (mm)",
      ...highlightedFieldColors,
    },
    {
      key: "noOfDuctsWidth",
      label: "No. of Ducts / Width",
      ...highlightedFieldColors,
      label1: "No Of Ducts",
      label2: "Duct Width",
      key1: "ducts",
      key2: "ductSize",
      description: "Enter no of Ducts and Width",
    },
    {
      key: "discDuctSize",
      label: "Disc Duct Size (mm)",
      ...highlightedFieldColors,
    },
    { key: "turnsLayers", label: "Turns / Layers" },
    {
      key: "endClearances",
      label: "End Clearances (mm)",
      ...highlightedFieldColors,
    },
    { key: "eddyStrayLoss", label: "Eddy (Stray) Loss (%)" },
    { key: "tempGradDegC", label: "Temp. Grad. deg C" },
    { key: "weightBareInsulated", label: "Wgt Bare / Insulated (Kg)" },
    { key: "loadLoss", label: "Load Loss (W)" },
    // { key: "terminal", label: "Terminal" },
    // { key: "commRawCond", label: "Comm. Raw Cond." },
  ]
    .filter((field) => field.key !== "discDuctSize" || showDiscDuctSizeRow)
    .map((field) => ({
      ...defaultFieldColors,
      ...field,
    }));

  return (
    <Container className="two-winding-card" bgColor="var(--tw-surface)" padding="30px 20px" borderRadius="10px">
      <div className="d-flex justify-content-between">
        <TextTypo
          text="Inner Winding LV"
          fontColor={sectionColors.lvAccent}
          margin="10px 0px"
        />
        <TextTypo
          text="Outer Winding HV"
          fontColor={sectionColors.hvAccent}
          margin="10px 0px"
        />
      </div>
      {fieldData.map((field, index) =>
        field.key == "noOfDuctsWidth" || field.key == "noInParallel" ? (
          <div className="row align-items-center" key={index}>
            <div className="col-4">

              <Input2WithModal
                modalLabel={field.label}
                label1={field.label1}
                label2={field.label2}
                description={field.description}
                value={
                  field.key == "noInParallel"
                    ? `R${formState?.innerWindings?.[field.key1]} x A${formState?.innerWindings?.[field.key2]
                    }=` +
                    formState?.innerWindings?.[field.key1] *
                    formState?.innerWindings?.[field.key2]
                    : `${formState?.innerWindings?.[field.key1]} / ${formState?.innerWindings?.[field.key2]
                    }`
                }
                attributeName1={`innerWindings.${field.key1}`}
                attributeName2={`innerWindings.${field.key2}`}
                value1={formState?.innerWindings?.[field.key1]}
                value2={formState?.innerWindings?.[field.key2]}
                onChange={handleInputChange}
                bgColor={field.bgColorLV}
                borderColor={field.borderColorLV}
                showUnlockIcon={field.showUnlockIconLv}
                handleToggleLock={(e) =>
                  handleToggleLock(
                    `innerWindings.${field.key}`,
                    lockedAttributes?.innerWindings?.[field.key]
                  )
                }
                isLocked={lockedAttributes?.innerWindings?.[field.key]}
                {...(field.key === "noOfDuctsWidth" && {
                  onMouseEnter: () => handleHover("lvDuctWidthComment"),
                  onMouseLeave: () => handleMouseLeave(),
                })}
              />

            </div>

            <div className="col">
              <TextTypo
                text={field.label}
                fontSize="13px"
                fontWeight="600"
                fontColor="var(--tw-page-text)"
                textAlign="center"
              />
            </div>

            <div className="col-4">
              <Input2WithModal
                modalLabel={field.label}
                label1={field.label1}
                label2={field.label2}
                description={field.description}
                value={
                  field.key == "noInParallel"
                    ? `R${formState?.outerWindings?.[field.key1]} x A${formState?.outerWindings?.[field.key2]
                    }=` +
                    formState?.outerWindings?.[field.key1] *
                    formState?.outerWindings?.[field.key2]
                    : `${formState?.outerWindings?.[field.key1]} / ${formState?.outerWindings?.[field.key2]
                    }`
                }
                attributeName1={`outerWindings.${field.key1}`}
                attributeName2={`outerWindings.${field.key2}`}
                value1={formState?.outerWindings?.[field.key1]}
                value2={formState?.outerWindings?.[field.key2]}
                onChange={handleInputChange}
                bgColor={field.bgColorLV}
                borderColor={field.borderColorLV}
                showUnlockIcon={field.showUnlockIconHv}
                handleToggleLock={(e) =>
                  handleToggleLock(
                    `outerWindings.${field.key}`,
                    lockedAttributes?.outerWindings?.[field.key]
                  )
                }
                isLocked={lockedAttributes?.outerWindings?.[field.key]}
                {...(field.key === "noOfDuctsWidth" && {
                  onMouseEnter: () => handleHover("hvDuctWidthComment"),
                  onMouseLeave: () => handleMouseLeave(),
                })}
              />
            </div>
          </div>
        ) : field.key == "conductorSizes" ? (
          <div className="row align-items-center" key={index}>
            <div className="col-4">
              <Input2WithRadioModal
                modalLabel={field.label}
                label1={field.label1}
                label2={field.label2}
                label3={field.label3}
                description={field.description}
                value={
                  formState?.innerWindings?.isConductorRound
                    ? `Round ${formState?.innerWindings?.[field.key3]}`
                    : `${formState?.innerWindings?.[field.key1]} x ${formState?.innerWindings?.[field.key2]
                    }`
                }
                attributeName1={`innerWindings.${field.key1}`}
                attributeName2={`innerWindings.${field.key2}`}
                attributeName3={`innerWindings.${field.key3}`}
                attributeName4={`innerWindings.${field.key4}`}
                value1={formState?.innerWindings?.[field.key1]}
                value2={formState?.innerWindings?.[field.key2]}
                value3={formState?.innerWindings?.[field.key3]}
                radio1={field.radio1}
                radio2={field.radio2}
                isConductorRound={
                  formState?.innerWindings?.isConductorRound == true
                    ? "Round"
                    : "Strip"
                }
                onChange={handleInputChange}
                bgColor={field.bgColorLV}
                borderColor={field.borderColorLV}
                showUnlockIcon={field.showUnlockIconLv}
                handleToggleLock={(e) =>
                  handleToggleLock(
                    `innerWindings.${field.key}`,
                    lockedAttributes?.innerWindings?.[field.key]
                  )
                }
                isLocked={lockedAttributes?.innerWindings?.[field.key]}
              />
            </div>
            <div className="col">
              <TextTypo
                text={field.label}
                fontSize="13px"
                fontWeight="600"
                fontColor="var(--tw-page-text)"
                textAlign="center"
              />
            </div>
            <div className="col-4">
              <Input2WithRadioModal
                modalLabel={field.label}
                label1={field.label1}
                label2={field.label2}
                label3={field.label3}
                description={field.description}
                value={
                  formState?.outerWindings?.isConductorRound
                    ? `Round ${formState?.outerWindings?.[field.key3]}`
                    : `${formState?.outerWindings?.[field.key1]} x ${formState?.outerWindings?.[field.key2]
                    }`
                }
                attributeName1={`outerWindings.${field.key1}`}
                attributeName2={`outerWindings.${field.key2}`}
                attributeName3={`outerWindings.${field.key3}`}
                attributeName4={`outerWindings.${field.key4}`}
                value1={formState?.outerWindings?.[field.key1]}
                value2={formState?.outerWindings?.[field.key2]}
                value3={formState?.outerWindings?.[field.key3]}
                radio1={field.radio1}
                radio2={field.radio2}
                isConductorRound={
                  formState?.outerWindings?.isConductorRound == true
                    ? "Round"
                    : "Strip"
                }
                onChange={handleInputChange}
                bgColor={field.bgColorLV}
                borderColor={field.borderColorLV}
                showUnlockIcon={field.showUnlockIconHv}
                handleToggleLock={(e) =>
                  handleToggleLock(
                    `outerWindings.${field.key}`,
                    lockedAttributes?.outerWindings?.[field.key]
                  )
                }
                isLocked={lockedAttributes?.outerWindings?.[field.key]}
              />
            </div>
          </div>
        )
          : field.key == "condInsulation" ? (
            <div className="row align-items-center" key={index}>
              <div className="col-4">
                <ToggleInput2
                  // label={field.label}
                  labelColor={sectionColors.lvAccent}
                  value={formState.innerWindings.condInsulation}
                  onValueChange={(val) =>
                    handleInputChange("innerWindings.condInsulation", val)
                  }
                  isEnamel={formState.innerWindings.isEnamel}
                  onToggleChange={(val) =>
                    handleInputChange("innerWindings.isEnamel", val)
                  }
                  onMouseEnter={() => handleHover("lvCondInsComment")}
                  onMouseLeave={() => handleMouseLeave()}
                />
              </div>
              <div className="col">
                <TextTypo
                  text={field.label}
                  fontSize="13px"
                  fontWeight="600"
                  fontColor="var(--tw-page-text)"
                  textAlign="center"
                />
              </div>
              <div className="col-4">
                <ToggleInput2
                  // label={field.label}
                  labelColor={sectionColors.hvAccent}
                  value={formState.outerWindings.condInsulation}
                  onValueChange={(val) =>
                    handleInputChange("outerWindings.condInsulation", val)
                  }
                  isEnamel={formState.outerWindings.isEnamel || false}
                  onToggleChange={(val) =>
                    handleInputChange("outerWindings.isEnamel", val)
                  }
                  onMouseEnter={() => handleHover("hvCondInsComment")}
                  onMouseLeave={() => handleMouseLeave()}
                />
              </div>
            </div>
          )
            //  : field.key == "endClearances" ? (
            //   <div className="row align-items-center" key={index}>
            //     <div className="col-4">
            //       <InputWithRadioModal
            //         showLabelForField={false}
            //         label="End Clearance"
            //         description={"Note: Changing the LV end clearance impacts limb height if the conductors are kept constant. Change conductors to keep limb height constant"}
            //         value={formState?.innerWindings?.endClearances}
            //         onChange={(val) =>
            //           handleInputChange("innerWindings.endClearances", val)
            //         }
            //         attributeName=""
            //         showUnlockIcon={false}
            //       />
            //     </div>
            //     <div className="col">
            //       <TextTypo
            //         text={field.label}
            //         fontSize="13px"
            //         fontWeight="600"
            //         fontColor="#000"
            //         textAlign="center"
            //       />
            //     </div>
            //     <div className="col-4">
            //       <CustomInput
            //         value={formState?.outerWindings?.endClearances}
            //         onChange={(val) =>
            //           handleInputChange("outerWindings.endClearances", val)
            //         }
            //         showUnlockIcon={false}
            //       />
            //     </div>
            //   </div>
            // )

            : (
              <div className="row align-items-center" key={index}>
                <div className="col-4">
                  <CustomInput
                    value={
                      formState?.innerWindings
                        ? field.key == "windingLength"
                          ? formState?.lvFormulas?.lvTransposition != 0
                            ? `${formState?.innerWindings?.windingLength} + T(${formState?.lvFormulas?.lvTransposition})`
                            : formState?.innerWindings?.windingLength
                          : formState?.innerWindings[field.key]
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        `innerWindings.${field.key}`,
                        e.target.value
                      )
                    }
                    bgColor={field.bgColorLV}
                    borderColor={field.borderColorLV}
                    showUnlockIcon={field.showUnlockIconLv}
                    readOnly={lockedAttributes?.innerWindings?.[field.key]}
                    handleToggleLock={(e) =>
                      handleToggleLock(
                        `innerWindings.${field.key}`,
                        lockedAttributes?.innerWindings?.[field.key]
                      )
                    }
                    isLocked={lockedAttributes?.innerWindings?.[field.key]}

                    {...(field.key === "interLayerInsulation" && {
                      onMouseEnter: () => handleHover("lvInterLayerInsComment"),
                      onMouseLeave: () => handleMouseLeave(),
                    })}

                    {...(field.key === "endClearances" && {
                      onMouseEnter: () => handleHover("lvEndClrComment"),
                      onMouseLeave: () => handleMouseLeave(),
                    })}

                  />
                </div>
                <div className="col">
                  <TextTypo
                    text={field.label}
                    fontSize="13px"
                    fontWeight="600"
                  fontColor="var(--tw-page-text)"
                    textAlign="center"
                  />
                </div>
                <div className="col-4">
                  <CustomInput
                    value={
                      formState?.outerWindings
                        ? field.key == "turnsPerPhase"
                          ? `${formState?.outerWindings?.turnsPerPhase} + (${formState?.hvFormulas?.hvTurnsAtHighest -
                          formState?.outerWindings?.turnsPerPhase
                          })`
                          : field.key == "windingLength"
                            ? formState?.hvFormulas?.hvTransposition != 0
                              ? `${formState?.outerWindings?.windingLength} + T(${formState?.hvFormulas?.hvTransposition})`
                              : formState?.outerWindings?.windingLength
                            : field.key == "currentDensity"
                              ? `${formState?.hvFormulas?.hVRevisedCurrDenAtNormal} (${formState?.hvFormulas?.hVRevisedCurrDenAtLowest})`
                              : field.key == "loadLoss"
                                ? `${formState?.hvFormulas?.hvLoadLossAtNormal} (${formState?.hvFormulas?.hvLoadLossAtLowest})`
                                : formState?.outerWindings[field.key]
                        : 0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        `outerWindings.${field.key}`,
                        e.target.value
                      )
                    }
                    bgColor={field.bgColorHV}
                    borderColor={field.borderColorHV}
                    showUnlockIcon={field.showUnlockIconHv}
                    readOnly={lockedAttributes?.outerWindings?.[field.key]}
                    handleToggleLock={(e) =>
                      handleToggleLock(
                        `outerWindings.${field.key}`,
                        lockedAttributes?.innerWindings?.[field.key]
                      )
                    }
                    isLocked={lockedAttributes?.outerWindings?.[field.key]}

                    {...(field.key === "interLayerInsulation" && {
                      onMouseEnter: () => handleHover("hvInterLayerInsComment"),
                      onMouseLeave: () => handleMouseLeave(),
                    })}

                    {...(field.key === "endClearances" && {
                      onMouseEnter: () => handleHover("hvEndClrComment"),
                      onMouseLeave: () => handleMouseLeave(),
                    })}
                  />
                </div>
              </div>
            )
      )}
      {!isDryType && (
        <div className="row align-items-center">
          <div className="col-4">
            <CustomInput
              type="dropdown"
              options={[
                { label: "Bushing", value: "Bushing" },
                { label: "Cable Box", value: "Cable Box" },
              ]}
              value={formState.innerWindings?.terminal || "Economic"}
              onChange={(e) =>
                handleInputChange("innerWindings.terminal", e.target.value)
              }
              bgColor={sectionColors.fieldBase}
            />
          </div>
          <div className="col">
            <TextTypo
              text="Terminal"
              fontSize="13px"
              fontWeight="600"
              fontColor="var(--tw-page-text)"
              textAlign="center"
            />
          </div>
          <div className="col-4">
            <CustomInput
              type="dropdown"
              options={[
                { label: "Bushing", value: "Bushing" },
                { label: "Cable Box", value: "Cable Box" },
              ]}
              value={formState.outerWindings?.terminal || "Economic"}
              onChange={(e) =>
                handleInputChange("outerWindings.terminal", e.target.value)
              }
              bgColor={sectionColors.fieldBase}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Part2;
