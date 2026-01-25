import React, { useState, useEffect } from "react";
import {
  // FilledBtn,
  Layout,
  FlexContainer,
  // OutlinedBtn,
  TextTypo,
  Container,
} from "../../components";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import { useActions } from "../../app/use-Actions";
import {
  addCalc,
  clearCalc,
  addCalcFullfiled,
} from "../../actions/CalcActions";
import { addEntity } from "../../actions/EntityActions";
import { useSelector } from "react-redux";
import { selectCalc } from "../../selectors/CalcSelector";
import { selectEntity } from "../../selectors/EntitySelector";
import { initialState } from "./../../reducers/CalcReducer";
import { useParams } from "react-router-dom";
const TwoWinding = () => {
  const { id } = useParams();

  const { twoWindings } = useSelector(selectCalc);
  console.log("twoWindings?.data?.lockedAttributes:", twoWindings?.data?.lockedAttributes);
  const [formState, setFormState] = useState(twoWindings?.data);
  const { design } = useSelector(selectEntity);
  const [lockedAttributes, setLockedAttributes] = useState({});
  const [commentText, setCommentText] = useState("");


  const handleHover = (fieldPath) => {
    setCommentText(formState?.comments?.[fieldPath] || "");
    //alert(`hovered, ${fieldPath}:${formState?.comments?.[fieldPath]}`);
  };

  const handleMouseLeave = () => {
    setCommentText("");
  };

  const handleToggleLock = (fieldPath, value) => {
    // console.log("Toggling lock:", fieldPath, " current:", value);
    setLockedAttributes((prevState) => {
      // Split the field path to handle nested keys
      const keys = fieldPath?.split(".");
      console.log("keys:", keys);

      // Traverse through the keys to build the new state
      let newState = { ...prevState };

      //Start of lock 
      //conductor sizes and no in parallel should never be locked together
      const [section, field] = keys;
      console.log("section:", section);
      console.log("field:", field);

      if (field === "conductorSizes") {
        console.log("inside the condition", !value)
        const newValue = !value;
        if (newState[section]) {
          if ("condBreadth" in newState[section]) {
            newState[section].condBreadth = newValue;
          }
          if ("condHeight" in newState[section]) {
            newState[section].condHeight = newValue;
          }
        }
        console.log("lockedAttributes.innerWiindings.condBreadth:", newState.innerWindings.condBreadth);
        console.log("lockedAttributes.innerWiindings.condHeight:", newState.innerWindings.condHeight);
        console.log("lockedAttributes.outerWindings.condBreadth:", newState.outerWindings.condBreadth);
        console.log("lockedAttributes.outerWindings.condHeight:", newState.outerWindings.condHeight);

      }

      if ((field === 'conductorSizes' || field === 'noInParallel') && !value) {
        const opposingField = field === 'conductorSizes' ? 'noInParallel' : 'conductorSizes';
        if (newState[section]?.[opposingField]) //checking the opp field is locked
        {
          newState[section][opposingField] = false; //Checked to unlocked
        }
      }

      if ((section === 'innerWindings' || section === 'outerWindings') && field === 'conductorSizes') {
        if (!value && newState.core?.limbHt) {
          return prevState;
        }
      }

      // Standard lock toggle logic
      let current = newState;
      console.log("fieldPath:", fieldPath);
      console.log("value:", value);

      keys?.forEach((key, index) => {
        // If we are at the last key, set the value
        if (index === keys?.length - 1) {
          current[key] = !value;
        } else {
          // Otherwise, move deeper in the structure
          current[key] = { ...current[key] };
          current = current[key];
        }
      });

      if (keys?.length >= 2 && keys[0] === 'core' && keys[1] === 'coreDia') {
        if (!value) {
          if (newState.core && !newState.core.limbHt) {
            newState.core.limbHt = false;
          }
        }
      }

      if (newState.coreLock && newState.coreLock.coreDia && newState.coreLock.limbHt) {
        console.log("coreDia and limbHt are locked");
        if (newState.innerWindings) {
          //newState.innerWindings.conductorSizes = false;
          newState.innerWindings.noInParallel = false;
          //newState.innerWindings.condBreadth = false;
          //newState.innerWindings.condHeight = false;
        }
        if (newState.outerWindings) {
          //newState.outerWindings.conductorSizes = false;
          newState.outerWindings.noInParallel = false;
        }
        console.log("lockedAttributes.innerWindings:", lockedAttributes.innerWindings);

      }

      // end of lock
      return newState;
    });


  };


  const actions = useActions({
    addCalc,
    clearCalc,
    addCalcFullfiled,
    addEntity,
  });

  //console.log("formState.innerWindings:", formState.innerWindings);

  const handleInputChange = (fieldPath, value) => {
    //console.log("fieldPath:", fieldPath, " value:", value);

    if (fieldPath === "eTransCostType") {
      setFormState((prevState) => {
        const newState = { ...prevState };
        const current = newState;
        current.eTransCostType = value;

        // For both LV and HV, check individually
        if (value === "ECONOMIC") {
          current.lvCurrentDensity =
            current.lVConductorMaterial === "Cu" ? "4.24" : "2.37";
          current.hvCurrentDensity =
            current.hVConductorMaterial === "Cu" ? "4.24" : "2.37";
        }

        if (value === "ENERGY_EFFICIENT") {
          current.lvCurrentDensity =
            current.lVConductorMaterial === "Cu" ? "1.7" : "0.9";
          current.hvCurrentDensity =
            current.hVConductorMaterial === "Cu" ? "1.7" : "0.9";
        }

        return newState;
      });
    }


    if (fieldPath == "lvCurrentDensity") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   lowVoltage: prevState.lowVoltage,
        //   highVoltage: prevState.highVoltage,
        //   lvWindingType: prevState.lvWindingType,
        //   hvWindingType: prevState.hvWindingType,
        //   hvCurrentDensity: prevState.hvCurrentDensity,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   lvCurrentDensity: value,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.lvCurrentDensity = value;
        return newState;

      });
    } else if (fieldPath == "hvCurrentDensity") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   lowVoltage: prevState.lowVoltage,
        //   highVoltage: prevState.highVoltage,
        //   lvWindingType: prevState.lvWindingType,
        //   hvWindingType: prevState.hvWindingType,
        //   lvCurrentDensity: prevState.lvCurrentDensity,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   hvCurrentDensity: value,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.hvCurrentDensity = value;
        return newState;
      });
    } else if (fieldPath == "lowVoltage") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   highVoltage: prevState.highVoltage,
        //   hvWindingType: prevState.hvWindingType,
        //   lvWindingType: prevState.lvWindingType,
        //   lowVoltage: value,
        //
        //   eTransBodyType: prevState.eTransBodyType,
        //   eTransCostType: prevState.eTransCostType,
        //   frequency: prevState.frequency,
        //   hvCurrentDensity: prevState.hvCurrentDensity,
        //   lvCurrentDensity: prevState.lvCurrentDensity,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   core:{
        //     ...prevState.core,
        //     coreMaterial:prevState.coreMaterial,
        //   },
        //   fluxDensity:prevState.fluxDensity,
        //   vectorGroup:prevState.vectorGroup,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.lowVoltage = value;
        return newState;
      });
    } else if (fieldPath == "lvWindingType") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   highVoltage: prevState.highVoltage,
        //   hvWindingType: prevState.hvWindingType,
        //   lowVoltage: prevState.lowVoltage,
        //   lvWindingType: value,

        //   eTransBodyType: prevState.eTransBodyType,
        //   eTransCostType: prevState.eTransCostType,
        //   frequency: prevState.frequency,
        //   hvCurrentDensity: prevState.hvCurrentDensity,
        //   lvCurrentDensity: prevState.lvCurrentDensity,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   core: {
        //     ...prevState.core,
        //     coreMaterial: prevState.coreMaterial,
        //   },
        //   fluxDensity: prevState.fluxDensity,
        //   vectorGroup: prevState.vectorGroup,

        // };

        let newState = { ...prevState };
        let current = newState;
        current.lvWindingType = value;
        return newState;

      });
    } else if (fieldPath == "highVoltage") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   lowVoltage: prevState.lowVoltage,
        //   lvWindingType: prevState.lvWindingType,
        //   hvWindingType: prevState.hvWindingType,
        //   highVoltage: value,

        //   eTransBodyType: prevState.eTransBodyType,
        //   eTransCostType: prevState.eTransCostType,
        //   frequency: prevState.frequency,
        //   hvCurrentDensity: prevState.hvCurrentDensity,
        //   lvCurrentDensity: prevState.lvCurrentDensity,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   core: {
        //     ...prevState.core,
        //     coreMaterial: prevState.coreMaterial,
        //   },
        //   fluxDensity: prevState.fluxDensity,
        //   vectorGroup: prevState.vectorGroup,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.highVoltage = value;
        return newState;

      });
    } else if (fieldPath == "hvWindingType") {
      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: prevState.kVA,
        //   lowVoltage: prevState.lowVoltage,
        //   lvWindingType: prevState.lvWindingType,
        //   highVoltage: prevState.highVoltage,
        //   hvWindingType: value,

        //   eTransBodyType: prevState.eTransBodyType,
        //   eTransCostType: prevState.eTransCostType,
        //   frequency: prevState.frequency,
        //   hvCurrentDensity: prevState.hvCurrentDensity,
        //   lvCurrentDensity: prevState.lvCurrentDensity,
        //   hVConductorMaterial: prevState.hVConductorMaterial,
        //   lVConductorMaterial: prevState.lVConductorMaterial,
        //   core: {
        //     ...prevState.core,
        //     coreMaterial: prevState.coreMaterial,
        //   },
        //   fluxDensity: prevState.fluxDensity,
        //   vectorGroup: prevState.vectorGroup,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.hvWindingType = value;
        return newState;

      });
    } else if (fieldPath == "kVA") {

      console.log("kVA value:", value)
      let kVA = value;
      let hvVoltage;
      let lvVoltage;
      let hvWinding;
      let lvWinding;
      let fluxDensity;

      if (kVA <= 2500) {
        hvVoltage = 11000;
        lvVoltage = 433;
        hvWinding = "HELICAL"; // DISC // FOIL
        lvWinding = "HELICAL";
        fluxDensity = 1.7333;
      } else if (kVA > 2500 && kVA <= 20000) {
        hvVoltage = 33000;
        lvVoltage = 11000;
        hvWinding = "DISC"; // DISC // FOIL
        lvWinding = "HELICAL";
        fluxDensity = 1.69;
      } else {
        hvVoltage = 132000;
        lvVoltage = 33000;
        hvWinding = "DISC"; // DISC // FOIL
        lvWinding = "DISC";
        fluxDensity = 1.69;
      }
      console.log("hvVoltage", hvVoltage)
      console.log("lvVoltage", lvVoltage)
      console.log("hvWinding", hvWinding)
      console.log("lvWinding", lvWinding)


      setFormState((prevState) => {
        // return {
        //   ...initialState.twoWindings.data,
        //   kVA: value,
        //   lowVoltage: prevState.lowVoltage,
        //   highVoltage: prevState.highVoltage,
        // };

        let newState = { ...prevState };
        let current = newState;
        current.kVA = value;
        current.highVoltage = hvVoltage;
        current.lowVoltage = lvVoltage;
        current.hvWindingType = hvWinding;
        current.lvWindingType = lvWinding;
        current.fluxDensity = fluxDensity;
        return current;
      });
    } else {
      if (fieldPath == "isCSP" && value == "on") {
        if (formState.isCSP) {
          value = false;
        } else {
          value = true;
        }
      } else if (fieldPath == "outerWindings.turnsPerPhase") {
        setFormState((prevState) => {
          let newState = { ...prevState };
          let current = newState;
          current.outerWindings = initialState.twoWindings.data.outerWindings;
          current.tankLoss = "";
          return newState;
        });
      } else if (fieldPath == "innerWindings.turnsPerPhase") {
        setFormState((prevState) => {
          let newState = { ...prevState };
          let current = newState;
          current.innerWindings = initialState.twoWindings.data.innerWindings;
          current.outerWindings = initialState.twoWindings.data.outerWindings;
          current.tankLoss = "";

          return newState;
        });
      }
      else if (fieldPath == "innerWindings.isEnamel") {
        //console.log("fieldPath:",fieldPath);
        setFormState((prevState) => ({
          ...prevState,
          innerWindings: {
            ...prevState.innerWindings,
            condInsulation: ""
          }
        }));
      }
      else if (fieldPath == "outerWindings.isEnamel") {
        setFormState((prevState) => ({
          ...prevState,
          outerWindings: {
            ...prevState.outerWindings,
            condInsulation: ""
          }
        }));
      } else if (fieldPath == "core.coreDia" || fieldPath == "core.limbHt") {
        console.log("fieldPath:", fieldPath);
        setFormState((prevState) => {
          let newState = { ...prevState };

          // console.log(
          //   "prevState.innerWindings.turnsPerPhase:",
          //   prevState.innerWindings.turnsPerPhase
          // );

          let current = newState;
          current.innerWindings = {
            ...initialState.twoWindings.data.innerWindings,
            ...(lockedAttributes.innerWindings?.turnsPerPhase && {
              turnsPerPhase: prevState.innerWindings.turnsPerPhase,
            }),
            ...(lockedAttributes.innerWindings?.conductorSizes && {
              conductorSizes: prevState.innerWindings.conductorSizes,
              condHeight: prevState.innerWindings.condHeight,
              condBreadth: prevState.innerWindings.condBreadth,

            }),
            ...lockedAttributes.innerWindings?.noInParallel && {
              noInParallel: prevState.innerWindings.noInParallel,
              radialParallelCond: prevState.innerWindings.radialParallelCond,
              axialParallelCond: prevState.innerWindings.axialParallelCond,
            },
          };
          //console.log("current.innerWindings:", current.innerWindings);

          current.outerWindings = {
            ...initialState.twoWindings.data.outerWindings,
            ...(lockedAttributes?.outerWindings?.conductorSizes && {
              conductorSizes: prevState.outerWindings.conductorSizes,
              condHeight: prevState.outerWindings.condHeight,
              condBreadth: prevState.outerWindings.condBreadth,

            }),
            ...lockedAttributes?.outerWindings?.noInParallel && {
              noInParallel: prevState.outerWindings.noInParallel,
              radialParallelCond: prevState.outerWindings.radialParallelCond,
              axialParallelCond: prevState.outerWindings.axialParallelCond,
            },
          };

          current.tankLoss = "";
          current.coilDimensions = {
            ...initialState.twoWindings.data.coilDimensions,
            coreGap: prevState.coilDimensions.coreGap,
            lvhvgap: prevState.coilDimensions.lvhvgap,
            hvhvgap: prevState.coilDimensions.hvhvgap,
          };

          //console.log("newState:", newState, fieldPath);
          return newState;
        });
      } else if (fieldPath == "vectorGroup") {
        setFormState((prevState) => {
          let newState = { ...prevState };
          let current = newState;
          current = {
            ...current,
            buildFactor: prevState.buildFactor,
          }
          current.innerWindings = initialState.twoWindings.data.innerWindings;
          current.outerWindings = initialState.twoWindings.data.outerWindings;
          current.tankLoss = "";
          current.coilDimensions = initialState.twoWindings.data.coilDimensions;
          current.core = {
            ...initialState.twoWindings.data.core,
            coreMaterial: prevState.core.coreMaterial,

          };
          return newState;
        });
      } else if (fieldPath == "fluxDensity") {
        console.log("fluxDensity value:", value);
        setFormState((prevState) => {
          let newState = { ...prevState };
          let current = newState;
          console.log("current.kVA:", current.kVA);
          if (current.kVA <= 2500 && value > 1.7333) {
            console.log('yes higher')
            current.fluxDensity = 1.7333;
          } else if (current.kVA > 2500 && value > 1.69) {
            current.fluxDensity = 1.69;
          } else {
            current.fluxDensity = value;
          }

          current.innerWindings = initialState.twoWindings.data.innerWindings;
          current.outerWindings = initialState.twoWindings.data.outerWindings;
          current.tankLoss = "";
          current.core = {
            ...initialState.twoWindings.data.core,
            ...(lockedAttributes.coreLock?.coreDia && {
              coreDia: prevState.core.coreDia,
            }),
            ...(lockedAttributes.coreLock?.limbHt && {
              limbHt: prevState.core.limbHt,
            }),
            coreMaterial: prevState.core.coreMaterial,

          };
          current.coilDimensions = {
            ...initialState.twoWindings.data.coilDimensions,
            coreGap: prevState.coilDimensions.coreGap,
            lvhvgap: prevState.coilDimensions.lvhvgap,
            hvhvgap: prevState.coilDimensions.hvhvgap,
          };
          return newState;
        });
      } else if (
        fieldPath == "tapStepsPercent" ||
        fieldPath == "tapStepsPositive" ||
        fieldPath == "tapStepsNegative"
      ) {
        setFormState((prevState) => {
          let newState = { ...prevState };
          let current = newState;
          current.outerWindings = initialState.twoWindings.data.outerWindings;
          return newState;
        });
      }

      else if (fieldPath == "innerWindings.radialParallelCond" || fieldPath == "innerWindings.axialParallelCond") {
        setFormState(
          (prevState) => {
            let newState = { ...prevState };
            let current = newState;
            current.innerWindings = {
              ...current.innerWindings,
              ...(!lockedAttributes?.innerWindings?.conductorSizes && {
                condBreadth: "",
                condHeight: "",
              }),
            }
            return newState;
          }
        )
      }

      else if (fieldPath == "outerWindings.radialParallelCond" || fieldPath == "outerWindings.axialParallelCond") {
        setFormState(
          (prevState) => {
            let newState = { ...prevState };
            let current = newState;
            current.outerWindings = {
              ...current.outerWindings,
              ...(!lockedAttributes?.outerWindings?.conductorSizes && {
                condBreadth: "",
                condHeight: "",
              }),
            }
            return newState;
          }
        )
      }


      else if (fieldPath == "innerWindings.noOfLayers") {
        setFormState(
          prevState => {
            let newState = { ...prevState };
            let current = newState;
            current.innerWindings = {
              ...current.innerWindings,
              ...(!lockedAttributes?.innerWindings?.noInParallel && {
                noInParallel: "",
                radialParallelCond: "",
                axialParallelCond: "",
              }),
            }
            return newState;
          }
        )

      }

      else if (fieldPath == "outerWindings.noOfLayers") {

        setFormState(
          prevState => {
            let newState = { ...prevState };
            let current = newState;
            current.outerWindings = {
              ...current.outerWindings,
              ...(!lockedAttributes?.outerWindings?.noInParallel && {
                noInParallel: "",
                radialParallelCond: "",
                axialParallelCond: "",
              }),
            }
            return newState;
          }
        )

      }


      else if (fieldPath == "outerWindings.conductorDiameter") {

        setFormState(
          prevState => {
            let newState = { ...prevState };
            let current = newState;
            current.outerWindings = {
              ...current.outerWindings,
              ...(current.outerWindings.isConductorRound && {
                condBreadth: value,
                condHeight: value,
                conductorDiameter: value,
              })
            }
            return newState;
          }
        )
      }



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
    }
  };

  console.log("lockedAttributes:", lockedAttributes);
  console.log("formstate in 2wdg page", formState)

  const handleCalculate = () => {
    let dataToSubmit = JSON.parse(JSON.stringify(formState));
    console.log("dataToSubmit:", dataToSubmit);

    // Add the updated locked attributes to the payload
    dataToSubmit.lockedAttributes = {
      coreLock: lockedAttributes.coreLock,
      innerWindings: lockedAttributes.innerWindings,
      outerWindings: lockedAttributes.outerWindings
    };

    // Process locked attributes - set null for unlocked fields
    if (lockedAttributes.innerWindings) {
      Object.keys(lockedAttributes.innerWindings).forEach(key => {
        if (!lockedAttributes.innerWindings[key]) {
          if (dataToSubmit.innerWindings && dataToSubmit.innerWindings[key] !== undefined) {
            //console.log("dataToSubmit.innerWindings[key]: ",dataToSubmit.innerWindings[key],key);
            dataToSubmit.innerWindings[key] = null;
            //console.log("after dataToSubmit.innerWindings[key]: ",dataToSubmit.innerWindings[key],key);
          }
        }
      });
    }

    if (lockedAttributes.outerWindings) {
      Object.keys(lockedAttributes.outerWindings).forEach(key => {
        if (!lockedAttributes.outerWindings[key]) {
          if (dataToSubmit.outerWindings && dataToSubmit.outerWindings[key] !== undefined) {
            dataToSubmit.outerWindings[key] = null;
          }
        }
      });
    }

    if (lockedAttributes.coreLock) {
      Object.keys(lockedAttributes.coreLock).forEach(key => {
        if (!lockedAttributes.coreLock[key]) {
          if (dataToSubmit.core && dataToSubmit.core[key] !== undefined) {
            dataToSubmit.core[key] = null;
          }
        }
      });
    }

    let entityId = "";
    if (twoWindings?.data?.designId) {
      entityId = design?.data?.data?.filter((item) => item.designId == twoWindings?.data?.designId)[0]?.id;
    }

    // Send the modified data to the API
    console.log("dataToSubmit.innerWindings:", dataToSubmit.lockedAttributes);
    actions.addCalc(dataToSubmit, "2windings", "/circular", entityId, twoWindings?.metadata);
    console.log("dataToSubmit.innerWindings: after_call", dataToSubmit.lockedAttributes);

    window.scrollTo(0, 0);

  };

  const handleReset = () => {
    actions.clearCalc();
    window.scrollTo(0, 0);
    setFormState(twoWindings?.data);
  };

  useEffect(() => {
    const initialLockState = {
      coreLock: {
        coreDia: twoWindings?.data?.lockedAttributes.coreLock.coreDia,
        limbHt: twoWindings?.data?.lockedAttributes.coreLock.limbHt,
      },
      innerWindings: {
        turnsPerPhase: twoWindings?.data?.lockedAttributes.innerWindings.turnsPerPhase,
        conductorSizes: twoWindings?.data?.lockedAttributes.innerWindings.conductorSizes,
        noInParallel: twoWindings?.data?.lockedAttributes.innerWindings.noInParallel,
        condBreadth: twoWindings?.data?.lockedAttributes.innerWindings.condBreadth,
        condHeight: twoWindings?.data?.lockedAttributes.innerWindings.condHeight,

      },
      outerWindings: {
        turnsPerPhase: twoWindings?.data?.lockedAttributes.outerWindings.turnsPerPhase,
        conductorSizes: twoWindings?.data?.lockedAttributes.outerWindings.conductorSizes,
        noInParallel: twoWindings?.data?.lockedAttributes.outerWindings.noInParallel,
        condBreadth: twoWindings?.data?.lockedAttributes.outerWindings.condBreadth,
        condHeight: twoWindings?.data?.lockedAttributes.outerWindings.condHeight,
      }
    };
    //console.log("initialLockState:", initialLockState);
    setLockedAttributes(initialLockState);
  }, []);

  useEffect(() => {
    setFormState(twoWindings.data);
  }, [twoWindings]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl (or Cmd on Mac) and Enter are pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        console.log("Ctrl + Enter pressed");
        e.preventDefault();
        if (!twoWindings?.isLoading) {
          handleCalculate();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [twoWindings?.isLoading, handleCalculate]);


  return (
    <Layout id={id} isThinHeader={true} headProps={{
      currentPath: twoWindings.data.designId,
    }}>
      <div className="row m-1">
        {/* <p>{JSON.stringify(lockedAttributes)}</p> */}
        {/* <p>{JSON.stringify(formState)}</p>
            <p>{JSON.stringify(twoWindings?.data)}</p> */}
        <div className="col-xl-4 mt-3">
          <Part1 formState={formState} handleInputChange={handleInputChange}
            handleToggleLock={handleToggleLock}
            lockedAttributes={lockedAttributes}
            handleHover={handleHover}
            handleMouseLeave={handleMouseLeave} />
        </div>
        <div className="col-xl-4 mt-3">
          <Part2 formState={formState} handleInputChange={handleInputChange}
            handleToggleLock={handleToggleLock}
            lockedAttributes={lockedAttributes}
            handleHover={handleHover}
            handleMouseLeave={handleMouseLeave} />
        </div>
        <div className="col-xl-4 mt-3">
          <Part3 formState={formState} handleInputChange={handleInputChange}
            handleHover={handleHover}
            handleMouseLeave={handleMouseLeave} />
          <FlexContainer margin="30px 0px" justify="">
            <button
              className="btn-outline-dark rounded btn-block w-100 py-2"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate"
              onClick={handleCalculate}
              disabled={twoWindings?.isLoading}
            >
              {twoWindings?.isLoading ? (
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              ) : (
                "Calculate"
              )}
            </button>
            {/* <OutlinedBtn
              text="Reset"
              bgColor="transparent"
              width="100%"
              padding="15px 70px"
              textDecoration="none"
            />
            <FilledBtn
              text="Calculate"
              bgColor="#1B1B1B"
              fontColor="white"
              width="100%"
              padding="15px 70px"
              borderRadius="10px"
              onClick={handleCalculate}
            /> */}
          </FlexContainer>
          <Container
            bgColor="white"
            padding="20px"
            borderRadius="5px"
            margin="20px 0px"
          >
            <TextTypo text="Comments" />
            <Container
              bgColor="#F7F7F7"
              padding="50px"
              borderRadius="4px"
              margin="20px 0px"
              fontSize="16px"
            >
              <span style={{ color: "#1400fa" }}>{commentText}</span>
              {/* {JSON.stringify(twoWindings?.data?.comments)} - #ff5b1e  - #1400fa */}
            </Container>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default TwoWinding;
