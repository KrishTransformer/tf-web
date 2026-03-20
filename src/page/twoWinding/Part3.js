import React, { useState } from "react";
import {
  CustomInput,
  Container,
  FlexContainer,
  // ImagePreview,
  // TextTypo,
} from "../../components";
import CoilDimensionsTabs from "./CoilDimensionsTabs";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const Part3 = ({ formState, handleInputChange, handleHover, handleMouseLeave }) => {
  const [isTabsVisible, setIsTabsVisible] = useState(false);

  const toggleTabsVisibility = () => {
    setIsTabsVisible((prevState) => !prevState);
  };

  return (
    <div>
      {/* <Container bgColor="white" padding="10px" borderRadius="20px">
        <ImagePreview />
      </Container> */}

      <Container
        className="two-winding-card"
        bgColor="var(--tw-surface)"
        padding="20px"
        borderRadius="10px"
        margin="0px 0px 20px 0px"
      >
        <FlexContainer>
          <CustomInput
            label="Core-LV Clr"
            type="text"
            value={formState.coilDimensions?.coreGap}
            onChange={(e) => handleInputChange("coilDimensions.coreGap", e.target.value)}
             bgColor="var(--app-input-accent-bg)"
             onMouseEnter={() => handleHover("coreToLvClrComment")}
             onMouseLeave={() => handleMouseLeave()}
            
          />
          <CustomInput
            label="LV-HV Clr"
            type="text"
            value={formState.coilDimensions?.lvhvgap}
            onChange={(e) => handleInputChange("coilDimensions.lvhvgap", e.target.value)}
             bgColor="var(--app-input-accent-bg)"
             onMouseEnter={() => handleHover("lvToHvClrComment")}
             onMouseLeave={() => handleMouseLeave()}
            
          />
          <CustomInput
            label="HV-HV Gap"
            type="text"
            value={formState.coilDimensions?.hvhvgap}
            onChange={(e) => handleInputChange("coilDimensions.hvhvgap", e.target.value)}
             bgColor="var(--app-input-accent-bg)"
             onMouseEnter={() => handleHover("hvToHvClrComment")}
             onMouseLeave={() => handleMouseLeave()}
            
          />
        </FlexContainer>

        {/* <FlexContainer>
          <CustomInput
            label="LV Layer Insn"
            type="text"
            value={formState.lVLayerInsulation}
            onChange={(e) =>
              handleInputChange("lVLayerInsulation", e.target.value)
            }
          />
          <CustomInput
            label="HV Layer Insn"
            type="text"
            value={formState.hVLayerInsulation}
            onChange={(e) =>
              handleInputChange("hVLayerInsulation", e.target.value)
            }
          />
        </FlexContainer> */}
      </Container>

      <Container className="two-winding-card" bgColor="var(--tw-surface)" padding="20px" borderRadius="10px">
        <div
          className="two-winding-accordion-trigger"
          onClick={toggleTabsVisibility}
        >
          <h5 className="two-winding-accordion-title">More Info</h5>
          <button
            type="button"
            className="two-winding-icon-btn"
          >
            {isTabsVisible ? <IoIosArrowDown size={23} /> : <IoIosArrowForward size={23} /> }
          </button>
        </div>
        {isTabsVisible && (
          <CoilDimensionsTabs
            formState={formState}
            handleInputChange={handleInputChange}
          />
        )}
      </Container>
    </div>
  );
};

export default Part3;
