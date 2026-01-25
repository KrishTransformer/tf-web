import React from "react";
import {
  Container,
  CustomFlexInput,
  CustomInput,
  FlexContainer,
  TextTypo,
} from "../../../components";

const Misc = ({ formState, handleInputChange }) => {
  return (
    <FlexContainer margin="20px 0px" direction="column">
      <Container>
        <TextTypo text="Tap Changer:" fontWeight="600" />
        <TextTypo
          text={`Tap Changer Type: ${formState.tapChangerType}`}
          fontWeight="600"
          margin="20px 0px"
        />
        <CustomFlexInput
          label="Location:"
          type="dropdown"
          options={[{ label: "0", value: "0" }]}
          value={formState.tapChangerLocation}
          onChange={(e) =>
            handleInputChange("tapChangerLocation", e.target.value)
          }
        />
        <CustomFlexInput
          label="Type:"
          type="dropdown"
          options={[{ label: "0", value: "0" }]}
          value={formState.tapChangerType}
          onChange={(e) => handleInputChange("tapChangerType", e.target.value)}
        />
        <FlexContainer align="end" width="80%">
          <CustomInput
            type="text"
            label="Active Height"
            value={formState.restOfVariables.active_Height}
            onChange={(e) => handleInputChange("restOfVariables.active_Height", e.target.value)}
          />
          <TextTypo text="+" margin="0px 0px 20px 0px" />
          <CustomInput
            type="text"
            label="Tank Clearance"
            value={formState.tankClearance}
            onChange={(e) => handleInputChange("tankClearance", e.target.value)}
          />
        </FlexContainer>
      </Container>
      <Container>
        <TextTypo text="Other Accessories" fontWeight="600" />
        <CustomInput
          type="checkbox"
          label="Current Transformer (CT)"
          checked={formState.ctCurrentTransformer}
          onChange={(e) =>
            handleInputChange("ctCurrentTransformer", e.target.checked)
          }
        />
        <Container border="1px solid black" padding="10px" width="60%">
          <FlexContainer>
            <CustomInput
              type="text"
              value={formState.ctValuesU}
              onChange={(e) => handleInputChange("ctValuesU", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesV}
              onChange={(e) => handleInputChange("ctValuesV", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesW}
              onChange={(e) => handleInputChange("ctValuesW", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesN}
              onChange={(e) => handleInputChange("ctValuesN", e.target.value)}
            />
          </FlexContainer>
          <FlexContainer>
            <CustomInput
              type="text"
              value={formState.ctValuesu}
              onChange={(e) => handleInputChange("ctValuesu", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesv}
              onChange={(e) => handleInputChange("ctValuesv", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesw}
              onChange={(e) => handleInputChange("ctValuesw", e.target.value)}
            />
            <CustomInput
              type="text"
              value={formState.ctValuesn}
              onChange={(e) => handleInputChange("ctValuesn", e.target.value)}
            />
          </FlexContainer>
        </Container>
        <CustomFlexInput
          label="LV:"
          type="dropdown"
          options={[{ label: "Internal", value: "internal" }]}
          value={formState.lvType}
          onChange={(e) => handleInputChange("lvType", e.target.value)}
        />
        <CustomFlexInput
          label="HV:"
          type="dropdown"
          options={[{ label: "Internal", value: "internal" }]}
          value={formState.hvType}
          onChange={(e) => handleInputChange("hvType", e.target.value)}
        />
      </Container>
    </FlexContainer>
  );
};

export default Misc;
