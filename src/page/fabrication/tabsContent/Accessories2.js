import React, { useState } from "react";
import {
  Container,
  CustomInput,
  CustomModal,
  LabeledInputWithUnit,
  FlexContainer,
  ImagePreview,
  TextTypo,
} from "../../../components";
import MyGlbViewer from "../../../components/glbViewer/MyGlbViewer";
import { useSelector } from "react-redux";
import {
  selectGenerate3D,
} from "../../../selectors/CalcSelector";

const Accessories2 = ({ formState, handleInputChange }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { generate3d } = useSelector(selectGenerate3D);



  return (
    <FlexContainer margin="20px 0px" direction="column">
      <Container margin="10px 0px 0px 0px">
        <TextTypo text="Tank Accessories" fontSize="16px" fontWeight="600" />
        <Container margin="20px 0px">

          {/*Commented for now*/}
          {/* <LabeledInputWithUnit
            label="Drain Valves"
            unit="Nos."
            inputValue={formState.drain_Vlv.drain_Vlv_Nos || ""}
            onInputChange={(e) =>
              handleInputChange("drain_Vlv.drain_Vlv_Nos", e.target.value)
            }
            isChecked={formState.drain_Vlv.drain_Vlv || false}
            onCheckboxChange={(e) =>
              handleInputChange("drain_Vlv.drain_Vlv", e.target.checked)
            }
            margin="15px 0"
          /> */}

          <CustomInput
            type="checkbox"
            label="Drain Valves"
            value={formState.drain_Vlv.drain_Vlv}
            onChange={(e) =>
              handleInputChange("drain_Vlv.drain_Vlv", e.target.checked)
            }
          />


          <FlexContainer>
            <CustomInput
              type="checkbox"
              label="Filter Valves"
              value={formState.fill_Vlv.fill_Vlv}
              onChange={(e) =>
                handleInputChange("fill_Vlv.fill_Vlv", e.target.checked)
              }
            />

            {/* <CustomInput
              type="checkbox"
              label="Radiator Valves"
              value={formState.radiator.radiator_Vlv}
              onChange={(e) =>
                handleInputChange("radiator.radiator_Vlv", e.target.checked)
              }
            /> */}

          </FlexContainer>

          <FlexContainer>
            <CustomInput
              type="checkbox"
              label="Sampling Valves"
              value={formState.smpl_Vlv.smpl_Vlv}
              onChange={(e) =>
                handleInputChange("smpl_Vlv.smpl_Vlv", e.target.checked)
              }
            />
          </FlexContainer>

          {/* <LabeledInputWithUnit
            label="Sampling Valves"
            unit="Nos."
            inputValue={formState.smpl_Vlv.smpl_Vlv_Nos || ""}
            onInputChange={(e) =>
              handleInputChange("smpl_Vlv.smpl_Vlv_Nos", e.target.value)
            }
            isChecked={formState.smpl_Vlv.smpl_Vlv || false}
            onCheckboxChange={(e) =>
              handleInputChange("smpl_Vlv.smpl_Vlv", e.target.checked)
            }
            margin="15px 0"
          /> */}

          <CustomInput
            type="checkbox"
            label="Radiator Valves"
            value={formState.radiator.radiator_Vlv}
            onChange={(e) =>
              handleInputChange("radiator.radiator_Vlv", e.target.checked)
            }
          />
          {/* Commented for now */}
          {/* <LabeledInputWithUnit
            label="Marshling Box"
            unit="Instruments"
            type="dropdown"
            options={[{ label: "0", value: "0" }]}
            inputValue={formState.marshlingBox || "0"}
            onInputChange={(e) =>
              handleInputChange("marshlingBox", e.target.value)
            }
            isChecked={formState.mbox || false}
            onCheckboxChange={(e) =>
              handleInputChange("mbox", e.target.checked)
            }
            margin="15px 0"
          /> */}

          <LabeledInputWithUnit
            label="Lifting Lugs"
            unit="Thick"
            inputValue={formState.lid_LiftLug.lid_LiftLug_Thick || ""}
            onInputChange={(e) =>
              handleInputChange("lid_LiftLug.lid_LiftLug_Thick", e.target.value)
            }
            isChecked={formState.lid_LiftLug.lid_LiftLug || false}
            onCheckboxChange={(e) =>
              handleInputChange("lid_LiftLug.lid_LiftLug", e.target.checked)
            }
            margin="15px 0"
          />

          {/* Commented for now */}
          {/* <LabeledInputWithUnit
            label="Thermo Siphon"
            type="dropdown"
            options={[{ label: "Type-2", value: "type-2" }]}
            inputValue={formState.thermoSiphon || "Type-2"}
            onInputChange={(e) =>
              handleInputChange("thermoSiphon", e.target.value)
            }
            
          /> */}

          {/* Roller */}
          {/* <LabeledInputWithUnit
            label="Rollers"
            type="dropdown"
            dropdownOptions={[             
              { label: "Plain Roller", value: "plain_roller" },
              { label: "Flange Roller", value: "flanged_roller" },
            ]}
            inputValue={formState.roller.roller_Type || "Flange Roller"}
            onInputChange={(e) => handleInputChange("roller.roller_Type", e.target.value)}
            isChecked={formState.roller.roller || false}
            onCheckboxChange={(e) =>
              handleInputChange("roller.roller", e.target.checked)
            }


            margin="15px 0"
          />
          <LabeledInputWithUnit
            label="Roller Guage"
            type="text"
            inputValue={formState.roller.roller_Guage || ""}
            onInputChange={(e) =>
              handleInputChange("roller.roller_Guage", e.target.value)
            }
            hideCheckbox={true}
          /> */}

        </Container>
      </Container>

      {/* <Container bgColor="white" padding="10px" borderRadius="20px">
        <ImagePreview btnText="Maximize" btnOnClick={handleOpen}
          disablebtn={generate3d?.data?.blob?.includes?.("generate3d") === true
            || generate3d?.data?.blob == ""
            || generate3d?.data?.blob == undefined
          }
          showSpinner={
            (generate3d?.data?.blob !== "" &&
              generate3d?.data?.blob?.includes?.("generate3d") === true) || (generate3d?.data?.blob === undefined)
          }
        >
          <MyGlbViewer canvasHeight="400" canvasWidth="550" blob={generate3d?.data?.blob} />
        </ImagePreview>
      </Container>
      <CustomModal title="Accessories (2)" open={open} onClose={handleClose}>
        <MyGlbViewer canvasHeight="500" canvasWidth="1000" blob={generate3d?.data?.blob} />
      </CustomModal> */}
      
    </FlexContainer>
  );
};

export default Accessories2;
