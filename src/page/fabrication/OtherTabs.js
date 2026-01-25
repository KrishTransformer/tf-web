import React from "react";
import {
  CustomInput,
  CustomFlexInput,
  FlexContainer,
  NavTabs,
  // TextBtn,
  TextTypo,
} from "../../components";

const OtherTabs = ({ formState, handleInputChange }) => {
  const tabs = [
    {
      key: "activePart",
      label: "Active Part",
      content: (
        <div>
          <TextTypo
            text="Core Frame Details"
            fontSize="16px"
            fontWeight="600"
          />
          <FlexContainer margin="20px 0px" align="center">
            <CustomFlexInput
              label="Type:"
              type="dropdown"
              options={[{ label: "C-Channel", value: "c-Channel" }]}
              value={formState.coreType || "Left"}
              onChange={(e) => handleInputChange("coreType", e.target.value)}
            />
            {/* <TextTypo text="Size:" fontSize="14px" fontWeight="600" /> */}
            <CustomFlexInput
              label="Size: &nbsp;Hgt."
              type="text"
              value={formState.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
            <CustomFlexInput
              label="Wth."
              type="text"
              value={formState.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
            />
            <CustomFlexInput
              label="Thk:"
              type="text"
              value={formState.thickness}
              onChange={(e) => handleInputChange("thickness", e.target.value)}
            />
          </FlexContainer>
          <FlexContainer>
            <CustomFlexInput
              label="Core Bolt Dia:"
              type="text"
              value={formState.coreBoltDia || 0}
              onChange={(e) => handleInputChange("coreBoltDia", e.target.value)}
            />
            <CustomFlexInput
              label="Tia Rod Dia:"
              type="text"
              value={formState.tiaRodDia || 0}
              onChange={(e) => handleInputChange("tiaRodDia", e.target.value)}
            />
          </FlexContainer>
          <CustomInput type="checkbox" label="Yoke Hole in Core" />
        </div>
      ),
    },
    {
      key: "tank",
      label: "Tank",
      content: (
        <div>
          <TextTypo
            text="Foundation Details"
            fontSize="16px"
            fontWeight="600"
          />
          <FlexContainer margin="20px 0px" align="center">
            <CustomFlexInput
              label="Foundation Type:"
              type="dropdown"
              options={[{ label: "Type -3", value: "type-3" }]}
              value={formState.coreType || "Left"}
              onChange={(e) => handleInputChange("coreType", e.target.value)}
            />
          </FlexContainer>
          <FlexContainer margin="20px 0px" align="center">
            <CustomFlexInput
              label="Bottom Channel Data:"
              type="dropdown"
              options={[{ label: "C-Channel", value: "c-Channel" }]}
              value={formState.coreType || "Left"}
              onChange={(e) => handleInputChange("coreType", e.target.value)}
            />
            <CustomFlexInput
              type="dropdown"
              options={[{ label: "150 x 75 x 5.7", value: "150 x 75 x 5.7" }]}
              value={formState.coreType || "Left"}
              onChange={(e) => handleInputChange("coreType", e.target.value)}
            />
          </FlexContainer>
        </div>
      ),
    },
  ];
  return (
    <div>
      <NavTabs tabs={tabs} />
    </div>
  );
};

export default OtherTabs;
