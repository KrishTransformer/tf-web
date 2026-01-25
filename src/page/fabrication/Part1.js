import React from "react";
import {
  CustomInput,
  Container,
  FlexContainer,
  FilledBtn,
  TextTypo,
} from "../../components";

const Part1 = ({ formState, handleInputChange, twoWindings }) => {
  return (
    <Container>
      <Container bgColor="white" padding="20px" borderRadius="5px">
        <TextTypo
          text="Design Reference:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 15px"
        />
        <FlexContainer align="center">
          <TextTypo text={`kVA: ${twoWindings?.data?.kVA}`} />
          <TextTypo text={`LV Line: ${twoWindings?.data?.lowVoltage}`} />
          <TextTypo text={`HV Line: ${twoWindings?.data?.highVoltage}`} />
          <TextTypo text={`Vector: ${twoWindings?.data?.vectorGroup}`} />
        </FlexContainer>
      </Container>
      <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        <TextTypo
          text="Core Details"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 15px"
        />
        <FlexContainer align="center">
          <TextTypo text={`Core Dia: ${twoWindings?.data?.core?.coreDia}`} />
          <TextTypo text={`Limb Ht.: ${twoWindings?.data?.core?.limbHt}`} />
          <TextTypo text={`Cen. Dist: ${twoWindings?.data?.core?.cenDist}`} />
        </FlexContainer>
      </Container>
      <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        <TextTypo
          text="Tank Details:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 10px 0px"
        />
        <FlexContainer>
          <CustomInput
            label="Length:"
            type="text"
            value={formState.tank.tank_L}
            onChange={(e) => handleInputChange("tank.tankLength", e.target.value)}
          />
          <CustomInput
            label="Width:"
            type="text"
            value={formState.tank.tank_W}
            onChange={(e) => handleInputChange("tank.tankWidth", e.target.value)}
          />
          <CustomInput
            label="Height:"
            type="text"
            value={formState.tank.tank_H}
            onChange={(e) => handleInputChange("tankHeight", e.target.value)}
          />
          <CustomInput
            label="Sheet Thick:"
            type="text"
            value={formState.tank.tank_Thick}
            onChange={(e) => handleInputChange("sheetThick", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Bot. Sheet Thk:"
            type="text"
            value={formState.tank.tank_Bot_Thick}
            onChange={(e) => handleInputChange("botSheetThk", e.target.value)}
          />
          <CustomInput
            label="Curb Thick:"
            type="text"
            value={formState.tank.tank_Flg_Thick}
            onChange={(e) => handleInputChange("curbThick", e.target.value)}
          />
          <CustomInput
            label="Build Type:"
            type="dropdown"
            options={[{ label: "Single", value: "single" },
              { label: "L-Joint", value: "l-joint" }
            ]}
            value={formState.tank_Build_Type || "single"}
            onChange={(e) => handleInputChange("buildType", e.target.value)}
          />
        </FlexContainer>
      </Container>
      <Container bgColor="white" padding="20px" borderRadius="5px">
        <TextTypo
          text="Radiators Details:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 15px"
        />
        <FlexContainer>
          <CustomInput
            label="Rad. Type:"
            type="dropdown"
            options={[{ label: "PSR", value: "psr" },{ label: "PSR-OFFSET", value: "psr-offset" }]}
            value={formState.radType || "psr"}
            onChange={(e) => handleInputChange("radType", e.target.value)}
          />
          <CustomInput
            label="Rad Hgt.:"
            type="text"
            value={formState.radiator.radiator_CC}
            onChange={(e) => handleInputChange("radiator_CC_NOEDIT", e.target.value)}
          />
          <CustomInput
            label="Rad. Width:"
            type="text"
            value={formState.radiator.radiator_W}
            onChange={(e) => handleInputChange("radiator_W_NOEDIT", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="No. of Fins:"
            type="text"
            value={formState.radiator.radiator_Fin_Nos}
            onChange={(e) => handleInputChange("radiator_Fin_Nos_NOEDIT", e.target.value)}
          />
          <CustomInput
            label="Total Radiators:"
            type="text"
            value={formState.radiator.radiator_Nos}
            onChange={(e) => handleInputChange("radiator_Nos_NOEDIT", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer justify="">
          <CustomInput
            label="HV Side:"
            type="text"
            value={formState.radiator.radiator_FL_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_FL_Nos", e.target.value)}
          />
          <CustomInput
            label="&nbsp;"
            type="text"
            value={formState.radiator.radiator_FR_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_FR_Nos", e.target.value)}
          />
          <CustomInput
            label="LV Side:"
            type="text"
            value={formState.radiator.radiator_BL_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_BL_Nos", e.target.value)}
          />
          <CustomInput
            label="&nbsp;"
            type="text"
            value={formState.radiator.radiator_BR_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_BR_Nos", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <CustomInput
            label="Left Side:"
            type="text"
            value={formState.radiator.radiator_Left_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_Left_Nos", e.target.value)}
          />
          <CustomInput
            label="Right Side:"
            type="text"
            value={formState.radiator.radiator_Right_Nos}
            onChange={(e) => handleInputChange("radiator.radiator_Right_Nos", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer width="100%" align="end">
          <FlexContainer width="75%">
            <CustomInput
              label="Rad. Min. Gap:"
              type="text"
              value={formState.radiator.radiator_Min_Gap}
              onChange={(e) => handleInputChange("radiator.radiator_Min_Gap", e.target.value)}
            />
            <CustomInput
              label="Fin Thickness:"
              type="text"
              value={formState.radiator.radiator_Fin_Thick}
              onChange={(e) => handleInputChange("radiator.radiator_Fin_Thick", e.target.value)}
            />
          </FlexContainer>
          <FilledBtn
            text="Auto Pitch"
            bgColor="#C6FE1F"
            width="100%"
            padding="10px"
            borderRadius="15px"
            fontSize="12px"
          />
        </FlexContainer>
      </Container>
    </Container>
  );
};

export default Part1;
