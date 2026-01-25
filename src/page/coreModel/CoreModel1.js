import React, { useState, useEffect } from "react";
import {
  FlexContainer,
  Layout,
  CustomInput,
  Container,
  FilledBtn,
  TextTypo,
  OutlinedBtn,
} from "../../components";
import CircularDiagram from "./CircularDiagram";
import { postApi } from "../../api";
import { useSelector } from "react-redux";
import { selectCalc } from "../../selectors/CalcSelector";

const CoreModel = () => {
  const { twoWindings } = useSelector(selectCalc);
  const [coreData, setCoreData] = useState({});
  const [stepsData, setStepsData] = useState([]);
  const requestPayload = {
    coreDiameter: twoWindings?.data?.core?.coreDia,
    minimumStepWidth: 0,
    numberOfSteps: 0,
    coreStackRequestList: [],
  };

  const [formState, setFormState] = useState(requestPayload);
  useEffect(() => {
    if (
      twoWindings?.data?.core?.coreDia &&
      twoWindings?.data?.core?.coreDia != 0
    ) {
      triggerCoreApi();
    }
  }, []);

  const triggerCoreApi = () => {
    setFormState({
      ...formState,
      coreDiameter: twoWindings?.data?.core?.coreDia,
    });
    postApi("/calculate/core", formState)
      .then((response) => {
        setCoreData(response?.data);
        setStepsData(response?.data?.bldStacks);

        setFormState({
          ...formState,
          coreDiameter: twoWindings?.data?.core?.coreDia,
          minimumStepWidth:
            response?.data?.bldStacks[response?.data?.bldStacks.length - 1]
              .width,
          numberOfSteps: response?.data?.bldStacks.length,
        });
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        // setError(errorMessage || "An error occurred while fetching the data.");
      });
  };

  const handleInputChange = (fieldPath, value) => {
    setFormState((prevState) => {
      // Split the field path to handle nested keys
      const keys = fieldPath.split(".");

      // Traverse through the keys to build the new state
      let newState = { ...prevState };
      let current = newState;

      keys.forEach((key, index) => {
        // If we are at the last key, set the value
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          // Otherwise, move deeper in the structure
          current[key] = { ...current[key] };
          current = current[key];
        }
      });
      return newState;
    });
  };

  const [selectedStep, setSelectedStep] = useState(null);
  const [editedValues, setEditedValues] = useState({ width: "", stack: "" });

  useEffect(() => {
    const defaultStep = stepsData[0];
    if (defaultStep) {
      setSelectedStep(defaultStep.stepNo);
      setEditedValues({ width: defaultStep.width, stack: defaultStep.stack });
    }
  }, [stepsData]);

  const handleRowSelect = (stepNo) => {
    setSelectedStep(stepNo);
    const selectedRow = stepsData.find((row) => row.stepNo === stepNo);
    setEditedValues({ width: selectedRow.width, stack: selectedRow.stack });
  };

  const handleSave = () => {
    const updatedData = stepsData.map((row) =>
      row.stepNo === selectedStep
        ? {
            ...row,
            width: Number(editedValues.width),
            stack: Number(editedValues.stack),
          }
        : row
    );
    setStepsData(updatedData);
  };

  return (
    <Layout>
      <div className="m-3">
        <FlexContainer>
          <Container
            bgColor="white"
            padding="15px"
            borderRadius="5px"
            width="40%"
          >
            {/* <div className="row align-items-start justify-content-between"> */}
            <div className="">
              <FlexContainer>
                <CustomInput
                  label="Dia"
                  type="text"
                  value={twoWindings?.data?.core?.coreDia}
                />
                <CustomInput
                  label="Height"
                  type="text"
                  value={formState.data?.core?.height}
                  onChange={(e) =>
                    handleInputChange("minimumStepWidth", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
                <CustomInput
                  label="Wide"
                  type="text"
                  value={formState.data?.core?.wide}
                  onChange={(e) =>
                    handleInputChange("numberOfSteps", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
              </FlexContainer>
              <FlexContainer>
                <CustomInput
                  label="Steps"
                  type="text"
                  value={twoWindings?.data?.core?.steps}
                />
                <CustomInput
                  label="Minwidth"
                  type="text"
                  value={formState.minimumStepWidth}
                  onChange={(e) =>
                    handleInputChange("minimumStepWidth", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
                <CustomInput
                  label="StkF"
                  type="text"
                  value={formState.stk}
                  onChange={(e) =>
                    handleInputChange("numberOfSteps", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
              </FlexContainer>
              <FlexContainer margin="20px 0px">
                <CustomInput
                  type="dropdown"
                  width="30%"
                  options={[{ label: "3 Blade", value: "3 Blade" }]}
                />
                <OutlinedBtn text="Read Data" />
                <FilledBtn text="Details" bgColor="#C6FE1F" />
              </FlexContainer>
              <FlexContainer>
                <Container
                  margin="20px 0px"
                  bgColor="#ebebeb"
                  padding="10px"
                  borderRadius="10px"
                >
                  <FlexContainer direction="column">
                    <TextTypo
                      text={`Net C/S(Sqcm) = ${
                        coreData?.coreArea ? coreData?.coreArea : 0
                      }`}
                    />
                    <TextTypo
                      text={`Total Weight = ${
                        twoWindings?.data?.core?.coreWeight
                          ? twoWindings?.data?.core?.coreWeight
                          : 0
                      } kg`}
                    />
                    <TextTypo
                      text={`FluxD = ${twoWindings?.data?.fluxDensity}`}
                    />
                  </FlexContainer>
                </Container>
                <Container
                  bgColor="#ebebeb"
                  margin="20px 0px"
                  padding="10px"
                  borderRadius="10px"
                >
                  <FlexContainer direction="column">
                    <TextTypo
                      text={`Designed Core Area = ${
                        coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0
                      }`}
                    />
                    <TextTypo
                      text={`Wt = ${(
                        (coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0) / (coreData?.coreArea ? coreData?.coreArea : 0)
                      ).toFixed(2)}`}
                    />
                    <TextTypo
                      text={`Prev = ${(
                        (coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0) / (coreData?.coreArea ? coreData?.coreArea : 0)
                      ).toFixed(2)}`}
                    />
                    {/* <TextTypo
                      text={`Net Factor = ${(
                        (coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0) / (coreData?.coreArea ? coreData?.coreArea : 0)
                      ).toFixed(2)}`}
                    /> */}
                  </FlexContainer>
                </Container>
              </FlexContainer>
              <FlexContainer align="end">
                <CustomInput
                  label="Step No.:"
                  type="text"
                  value={twoWindings?.data?.core?.stepNo}
                />
                <CustomInput
                  label="Width"
                  type="text"
                  value={formState.minimumStepWidth}
                  onChange={(e) =>
                    handleInputChange("minimumStepWidth", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
                <CustomInput
                  label="Stk"
                  type="text"
                  value={formState.numberOfSteps}
                  onChange={(e) =>
                    handleInputChange("numberOfSteps", e.target.value)
                  }
                  borderColor="0.5px solid #00000033"
                />
                <FilledBtn text="Tune" bgColor="#C6FE1F" />
              </FlexContainer>
              <FlexContainer>
                <Container margin="20px 10px">
                  <div style={{ width: "100%" }}>
                    <table
                      border="1"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        padding: "20px",
                      }}
                      className="core-table"
                    >
                      <thead>
                        <tr>
                          <th>Step No</th>
                          <th>Width</th>
                          <th>Stk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stepsData.map((row) => (
                          <tr
                            key={row.stepNo}
                            onClick={() => handleRowSelect(row.stepNo)}
                            style={{
                              cursor: "pointer",
                              backgroundColor:
                                selectedStep === row.stepNo
                                  ? "#f0f0f0"
                                  : "white",
                            }}
                          >
                            <td>{row.stepNo}</td>
                            <td>{row.width}</td>
                            <td>{row.stack}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Container>

                {selectedStep && (
                  <FlexContainer
                    direction="column"
                    margin="20px 0px"
                    justify="flex-end"
                  >
                    <CustomInput
                      label="Width"
                      value={editedValues.width}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          width: e.target.value,
                        })
                      }
                    />
                    <CustomInput
                      label="Stack"
                      value={editedValues.stack}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          stack: e.target.value,
                        })
                      }
                    />
                    <FilledBtn
                      text="Save"
                      bgColor="#1B1B1B"
                      fontColor="white"
                      padding="10px 20px"
                      borderRadius="20px"
                      onClick={handleSave}
                      width="100%"
                    />
                  </FlexContainer>
                )}
              </FlexContainer>
              <FlexContainer justify="">
                <OutlinedBtn
                  text="Print Preview"
                  bgColor="#1B1B1B"
                  padding="10px 20px"
                  borderRadius="5px"
                />
                <FilledBtn
                  text="Print"
                  bgColor="#1B1B1B"
                  fontColor="white"
                  padding="10px 20px"
                  borderRadius="5px"
                />
              </FlexContainer>
            </div>
            {/* <div className="col-lg-6 my-3">
              <CircularDiagram
                stepsData={stepsData}
                highlightedStep={selectedStep}
              />
            </div> */}
            {/* </div> */}
          </Container>
          <Container bgColor="black" borderRadius="20px"></Container>
        </FlexContainer>
      </div>
    </Layout>
  );
};

export default CoreModel;
