import React from "react";
import {
  CustomInput,
  Container,
  DropDownInput,
  FlexContainer,
  // InputWithModal,
  ToggleInput,
  ToggleBtn,
  TextTypo,
  CustomModal,
  InputWithModal,
} from "../../components";

const Part1 = ({ formState, handleInputChange, handleToggleLock, lockedAttributes, handleHover, handleMouseLeave }) => {

  return (
    <div>
      <Container bgColor="white" padding="20px" borderRadius="5px">
        <FlexContainer>
          <CustomInput
            type="dropdown"
            options={[
              { label: "Rectangular Core", value: "RECTANGULAR" },
              { label: "Circular Core", value: "CIRCULAR" },
            ]}
            value={formState.eTransBodyType || "Rectangular Core"}
            onChange={(e) =>
              handleInputChange("eTransBodyType", e.target.value)
            }
          />          
          <CustomInput
            type="dropdown"
            options={[
              { label: "Oil Type", value: false },
              { label: "Dry Type", value: true },
            ]}
            value={formState.dryType || "Oil Type"}
            onChange={(e) => handleInputChange("dryType", e.target.value)}
          />
          {(formState.dryType === true || formState.dryType === "true") && (
            <CustomInput
              type="dropdown"
              options={[
                { label: "Class B", value: "CLASS_B" },
                { label: "Class F", value: "CLASS_F" },
                { label: "Class H", value: "CLASS_H" },
              ]}
              value={formState.dryTempClass || "Class B"}
              onChange={(e) =>
                handleInputChange("dryTempClass", e.target.value)
              }
            />
          )}
          {(formState.dryType === false || formState.dryType === "false" || formState.dryType === undefined) && (
            <CustomInput
            type="dropdown"
            options={[
              { label: "Economic", value: "ECONOMIC" },
              { label: "Energy Efficient", value: "ENERGY_EFFICIENT" },
            ]}
            value={formState.eTransCostType || "Economic"}
            onChange={(e) =>
              handleInputChange("eTransCostType", e.target.value)
            }
          />
          )}
        </FlexContainer>
        <FlexContainer align="center">
          <CustomInput
            label="kVA"
            value={formState.kVA}
            onChange={(e) => handleInputChange("kVA", e.target.value)}
          />
          <DropDownInput
            labelColor="#0081FF"
            label="Low Voltage IW"
            options={[
              { label: "Helical", value: "HELICAL" },
              { label: "Disc", value: "DISC" },
              { label: "Foil", value: "FOIL" },
              { label: "LayerDisc", value: "LAYERDISC" },
            ]}
            inputValue={formState.lowVoltage}
            dropdownValue={formState.lvWindingType}
            onInputChange={(value) => handleInputChange("lowVoltage", value)}
            onDropdownChange={(value) =>
              handleInputChange("lvWindingType", value)
            }
          />
          <DropDownInput
            labelColor="#FF5B1E"
            label="High Voltage OW"
            options={[
              { label: "Helical", value: "HELICAL" },
              { label: "Disc", value: "DISC" },
              // { label: "LayerDisc", value: "layerDisc" },
              { label: "X-Over", value: "XOVER" },
            ]}
            inputValue={formState.highVoltage}
            dropdownValue={formState.hvWindingType}
            onInputChange={(value) => handleInputChange("highVoltage", value)}
            onDropdownChange={(value) =>
              handleInputChange("hvWindingType", value)
            }
          />
        </FlexContainer>
        <FlexContainer align="center">
          <CustomInput
            label="Frequency"
            value={formState.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
          {/* <InputWithModal
            label="Frequency"
            bgColor="#D7F3FC"
            value={formState.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            borderColor="0.5px solid #00000033"
          /> */}
          <ToggleInput
            labelColor="#0081FF"
            label="LV Current Density"
            value={formState.lvCurrentDensity}
            valueOfToggle={formState.lVConductorMaterial}
            onValueChange={(e) => {
              handleInputChange("lvCurrentDensity", e);
            }}
            onLabelChange={(e) => {
              handleInputChange("lVConductorMaterial", e);
            }}
            formState={formState}
          />
          <ToggleInput
            labelColor="#FF5B1E"
            label="HV Current Density"
            value={formState.hvCurrentDensity}
            valueOfToggle={formState.hVConductorMaterial}
            onValueChange={(e) => {
              handleInputChange("hvCurrentDensity", e);
            }}
            onLabelChange={(e) => {
              handleInputChange("hVConductorMaterial", e);
            }}
            formState={formState}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Connection"
            type="dropdown"
            options={[
              { label: "Dyn11", value: "Dyn11" },
              { label: "Dd0", value: "Dd0" },
              { label: "Yyn0", value: "Yyn0" },
              { label: "Yd11", value: "Yd11" },
              // { label: "Ii0", value: "ii0" },
            ]}
            value={formState.vectorGroup}
            onChange={(e) => handleInputChange("vectorGroup", e.target.value)}
          />
          {formState.vectorGroup === "ii0" && (
            <FlexContainer>
              <CustomInput
                label="LV Limbs"
                type="dropdown"
                options={[
                  { label: "Series", value: "series" },
                  { label: "Parallel", value: "parallel" },
                ]}
                value={formState.lVLimbs}
                onChange={(e) => handleInputChange("lVLimbs", e.target.value)}
              />
              <CustomInput
                label="HV Limbs"
                type="dropdown"
                options={[
                  { label: "Series", value: "series" },
                  { label: "Parallel", value: "parallel" },
                ]}
                value={formState.hVLimbs}
                onChange={(e) => handleInputChange("hVLimbs", e.target.value)}
              />
            </FlexContainer>
          )}
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Core Material"
            type="dropdown"
            options={[
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
            ]}
            value={formState.core.coreMaterial}
            onChange={(e) => handleInputChange("core.coreMaterial", e.target.value)}
          />
          <CustomInput
            label="Build Factor"
            value={formState.buildFactor}
            onChange={(e) => handleInputChange("buildFactor", e.target.value)}
          />
          <CustomInput
            label="Flux Density"
            value={formState.fluxDensity}
            onChange={(e) => handleInputChange("fluxDensity", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Tap Steps %"
            value={formState.tapStepsPercent}
            onChange={(e) =>
              handleInputChange("tapStepsPercent", e.target.value)
            }
            onMouseEnter={() => handleHover("tapStepComment")}
            onMouseLeave={() => handleMouseLeave()}
          />
          <CustomInput
            label="+ ve"
            value={formState.tapStepsPositive}
            onChange={(e) =>
              handleInputChange("tapStepsPositive", e.target.value)
            }
          />
          <CustomInput
            label="- ve"
            value={formState.tapStepsNegative}
            onChange={(e) =>
              handleInputChange("tapStepsNegative", e.target.value)
            }
          />
          <CustomInput
            label="Tap Changer"
            type="dropdown"
            options={[
              // { label: "Nil", value: "Nil" },
              { label: "OCTC", value: "OCTC" },
              { label: "OLTC", value: "OLTC" },
              // { label: "OLTC External", value: "OLTC_External" },
            ]}
            value={formState.isOLTC ? "OLTC" : "OCTC"}
            onChange={(e) =>
              handleInputChange(
                "isOLTC",
                e.target.value == "OCTC" ? false : true
              )
            }
          />
        </FlexContainer>
      </Container>
      <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        {/* <TextTypo
          text="Core Details"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 15px"
        /> */}
        <FlexContainer align="center">
          <TextTypo text={`Volts per Turns :  ${formState?.voltsPerTurn}`} />
          {/* <TextTypo text={`Turns per Tap :  ${formState?.turnsPerTap}`} /> */}
          {/* <TextTypo text={`kValue :  ${formState.kValue}`}/> */}
        </FlexContainer>
      </Container>
      <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        <FlexContainer>
          {/* <CustomInput
            label="Core Type"
            type="text"
            value={formState.core?.coreType}
            onChange={(e) => handleInputChange("core.coreType", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          /> */}
          <CustomInput
            label="Core Diameter"
            //description={formState.lvFormulas?.possibleCoreDiaRange}
            value={formState.core?.coreDia}
            attributeName="core.coreDia"
            onChange={(e) => handleInputChange(`core.coreDia`, e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
            showUnlockIcon={true}
            handleToggleLock={(e) => handleToggleLock(`coreLock.coreDia`, lockedAttributes?.coreLock?.coreDia)}
            isLocked={lockedAttributes?.coreLock?.coreDia}
            readOnly={lockedAttributes?.coreLock?.coreDia}
          />
          <CustomInput
            label="Limb Ht."
            //description={formState.lvFormulas?.possibleWindowHeightRange}
            value={formState.core?.limbHt}
            attributeName="core.limbHt"
            onChange={(e) => handleInputChange('core.limbHt', e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
            showUnlockIcon={true}
            handleToggleLock={(e) => handleToggleLock(`coreLock.limbHt`, lockedAttributes?.coreLock?.limbHt)}
            isLocked={lockedAttributes?.coreLock?.limbHt}
            readOnly={lockedAttributes?.coreLock?.limbHt}
          />
          {/* <CustomInput
            label="Limb Ht."
            type="text"
            value={formState.core?.limbHt}
            onChange={(e) => handleInputChange("core.limbHt", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          /> */}
          <CustomInput
            label="Cen Dist"
            type="text"
            value={formState.core?.cenDist}
            onChange={(e) => handleInputChange("", e.target.value)}
            borderColor="0.5px solid #00000033"
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Net Core Area"
            type="text"
            value={formState.core?.area}
            onChange={(e) => handleInputChange("core.area", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
          {/* <CustomInput
            label="Blade"
            type="text"
            value={formState.core?.blade}
            onChange={(e) => handleInputChange("core.blade", e.target.value)}
          /> */}

          <CustomInput
            label="Core Type"
            type="dropdown"
            options={[
              { label: "Prime", value: "PRIME" },
              { label: "Step-Lap", value: "STEP_LAP" },
            ]}
            value={formState.core?.coreType}
            onChange={(e) => handleInputChange("core.coreType", e.target.value)}
          />

          <CustomInput
            label="W/Kg"
            type="text"
            value={formState.hvFormulas?.specificLoss}
            onChange={(e) => handleInputChange("hvFormulas.specificLoss", e.target.value)}
            onMouseEnter={() => handleHover("wattPerKgComment")}
            onMouseLeave={() => handleMouseLeave()}
          />
          {/* <CustomInput
            label="Flux Density"
            type="text"
            value={formState.core?.fluxDensity || "1.7333"}
            onChange={(e) =>
              handleInputChange("core.fluxDensity", e.target.value)
            }
          /> */}
          {/* <ToggleBtn
            label="OLTC"
            value={formState.isOLTC}
            onChange={(value) => handleInputChange("isOLTC", value)}
          /> */}
        </FlexContainer>
      </Container>
      <Container bgColor="white" padding="20px" borderRadius="5px">
        <FlexContainer>
          {/* commented for now */}
          {/* <CustomInput
            label="LIMIT (w)"
            type="text"
            value={formState.limitW}
            onChange={(e) => handleInputChange("limitW", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          /> */}
          {/* <CustomInput
            label="%"
            type="text"
            value={formState.limitPercent}
            onChange={(e) => handleInputChange("limitPercent", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          /> */}
          <CustomInput
            label="Tank Loss"
            type="text"
            value={formState.tank?.tankLoss}
            onChange={(e) => handleInputChange("tank.tankLoss", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
          <CustomInput
            label="Load Loss"
            type="text"
            value={formState.loadLoss}
            onChange={(e) => handleInputChange("loadLoss", e.target.value)}
          // bgColor="#D7F3FC"
          // borderColor="0.5px solid #00000033"
          />
          <CustomInput
            label="Core Loss"
            type="text"
            value={formState.coreLoss}
            onChange={(e) => handleInputChange("coreLoss", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Limit EZ"
            type="text"
            value={formState.limitEz}
            onChange={(e) => handleInputChange("limitEz", e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
          <CustomInput
            label="EZ"
            type="text"
            value={formState.ez}
            onChange={(e) => handleInputChange("ez", e.target.value)}
          />
          {/* <CustomInput
            label="Tap Changer"
            type="dropdown"
            options={[
              // { label: "Nil", value: "Nil" },
              { label: "OCTC", value: "OCTC" },
              { label: "OLTC", value: "OLTC" },
              // { label: "OLTC External", value: "OLTC_External" },
            ]}
            value={formState.isOLTC ? "OLTC" : "OCTC"}
            onChange={(e) =>
              handleInputChange(
                "isOLTC",
                e.target.value == "OCTC" ? false : true
              )
            }
          /> */}
        </FlexContainer>
        {/* <FlexContainer>
          <CustomInput
            label="Tank Length"
            type="text"
            value={formState.tank?.tankLength}
            onChange={(e) =>
              handleInputChange("tank.tankLength", e.target.value)
            }
          />
          <CustomInput
            label="Tank Width"
            type="text"
            value={formState.tank?.tankWidth}
            onChange={(e) =>
              handleInputChange("tank.tankWidth", e.target.value)
            }
          />
          <CustomInput
            label="Tank Height"
            type="text"
            value={formState.tank?.tankHeight}
            onChange={(e) =>
              handleInputChange("tank.tankHeight", e.target.value)
            }
          />
          <CustomInput
            label="Tank Capacity"
            type="text"
            value={formState.tank?.tankCapacity}
            onChange={(e) =>
              handleInputChange("tank.tankCapacity", e.target.value)
            }
          />
        </FlexContainer> */}
      </Container>
    </div>
  );
};

export default Part1;
