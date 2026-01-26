import React, { useState } from "react";
import {
  Container,
  CustomFlexInput,
  CustomInput,
  CustomModal,
  LabeledInputWithUnit,
  FlexContainer,
  ImagePreview,
  TextTypo,
} from "../../../components";
import MyGlbViewer from "../../../components/glbViewer/MyGlbViewer";
import { useSelector } from "react-redux";
import { selectGenerate3D } from "../../../selectors/CalcSelector";
import { CircularProgress } from "@mui/material";
import CustomStepper from "../../../components/CustomStepper/CustomStepper";
import image1 from "../../../assets/Buchholz Relay Valve 1.1.jpeg"
import image2 from "../../../assets/Buchholz Relay Valve 1.2.jpeg";
import image3 from "../../../assets/Buchholz Relay Valve 2.1.jpeg";
import image4 from "../../../assets/Buchholz Relay Valve 2.2.jpeg";

const Accessories1 = ({ formState, handleInputChange }) => {
  const { generate3d } = useSelector(selectGenerate3D);
  //console.log("generate3d", generate3d);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    // checkIfFileExists(formState.restOfVariables.designId).then(exists => {
    //   console.log('Does the file exist?', exists);
    //   if (exists) {
    setOpen(true);
    // }  else {
    //   alert("File not generated")
    // }
    // });
  };
  const handleClose = () => setOpen(false);

  //console.log("formState.gorPipe.single_Valve", formState.gorPipe.single_Valve)

  async function checkIfFileExists(designId) {
    const url =
      "https://s3.ap-south-1.amazonaws.com/design.trafointel.com/" +
      designId +
      "/" +
      designId +
      ".mtl";
    try {
      const response = await fetch(url, {
        method: "HEAD", // We use HEAD to fetch metadata without the file content
      });

      if (response.ok) {
        // File exists
        console.log("File exists");
        return true;
      } else if (response.status === 404) {
        // File does not exist
        console.log("File does not exist");
        return false;
      } else {
        // Some other error occurred
        console.log(`Error: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error("Network or other error:", error);
      return false;
    }
  }

  // console.log("formState.gorPipe.buchholz_Relay", formState.gorPipe.buchholz_Relay);
  // console.log("formState.gorPipe.single_Valve", formState.gorPipe.single_Valve);
  //console.log("generate3d?.data?.blob === ", generate3d?.data?.blob === undefined);

  return (
    <FlexContainer margin="20px 0px" direction="column">
      <Container margin="10px 0px">
        <TextTypo
          text="Lid and Conservator Accessories"
          fontSize="16px"
          fontWeight="600"
        />
        <Container margin="20px 10px 0px 0px">
          <FlexContainer align="center">
            <CustomInput
              type="checkbox"
              label="MOG"
              value={formState.mog.mog}
              onChange={(e) => handleInputChange("mog.mog", e.target.checked)}
            />
            <CustomFlexInput
              label="Position:"
              type="dropdown"
              options={[
                { label: "0", value: "0" },
                { label: "1", value: "1" },
              ]}
              value={formState.mog.mog_Tlt_Ang || 0}
              onChange={(e) => handleInputChange("mog.mog_Tlt_Ang", Number(e.target.value))}
              margin="0 40px 0 0"
            />
          </FlexContainer>

          <FlexContainer>
            <CustomInput
              type="checkbox"
              label="Bucholz Relay"
              value={formState.gorPipe.buchholz_Relay}
              onChange={(e) =>
                handleInputChange("gorPipe.buchholz_Relay", e.target.checked)
              }
            />

            <CustomFlexInput
              label="No.of.Valves:"
              type="dropdown"
              options={[
                { label: "1", value: true },
                { label: "2", value: false },
              ]}
              value={formState.gorPipe.single_Valve}
              onChange={(e) => handleInputChange("gorPipe.single_Valve", e.target.value)}
              margin="0 40px 0 0"
            />

          </FlexContainer>

          {formState.gorPipe.buchholz_Relay && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>

              {(formState.gorPipe.single_Valve === "true" || formState.gorPipe.single_Valve === true) ? (
                <>
                  {/* <h1>valve_1</h1> */}

                  <CustomInput
                    type="image"
                    name="valve1_1"
                    value={image1}
                    checked={(formState.gorPipe.valve_Type1 === true || formState.gorPipe.valve_Type1 === "true")}
                    onChange={() => handleInputChange("gorPipe.valve_Type1", true)}
                    style={{ margin: "10px 0" }}
                  />

                  <CustomInput
                    type="image"
                    name="valve1_2"
                    value={image2}
                    checked={(formState.gorPipe.valve_Type1 === false || formState.gorPipe.valve_Type1 === "false")}
                    onChange={() => handleInputChange("gorPipe.valve_Type1", false)}
                    style={{ margin: "10px 0" }}
                  />



                </>
              ) : (
                <>
                  {/* <h1>valve_2</h1> */}
                  <CustomInput
                    type="image"
                    name="valve2_1"
                    value={image3}
                    checked={formState.gorPipe.valve_Type1 === true || formState.gorPipe.valve_Type1 === "true"}
                    onChange={() => handleInputChange("gorPipe.valve_Type1", true)}
                    style={{ margin: "10px 0" }}
                  />
                  <CustomInput
                    type="image"
                    name="valve2_2"
                    value={image4}
                    checked={formState.gorPipe.valve_Type1 === false || formState.gorPipe.valve_Type1 === "false"}
                    onChange={() => handleInputChange("gorPipe.valve_Type1", false)}
                    style={{ margin: "10px 0" }}
                  />
                </>
              )}

            </div>
          )}


          {/* <LabeledInputWithUnit
            label="Bucholz Relay Valves"
            unit="Nos."
            inputValue={formState.buch_Rely.buch_Rely_Vlv_Nos || ""}
            onInputChange={(e) =>
              handleInputChange("buch_Rely.buch_Rely_Vlv_Nos", e.target.value)
            }
            isChecked={formState.buch_Rely.buch_Rely_Vlv || false}
            onCheckboxChange={(e) =>
              handleInputChange("buch_Rely.buch_Rely_Vlv", e.target.checked)
            }
            margin="15px 0"
          /> */}
          {/* <LabeledInputWithUnit
            label="Explosion Vent"
            unit="ID"
            inputValue={formState.exp_Vent.exp_Vent_ID || ""}
            onInputChange={(e) =>
              handleInputChange("exp_Vent.exp_Vent_ID", e.target.value)
            }
            isChecked={formState.exp_Vent.exp_Vent || false}
            onCheckboxChange={(e) =>
              handleInputChange("exp_Vent.exp_Vent", e.target.checked)
            }
            margin="15px 0"
          /> */}

          <LabeledInputWithUnit
            label="Explosion Vent"
            type="dropdown"
            dropdownOptions={[
              { label: "Without Oil Indicator", value: false },
              { label: "With Oil Indicator", value: true }
            ]}
            inputValue={formState.exp_Vent.exp_Vent_With_OI}
            onInputChange={(e) => {
              handleInputChange("exp_Vent.exp_Vent_With_OI", e.target.value === "true" ? true : false);
            }}
            isChecked={formState.exp_Vent.exp_Vent || false}
            onCheckboxChange={(e) =>
              handleInputChange("exp_Vent.exp_Vent", e.target.checked)
            }
            margin="15px 0"
          />

          <CustomInput
            type="checkbox"
            label="Pressure Relief"
            checked={formState.pressureRelief}
            onChange={(e) =>
              handleInputChange("pressureRelief", e.target.checked)
            }
          />
          <CustomStepper
            label="Thermometer Pocket"
            value={
              Number(formState.thermoPkt.thermoPkt1) + Number(formState.thermoPkt.thermoPkt2)
            }
            onChange={(e) => {
              if (e.target.value == 0) {
                handleInputChange("thermoPkt.thermoPkt1", false);
                handleInputChange("thermoPkt.thermoPkt2", false);
              } else if (e.target.value == 1) {
                handleInputChange("thermoPkt.thermoPkt1", true);
                handleInputChange("thermoPkt.thermoPkt2", false);
              } else if (e.target.value == 2) {
                handleInputChange("thermoPkt.thermoPkt1", true);
                handleInputChange("thermoPkt.thermoPkt2", true);
              }
            }}
            min={0}
            max={2}
            step={1}
            style={{ margin: "0 0 0 25px" }}
          />
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
          {generate3d?.isLoading ? (
            <CircularProgress
              size={32}
              style={{
                color: "#ffffff",
              }}
            />
          ) : (
            <MyGlbViewer canvasHeight="400" canvasWidth="550" />
          )}
        </ImagePreview>



      </Container>
      <CustomModal title="Accessories (1)" open={open} onClose={handleClose} showButtons={false}>
        {open && generate3d?.isLoading ? (
          <CircularProgress
            size={32}
            style={{
              color: "#ffffff",
            }}
          />
        ) : (
          <MyGlbViewer canvasHeight="600" canvasWidth="1200" open={open} />
        )}
      </CustomModal> */}

    </FlexContainer>
  );
};

export default Accessories1;
