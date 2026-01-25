import React from "react";
import {
  Container,
  CustomFlexInput,
  CustomInputUnit,
  CustomTabs,
  FilledBtn,
  FlexContainer,
  ImagePreview,
  TextTypo,
} from "../../../components";

const Stiffners = ({ formState, handleInputChange }) => {
  const StiffenerPreview = [
    {
      key: "horizontalStiffenerPreview",
      label: "Horizontal Stiffener Preview",
      content: (
        <Container bgColor="white" padding="10px" borderRadius="20px">
          <ImagePreview btnText="Maximize" />
        </Container>
      ),
    },
    {
      key: "verticalStiffenerPreview",
      label: "Vertical Stiffener Preview",
      content: (
        <Container bgColor="white" padding="10px" borderRadius="20px">
          <ImagePreview btnText="Maximize" />
        </Container>
      ),
    },
  ];

  return (
    <div>
      <FlexContainer margin="20px 0px" direction="column">
        <Container>
          <TextTypo text="Horizontal Stiffener:" fontWeight="600" />
          <CustomFlexInput
            label="Type:"
            type="dropdown"
            options={[{ label: "Flat", value: "Flat" }]}
            value={formState.stiffner.stiffner_Hori_Data_Type}
            onChange={(e) =>
              handleInputChange("stiffner.stiffner_Hori_Data_Type", e.target.value)
            }
          />
          <CustomFlexInput
            label="Size:"
            type="dropdown"
            options={[{ label: "50 x 6 – Flat", value: "50 x 6 – Flat" },
              { label: "50 x 8 – Flat", value: "50 x 8 – Flat" },
              { label: "75 x 8 – Flat", value: "75 x 8 – Flat" },
              { label: "75 x 10 – Flat", value: "75 x 10 – Flat" },
              { label: "75 x 12 – Flat", value: "75 x 12 – Flat" },
              { label: "85 x 12 – Flat", value: "85 x 12 – Flat" },
            ]}
            value={formState.stiffner.stiffner_Hori_Data}
            onChange={(e) =>
              handleInputChange("stiffner.stiffner_Hori_Data", e.target.value)
            }
          />
          <FlexContainer align="center" justify="">
            <CustomInputUnit
              label="Numbers:"
              unit="Nos."
              isChecked={formState.isChecked}
              onCheckboxChange={(e) =>
                handleInputChange("isChecked", e.target.checked)
              }
              inputValue={formState.stiffner.stiffner_Hori_Nos}
              onInputChange={(e) =>
                handleInputChange("stiffner.stiffner_Hori_Nos", e.target.value)
              }
              margin="15px 0"
            />
          </FlexContainer>
          <FlexContainer justify="end">
            <FilledBtn text="Auto" bgColor="#0081FF33" fontSize="12px" />
          </FlexContainer>
          <TextTypo
            text="Vertical Stiffener:"
            fontWeight="600"
            margin="10px 0px"
          />
          <CustomFlexInput
            label="Type:"
            type="dropdown"
            options={[{ label: "Flat", value: "Flat" }]}
            value={formState.stiffner.stiffner_Vert_Data_Type}
            onChange={(e) => handleInputChange("stiffner.stiffner_Vert_Data_Type", e.target.value)}
          />
          <CustomFlexInput
            label="Size:"
            type="dropdown"
            options={[{ label: "40 x 40 x 5 – L-Angle", value: "40 x 40 x 5 – L-Angle" },
              { label: "40 x 40 x 6 – L-Angle", value: "40 x 40 x 6 – L-Angle" },
              { label: "50 x 50 x 8 – L-Angle", value: "50 x 50 x 8 – L-Angle" },
              { label: "60 x 8 – Flat", value: "60 x 8 – Flat" },
              { label: "75 x 8 – Flat", value: "75 x 8 – Flat" },
              { label: "75 x 10 – Flat", value: "75 x 10 – Flat" },
              { label: "75 x 12 – Flat", value: "75 x 12 – Flat" },
              { label: "85 x 12 – Flat", value: "85 x 12 – Flat" },

            ]}
            value={formState.stiffner.stiffner_Vert_Data}
            onChange={(e) => handleInputChange("stiffner.stiffner_Vert_Data", e.target.value)}
          />
          <FlexContainer align="center" justify="">
            <CustomInputUnit
              label="Numbers:"
              unit="Nos."
              isChecked={formState.isChecked}
              onCheckboxChange={(e) =>
                handleInputChange("isChecked", e.target.checked)
              }
              inputValue={formState.stiffner.stiffner_Vert_Nos}
              onInputChange={(e) =>
                handleInputChange("stiffner.stiffner_Vert_Nos", e.target.value)
              }
              margin="15px 0"
            />
          </FlexContainer>
          <FlexContainer justify="end">
            <FilledBtn text="Auto" bgColor="#0081FF33" fontSize="12px" />
          </FlexContainer>
        </Container>
        {/* <CustomTabs tabs={StiffenerPreview} /> */}
      </FlexContainer>
    </div>
  );
};

export default Stiffners;
