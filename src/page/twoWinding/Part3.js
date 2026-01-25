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
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="0px 0px 20px 0px"
      >
        <FlexContainer>
          <CustomInput
            label="Core-LV Clr"
            type="text"
            value={formState.coilDimensions?.coreGap}
            onChange={(e) => handleInputChange("coilDimensions.coreGap", e.target.value)}
             bgColor="#D7F3FC"
             onMouseEnter={() => handleHover("coreToLvClrComment")}
             onMouseLeave={() => handleMouseLeave()}
            
          />
          <CustomInput
            label="LV-HV Clr"
            type="text"
            value={formState.coilDimensions?.lvhvgap}
            onChange={(e) => handleInputChange("coilDimensions.lvhvgap", e.target.value)}
             bgColor="#D7F3FC"
             onMouseEnter={() => handleHover("lvToHvClrComment")}
             onMouseLeave={() => handleMouseLeave()}
            
          />
          <CustomInput
            label="HV-HV Gap"
            type="text"
            value={formState.coilDimensions?.hvhvgap}
            onChange={(e) => handleInputChange("coilDimensions.hvhvgap", e.target.value)}
             bgColor="#D7F3FC"
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

      <Container bgColor="white" padding="20px" borderRadius="5px">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={toggleTabsVisibility}
        >
          <h5>More Info</h5>
          <button
            type="button"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "16px",
            }}
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
