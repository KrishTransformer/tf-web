import React, { useState, useEffect } from "react";
import {
  FlexContainer,
  Layout,
  CustomInput,
  Container,
  FilledBtn,
  TextTypo,
  PrintPreview,
} from "../../components";
import CircularDiagram from "./CircularDiagram";
import { postApi } from "../../api";
import { useSelector } from "react-redux";
import { selectCalc, selectCore } from "../../selectors/CalcSelector";
import { useActions } from "../../app/use-Actions";
import { selectEntity } from "../../selectors/EntitySelector";
import { addCalc } from "../../actions/CalcActions";
import { useParams } from "react-router-dom";
import "./CoreModel.css";
const CoreModel = () => {
  const { id } = useParams();
  const { twoWindings } = useSelector(selectCalc);
  const { core } = useSelector(selectCore);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("appTheme") === "dark"
  );
  const [coreData, setCoreData] = useState(core?.data);
  const [stepsData, setStepsData] = useState(core?.data?.bldStacks);
  //console.log("Core Data:", coreData);
  console.log("Steps Data:", stepsData);
  console.log("twoWindings?.data?.core?.coreDia:", twoWindings?.data?.core?.coreDia);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { design } = useSelector(selectEntity);
  const actions = useActions({
    addCalc,
  });

  const requestPayload = {
    coreDiameter: twoWindings?.data?.core?.coreDia,
    limbHt: twoWindings?.data?.core?.limbHt,
    cenDist: twoWindings?.data?.core?.cenDist,
    minimumStepWidth: 0,
    numberOfSteps: 0,
    fixtureStepWidth: null,
    eCoreBladeType: 'CRUSI_3',
    coreStackRequestList: [],
    prevCoreStackRequestList: [],
  };

  if (core?.data?.coreArea) {
    requestPayload.minimumStepWidth =
      core?.data?.bldStacks[core?.data?.bldStacks?.length - 1]?.width;
    requestPayload.numberOfSteps = core?.data?.bldStacks?.length;
  }
  const [formState, setFormState] = useState(requestPayload);
  useEffect(() => {
    if (
      twoWindings?.data?.core?.coreDia &&
      twoWindings?.data?.core?.coreDia != 0 &&
      !core?.data?.coreArea
    ) {
      triggerCoreApi(formState);
    }
  }, []);

  useEffect(() => {
    setCoreData(core?.data);
    setStepsData(core?.data?.bldStacks);
    if (core?.data?.coreArea) {
      setFormState({
        ...formState,
        coreDiameter: twoWindings?.data?.core?.coreDia,
        minimumStepWidth:
          core?.data?.bldStacks[core?.data?.bldStacks?.length - 1].width,
        numberOfSteps: core?.data?.bldStacks?.length,
      });
    }
  }, [core]);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("appTheme") === "dark";
    setIsDarkMode(darkModeEnabled);

    if (darkModeEnabled) {
      document.body.classList.add("app-dark-mode");
      document.body.style.backgroundColor = "#101722";
      document.documentElement.style.backgroundColor = "#101722";
    } else {
      document.body.classList.remove("app-dark-mode");
      document.body.style.backgroundColor = "#ebebeb";
      document.documentElement.style.backgroundColor = "#ebebeb";
    }
  }, []);

  const triggerCoreApi = (payload) => {
    let entityId = "";
    if (twoWindings?.data?.designId) {
      entityId = design?.data?.data?.filter(
        (item) => item.designId == twoWindings?.data?.designId
      )[0]?.id;
    }
    actions.addCalc(payload, "core", undefined, entityId);
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
    if (stepsData?.length > 0) {
      const defaultStep = stepsData[0];
      setSelectedStep(defaultStep.stepNo);
      setEditedValues({ width: defaultStep.width, stack: defaultStep.stack });
    }
  }, [stepsData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl (or Cmd on Mac) and Enter are pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        console.log("Ctrl + Enter pressed");
        e.preventDefault();
        if (!core?.isLoading) {
          triggerCoreApi(formState);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [core?.isLoading, triggerCoreApi]);

  const handleRowSelect = (stepNo) => {
    console.log("Row selected:", stepNo);
    setSelectedStep(stepNo);
    const selectedRow = stepsData.find((row) => row.stepNo === stepNo);
    setEditedValues({ width: selectedRow.width, stack: selectedRow.stack });
  };

  const handleSave = () => {
    let prevData = stepsData.filter((row) => row.stepNo < selectedStep);
    let updatedWidth = editedValues.width;
    let updatedStack = editedValues.stack;
    console.log("Updated Width:", updatedWidth);
    console.log("Updated Stack:", updatedStack);
    let payload = {
      ...formState,
      prevCoreStackRequestList: prevData,
      coreStackRequestList: [
        {
          stepNo: selectedStep,
          width: updatedWidth,
          stack: updatedStack,
        },
      ],
    };
    triggerCoreApi(payload);
  };

// const findMinStack = (stepsData) => {
//   if (!stepsData || stepsData.length === 0) return null;

//   return stepsData.reduce((min, step) => {
//     if (step.stack < min) {
//       return step.stack;
//     }
//     return min;
//   }, stepsData[0].stack);
// };


// const minStack = findMinStack(stepsData);
// console.log("minStack:", minStack);

// const calculateNoOfSteps = (coreDia, minWidth) => {
//   if (!coreDia || !minWidth) return 0;

//   const result = Math.sqrt(Math.pow(coreDia, 2) - Math.pow(minWidth, 2));
//   return Math.round(result);
// };

// const noOfSteps = calculateNoOfSteps(twoWindings?.data?.core?.coreDiatwoWindings?.data?.core?.coreDia, minStack);
// console.log("No. of Steps:", noOfSteps);



const calculateLimitedStacks = (steps, coreDia) => {
  let sumPrev = 0;

  return steps?.map(step => {
    const limit = Math.sqrt(coreDia ** 2 - step.width ** 2) - sumPrev;
    const newStack = Math.min(step.stack, Math.max(0, Math.floor(limit)));
    //console.log("newStack:", newStack);
    sumPrev += newStack;
    //console.log("sumPrev:", sumPrev);
    return Math.floor(limit);
  });
};
const limitedStacks = calculateLimitedStacks(stepsData, twoWindings?.data?.core?.coreDia);
console.log("stepsData:", stepsData);
console.log("Limited Stacks:", limitedStacks);




  return (
    <Layout
      id={id}
      isThinHeader={true}
      headProps={{
        currentPath: twoWindings.data.designId,
      }}
    >
      <div className={`core-model-page ${isDarkMode ? "core-model-page-dark" : ""}`}>
        <div className="core-model-shell">
        <Container className="core-card" bgColor="var(--core-surface)" padding="20px 30px" borderRadius="10px">
          <div className="row align-items-start justify-content-between">
            <div className="col-lg-4">
              {/* <p>{JSON.stringify(formState)}</p> */}
              <FlexContainer>
                <CustomInput
                  label="Core Diameter"
                  type="text"
                  value={twoWindings?.data?.core?.coreDia}
                />
                <CustomInput
                  label="Minimum Step Width"
                  type="text"
                  value={formState.minimumStepWidth}
                  onChange={(e) =>
                    handleInputChange("minimumStepWidth", e.target.value)
                  }
                  bgColor="var(--app-input-accent-bg)"
                  borderColor="var(--app-input-border)"
                />
                <CustomInput
                  label="Number Of Steps"
                  type="text"
                  value={formState.numberOfSteps}
                  onChange={(e) =>
                    handleInputChange("numberOfSteps", e.target.value)
                  }
                  bgColor="var(--app-input-accent-bg)"
                  borderColor="var(--app-input-border)"
                />
              </FlexContainer>
              <FlexContainer margin="20px 0px" justify="">
                {/* <FilledBtn
                  text="3Blade"
                  bgColor="#1B1B1B"
                  fontColor="white"
                  padding="10px 20px"
                  borderRadius="5px"
                /> */}
                <CustomInput
                  label="Fixture Step Width"
                  type="text"
                  value={formState.fixtureStepWidth}
                  onChange={(e) => handleInputChange("fixtureStepWidth", e.target.value)}
                />
                <CustomInput
                  label="Blade Type"
                  type="dropdown"
                  options={[
                    { label: "CRUSI_3", value: "CRUSI_3" },
                    { label: "BLADE_3", value: "BLADE_3" },
                    { label: "BLADE_4", value: "BLADE_4" },
                    { label: "CRUSI_4", value: "CRUSI_4" },
                  ]}
                  value={formState.eCoreBladeType}
                  onChange={(e) => handleInputChange("eCoreBladeType", e.target.value)}
                />

                {/* <FilledBtn
                  text="Details"
                  bgColor="#1B1B1B"
                  fontColor="white"
                  padding="10px 20px"
                  borderRadius="20px"
                /> */}
              </FlexContainer>
              <Container
                className="core-card-soft"
                margin="20px 0px"
                bgColor="var(--core-surface-soft)"
                padding="20px"
                borderRadius="5px"
              >
                <FlexContainer>
                  <FlexContainer align="start" direction="column">

                    {/* <TextTypo
                      text={
                        <>
                          <strong>Gross Core Area </strong> ={" "}
                          {coreData?.coreArea ? coreData?.coreArea : 0} sqmm
                        </>
                      }
                      fontWeight="normal"
                      //fontSize="12px"
                    />

                    <TextTypo
                      text={`Total Weight = ${coreData?.coreWeight ? coreData?.coreWeight : 0
                        } kg`}
                    />
                    <TextTypo
                      text={`Flux Density = ${twoWindings?.data?.lvFormulas?.revisedFluxDensity.toFixed(3)}`}
                    />
                  </FlexContainer> */}
                    {/* </Container>
              <Container
                bgColor="#ebebeb"
                margin="20px 0px"
                padding="20px"
                borderRadius="5px"
              > */}
                    {/* <FlexContainer align="start" direction="row">
                    <TextTypo
                      text={`Designed Core Area : ${coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0
                        }`}
                    /> */}
                    {/* <TextTypo
                      text={`Prev : ${(
                        (coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0) / (coreData?.coreArea ? coreData?.coreArea : 0)
                      ).toFixed(2)}Sq.cm, 0 kg`}
                    /> */}
                    {/* <TextTypo
                      text={`Net Factor : ${(
                        (coreData?.designedCoreArea
                          ? coreData?.designedCoreArea
                          : 0) / (coreData?.coreArea ? coreData?.coreArea : 0)
                      ).toFixed(3)}`}
                    /> */}

                    <TextTypo
                      text={
                        <>
                          <strong>Gross Core Area</strong> = {coreData?.coreArea || 0} sqmm
                        </>
                      }
                      fontWeight="normal"
                      fontColor="var(--core-page-text)"
                    />

                    <TextTypo
                      text={
                        <>
                          <strong>Total Weight</strong> = {coreData?.coreWeight || 0} kg
                        </>
                      }
                      fontColor="var(--core-page-text)"
                    />

                    <TextTypo
                      text={
                        <>
                          <strong>Flux Density</strong> = {twoWindings?.data?.lvFormulas?.revisedFluxDensity?.toFixed(3)} T
                        </>
                      }
                      fontColor="var(--core-page-text)"
                    />

                    <TextTypo
                      text={
                        <>
                          <strong>Designed Core Area</strong> = {coreData?.designedCoreArea || 0} sqmm
                        </>
                      }
                      fontColor="var(--core-page-text)"
                    />

                    <TextTypo
                      text={
                        <>
                          <strong>Net Factor</strong> : {(
                            (coreData?.designedCoreArea || 0) /
                            (coreData?.coreArea || 0)
                          ).toFixed(3)}
                        </>
                      }
                      fontColor="var(--core-page-text)"
                    />


                  </FlexContainer>
                </FlexContainer>
              </Container>
              <FlexContainer>
                <Container margin="20px 0px">
                  <div style={{ width: "100%" }}>
                    <table
                      className="core-table"
                    >
                      <thead>
                        <tr>
                          <th>Step No</th>
                          <th>Width</th>
                          <th>Stack</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stepsData?.map((row) => (
                          <tr
                            key={row.stepNo}
                            onClick={() => handleRowSelect(row.stepNo)}
                            style={{ cursor: "pointer" }}
                            className={selectedStep === row.stepNo ? "is-selected" : ""}
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
                          stack: "",
                        })
                      }
                      bgColor="var(--app-input-accent-bg)"
                      borderColor="var(--app-input-border)"
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
                      bgColor="var(--app-input-accent-bg)"
                      borderColor="var(--app-input-border)"
                    />
                    <FilledBtn
                      text="Save"
                      bgColor="var(--core-btn-bg)"
                      fontColor="var(--core-btn-text)"
                      padding="10px 20px"
                      borderRadius="5px"
                      onClick={handleSave}
                      width="100%"
                    />
                  </FlexContainer>
                )}
              </FlexContainer>
              <FlexContainer justify="">
                {/* <FilledBtn
                  text="Close / End"
                  bgColor="#1B1B1B"
                  fontColor="white"
                  padding="10px 20px"
                  borderRadius="5px"
                />
                <FilledBtn
                  text="Print"
                  bgColor="#1B1B1B"
                  fontColor="white"
                  padding="10px 20px"
                  borderRadius="5px"
                /> */}
                <FilledBtn
                  text="Print Preview"
                  bgColor="var(--core-btn-bg)"
                  fontColor="var(--core-btn-text)"
                  padding="10px 20px"
                  borderRadius="5px"
                  onClick={() => setIsPreviewOpen(true)}
                />
                <FilledBtn
                  text="Calculate"
                  bgColor="var(--core-btn-bg)"
                  fontColor="var(--core-btn-text)"
                  padding="10px 20px"
                  borderRadius="5px"
                  onClick={() => triggerCoreApi(formState)}
                />
              </FlexContainer>
            </div>
            <div className="col-lg-8 my-3">
              {core?.data?.coreArea && stepsData?.length > 0 && (
                <CircularDiagram
                  stepsData={stepsData}
                  highlightedStep={selectedStep}
                  coreDiameter={twoWindings?.data?.core?.coreDia}
                />
              )}
            </div>
          </div>
        </Container>
        </div>
      </div>
        <PrintPreview
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          coreData={coreData}
        >
          core
        </PrintPreview>
    </Layout>
  );
};

export default CoreModel;
