import React from "react";
import {
  Container,
  CustomInput,
  CustomTabs,
  CustomInputUnit,
  FlexContainer,
  ImagePreview,
  TextTypo,
} from "../../../components";

const CableBox = ({ formState, handleInputChange }) => {
  const CableBoxTabs = [
    {
      key: "hVCableBoxPreview",
      label: "HV Cable Box Preview",
      content: (
        <Container bgColor="white" padding="10px" borderRadius="20px">
          <ImagePreview btnText="Maximize" />
        </Container>
      ),
    },
    {
      key: "lVCableBoxPreview",
      label: "LV Cable Box Preview",
      content: (
        <Container bgColor="white" padding="10px" borderRadius="20px">
          <ImagePreview btnText="Maximize" />
        </Container>
      ),
    },
  ];

  return (
    <FlexContainer margin="20px 0px" direction="column">
      <FlexContainer direction="row" justify="space-between" gap="30px">
        {/* HV Cable Box Section */}
        <Container width="50%" padding="0" bgColor="transparent">
          <FlexContainer direction="column" >
            <FlexContainer align="center">
              <TextTypo
                text="HV Cable Box"
                fontWeight="600"
                
              />
              <CustomInput 
                type="checkbox" 
                label="HVCB" 
                name="hvCheckbox"
                value={formState.hvcb.hvcb} 
                onChange={(e) => handleInputChange("hvcb.hvcb", e.target.checked)} 
                width="fit-content"
                style={{marginTop: 10}}
              />
            </FlexContainer>
            <CustomInput
              label="Mounting:"
              type="dropdown"
              name="hvMounting"
              options={[{ label: "Single", value: "single" }]}
              value={formState.hvMounting || "Single"}
              onChange={(e) => handleInputChange("hvMounting", e.target.value)}
              width="100%"
            />
            <CustomInput
              label="Sheet Thick:"
              type="text"
              name="hvSheetThick"
              value={formState.hvcb.hvcb_Thick }
              onChange={(e) => handleInputChange("hvcb.hvcb_Thick", e.target.value)}
              width="100%"
            />
          </FlexContainer>
        </Container>
        {/* LV Cable Box Section */}
        <Container width="50%" padding="0" bgColor="transparent">
         <FlexContainer direction="column" >
            <FlexContainer align="center">
              <TextTypo
                text="LV Cable Box"
                fontWeight="600"
                
              />
              <CustomInput 
                type="checkbox" 
                label="LVCB" 
                name="lvCheckbox"
                value={formState.lvcb.lvcb} 
                onChange={(e) => handleInputChange("lvcb.lvcb", e.target.checked)} 
                width="fit-content" 
                style={{marginTop: 10, marginLeft: "10px"}}
              />
            </FlexContainer>
            <CustomInput
              label="Mounting:"
              type="dropdown"
              name="lvMounting"
              options={[{ label: "Single", value: "single" }]}
              value={formState.lvMounting || "Single"}
              onChange={(e) => handleInputChange("lvMounting", e.target.value)}
              width="100%"
            />
            <CustomInput
              label="Sheet Thick:"
              type="text"
              name="lvSheetThick"
              value={formState.lvcb.lvcb_Thick }
              onChange={(e) => handleInputChange("lvcb.lvcb_Thick", e.target.value)}
              width="100%"
            />
            
            <CustomInput
              label="Cable Runs:"
              type="text"
              name="cableRuns"
              value={formState.cableRuns || ""}
              onChange={(e) => handleInputChange("cableRuns", e.target.value)}
              width="100%"
              placeholder={"nos."}
              style={{ textAlign: "right" }} 
            />
           
          </FlexContainer>
        </Container>
      </FlexContainer>
      {/* <CustomTabs tabs={CableBoxTabs} /> */}
    </FlexContainer>
  );
};

export default CableBox;
