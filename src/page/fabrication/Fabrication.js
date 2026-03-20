import React, { useState, useEffect, useRef } from "react";
import { FilledBtn, Layout, Container, FlexContainer } from "../../components";
import Part1 from "./Part1";
import Part2 from "./Part2";
import Part3 from "./Part3";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  selectCore,
  selectCalc,
  selectFabrication,
  selectGenerate3D,
} from "../../selectors/CalcSelector";
import { selectEntity } from "../../selectors/EntitySelector";
import { useActions } from "../../app/use-Actions";
import {
  addCalc,
  generate3DRequest,
  load3DRequest,
  generate3DCleared,
} from "../../actions/CalcActions";
import { deleteEntity } from "../../actions/EntityActions";
import { fetchEntity, addEntity } from "../../actions/EntityActions";
import { splitJsonObject } from "../../utils/StringUtils";
import { useParams } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { Drawer, Button, Box, Stepper, Step, StepLabel, StepContent, Typography, IconButton } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';  // for red cross icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success Icon
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Clock Icon
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded"; // Failed (Red) Icon
import PendingIcon from '@mui/icons-material/Pending';
import { StepperContainer, StyledStepLabel, TimeText, } from "../../styles/components/StepperStyles";
import { Divider } from "@mui/material";
import { io } from 'socket.io-client';
import "./FabricationTheme.css";
//const socket = io('http://localhost:5000'); //https://tf-cad-server.trafointel.com
//const socket = io('https://tf-cad-server.trafointel.com');
const Fabrication = () => {
  const { id } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("appTheme") === "dark"
  );
  const { twoWindings } = useSelector(selectCalc);
  console.log("twoWindings:", twoWindings.data.designId);
  const { fabrication } = useSelector(selectFabrication);
  const { core } = useSelector(selectCore);
  const { generate3d } = useSelector(selectGenerate3D);
  console.log("generate3d in fab page:", generate3d);
  const { drawingsStatus } = useSelector(selectEntity);
  const { design } = useSelector(selectEntity);
  const [formState, setFormState] = useState({
    ...fabrication?.data,
    restOfVariables: {
      ...fabrication?.data?.restOfVariables,
      designId: twoWindings?.data?.designId,
      kVA: twoWindings.data?.kVA,
      transformer_Weight:
        twoWindings.data?.tankAndOilFormulas?.transformerWeight,
      limb_CC: twoWindings.data?.core?.cenDist,
      limb_Nos: core.data?.numberOfSteps,
      limb_H: twoWindings.data?.core?.limbHt,
    },
    tank: {
      ...fabrication?.data?.tank,
      tank_L: twoWindings.data?.tank?.tankLength,
      tank_W: twoWindings.data?.tank?.tankWidth,
      tank_H: twoWindings.data?.tank?.tankHeight,
      tank_Thick: twoWindings.data?.tank?.tankWallThickness,
      tank_Bot_Thick: twoWindings.data?.tank?.tankBottomThickness,
      tank_Flg_Thick: twoWindings.data?.tank?.frameThickness,
    },
    radiator: {
      ...fabrication?.data?.radiator,
      radiator_CC: twoWindings.data?.tankAndOilFormulas?.radiatorHeight,
      radiator_W: twoWindings.data?.tankAndOilFormulas?.radiatorWidth,
      radiator_Fin_Nos:
        twoWindings.data?.tankAndOilFormulas?.noOfFinsPerRadiator,
      radiator_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators,
      radiator_Left_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators / 2,
      radiator_Right_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators / 2,
    },
    lid: {
      ...fabrication?.data?.lid,
      lid_Thick: twoWindings.data?.tank?.tankLidThickness,
    },
    hvb: {
      ...fabrication?.data?.hvb,
      hvb_Volt: twoWindings.data?.highVoltage,
      hvb_Amp: twoWindings.data?.tankAndOilFormulas?.hvBushingCurrent,
    },
    lvb: {
      ...fabrication?.data?.lvb,
      lvb_Volt: twoWindings.data?.lowVoltage,
      lvb_Amp: twoWindings.data?.tankAndOilFormulas?.lvBushingCurrent,
    },
    cons: {
      ...fabrication?.data?.cons,
      cons_Vol: twoWindings.data?.tankAndOilFormulas?.conservatorCapacity,
      cons_Dia: twoWindings.data?.tankAndOilFormulas?.conservatorDia,
      cons_L: twoWindings.data?.tankAndOilFormulas?.conservatorLength,
    },
    fabricationCore: {
      ...fabrication?.data?.fabricationCore,
      core_Dia: twoWindings.data?.core?.coreDia
    },
    lv: {
      ...fabrication?.data?.lv,
      lv_ID: twoWindings.data?.coilDimensions?.lvid,
      lv_OD: twoWindings.data?.coilDimensions?.lvod,
      lv_Wdg_L: twoWindings.data?.innerWindings?.windingLength,
      lv_Volts: twoWindings.data?.innerWindings?.turnsPerPhase,
    },
    hv: {
      ...fabrication?.data?.hv,
      hv_ID: twoWindings.data?.coilDimensions?.hvid,
      hv_OD: twoWindings.data?.coilDimensions?.hvod,
      hv_Wdg_L: twoWindings.data?.outerWindings?.windingLength,
    },

  });
  console.log("formState in fab page:", formState);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (drawerOpen) {
      socketRef.current = io('https://tf-cad-server.trafointel.com');

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Flask Socket.IO Server');
      });

      socketRef.current.on('message', (data) => {
        console.log('Received message:', data);
        fetchData();
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from server');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [drawerOpen]);


  // useEffect(() => {
  // if (!generate3d?.isLoading && !isGenerate3DDisabled) {
  //   socketRef.current = io('https://tf-cad-server.trafointel.com');

  //   socketRef.current.on('connect', () => {
  //     console.log('✅ Connected to Flask Socket.IO Server');
  //   });

  //   socketRef.current.on('message', (data) => {
  //     console.log('Received message:', data);
  //     fetchData();
  //   });
  //   if (drawingsStatus?.data?.data[drawingsStatus?.data?.data?.length - 1]?.message?.includes("Process finished!")) {
  //     socketRef.current.on('disconnect', () => {
  //       console.log('❌ Disconnected from server');
  //     });
  //   }
  // }},[generate3d]);

  const [allow3DButton1, setAllow3DButton1] = useState(false);
  const [allow3DButton2, setAllow3DButton2] = useState(false);
  console.log("allow3DButton1:", allow3DButton1);
  console.log("allow3DButton2:", allow3DButton2);
  console.log("drawingsStatus?.data?.data?.length === 0:", drawingsStatus?.data?.data?.length === 0);

  const handleFabCalculate = () => {
    setAllow3DButton1(true);
    console.log(" fabrication calc clicked");
    console.log(formState)


    let entityId = "";
    if (twoWindings?.data?.designId) {
      entityId = design?.data?.data?.filter(
        (item) => item.designId == twoWindings?.data?.designId
      )[0]?.id;
    }
    //actions.addCalc(payload, "core", undefined, entityId);


    actions.addCalc(
      {
        designId: twoWindings.data?.designId,
        kVA: twoWindings.data?.kVA,
        transformer_Weight:
          twoWindings.data?.tankAndOilFormulas?.transformerWeight,
        limb_CC: twoWindings.data?.core?.cenDist,
        limb_Nos: 3,
        limb_H: twoWindings.data?.core?.limbHt,
        tank_L: twoWindings.data?.tank?.tankLength,
        tank_W: twoWindings.data?.tank?.tankWidth,
        tank_H: twoWindings.data?.tank?.tankHeight,
        tank_Thick: twoWindings.data?.tank?.tankWallThickness,
        tank_Bot_Thick: twoWindings.data?.tank?.tankBottomThickness,
        tank_Flg_Thick: twoWindings.data?.tank?.frameThickness,
        radiator_CC: twoWindings.data?.tankAndOilFormulas?.radiatorHeight,
        radiator_W: twoWindings.data?.tankAndOilFormulas?.radiatorWidth,
        radiator_Fin_Nos:
          twoWindings.data?.tankAndOilFormulas?.noOfFinsPerRadiator,
        radiator_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators,
        radiator_Left_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators / 2,
        radiator_Right_Nos: twoWindings.data?.tankAndOilFormulas?.noOfRadiators / 2,
        lid_Thick: twoWindings.data?.tank?.tankLidThickness,
        hvb_Volt: formState.hvb.hvb_Volt,
        hvb_Amp: formState.hvb.hvb_Amp,
        lvb_Volt: formState.lvb.lvb_Volt,
        lvb_Amp: formState.lvb.lvb_Amp,
        cons_Vol: twoWindings.data?.tankAndOilFormulas?.conservatorCapacity,
        cons_Dia: twoWindings.data?.tankAndOilFormulas?.conservatorDia,
        cons_L: twoWindings.data?.tankAndOilFormulas?.conservatorLength,
        core_Dia: twoWindings.data?.core?.coreDia,
        lv_ID: twoWindings.data?.coilDimensions?.lvid,
        lv_OD: twoWindings.data?.coilDimensions?.lvod,
        lv_Wdg_L: twoWindings.data?.innerWindings?.windingLength,
        lv_Volts: twoWindings.data?.innerWindings?.turnsPerPhase,
        hv_ID: twoWindings.data?.coilDimensions?.hvid,
        hv_OD: twoWindings.data?.coilDimensions?.hvod,
        hv_Wdg_L: twoWindings.data?.outerWindings?.windingLength,
        hvb_Pos: formState.hvb.hvb_Pos,
        lvb_Pos: formState.lvb.lvb_Pos,
        hvcb: formState?.hvcb?.hvcb,
        lvcb: formState?.lvcb?.lvcb,
        drain_Vlv: formState.drain_Vlv.drain_Vlv,
        drain_Vlv_Nos: formState.drain_Vlv.drain_Vlv_Nos,
        smpl_Vlv: formState.smpl_Vlv.smpl_Vlv,
        smpl_Vlv_Nos: formState.smpl_Vlv.smpl_Vlv_Nos,
        fill_Vlv: formState.fill_Vlv.fill_Vlv,
        roller: formState.roller.roller,
        roller_Type: formState.roller.roller_Type,
        mog: formState.mog.mog,
        // buch_Rely: formState.buch_Rely.buch_Rely,
        // buch_Rely_Vlv: formState.buch_Rely.buch_Rely_Vlv,
        // buch_Rely_Vlv_Nos: formState.buch_Rely.buch_Rely_Vlv_Nos,
        buchholz_Relay: formState.gorPipe.buchholz_Relay,
        single_Valve: formState.gorPipe.single_Valve,
        valve_Type1: formState.gorPipe.valve_Type1,
        mog_Tlt_Ang: formState.mog.mog_Tlt_Ang,
        prv: formState.pressureRelief,
        exp_Vent: formState.exp_Vent.exp_Vent,
        exp_Vent_ID: formState.exp_Vent.exp_Vent_ID,
        radiator_Vlv: formState.radiator.radiator_Vlv,
        lid_LiftLug: formState.lid_LiftLug.lid_LiftLug,
        lid_LiftLug_Thick: formState.lid_LiftLug.lid_LiftLug_Thick,
        mbox: formState.mbox,
        mbox_Inst_Nos: formState.marshlingBox,
        thrmo_Syphn: formState.thermoSiphon,
        roller_Guage: formState.roller.roller_Guage,
        thermoPkt1: formState.thermoPkt.thermoPkt1,
        thermoPkt2: formState.thermoPkt.thermoPkt2,
        exp_Vent_With_OI: formState.exp_Vent.exp_Vent_With_OI,
        // foundation_Type: formState.roller.foundation_Type,
        //isRoller: formState.bot_Chnl.isRoller,
        //bot_Chnl_Sec_Data: formState.bot_Chnl.bot_Chnl_Sec_Data,
        isRoller: formState.bot_Chnl.isRoller,
        eVectorGroup: twoWindings.data.vectorGroup,
        printouts: {
          kva: twoWindings?.data?.kVA,
          voltsAtHv: twoWindings?.data?.highVoltage,
          voltsAtLv: twoWindings?.data?.lowVoltage,
          amperesHv: twoWindings?.data?.hvFormulas?.hvCurrentPerPhase,
          amperesLv: twoWindings?.data?.lvFormulas?.lvCurrentPerPhase,
          phasesHv: twoWindings?.data?.vectorGroup?.charAt(0) == "D" ? "Delta" : "Star",
          phasesLv: twoWindings?.data?.vectorGroup?.charAt(1) == "d" ? "Delta" : "Star",
          frequency: twoWindings?.data?.frequency,
          impedance: twoWindings?.data?.commonFormulas?.ek,
          vectorGroup: twoWindings?.data?.vectorGroup,
          topOilTemp: twoWindings?.data?.topOilTemp,
          windingTemp: twoWindings?.data?.windingTemp,
          coolingType: "ONAN",
          weightsOfActivePart: twoWindings?.data?.tankAndOilFormulas?.weightsOfActivePart,
          oilWeight: twoWindings?.data?.tankAndOilFormulas?.oilWeight,
          totalOil: twoWindings?.data?.tankAndOilFormulas?.totalOil,
          basicInsulationLevelHV: `${twoWindings?.data?.hvImpulseVoltage === 0 ? "-" : twoWindings?.data?.hvImpulseVoltage}${twoWindings?.data?.hvImpulseVoltage === 0 ? "" : "KVp"} / ${twoWindings?.data?.hvTestVoltage === 0 ? "-" : twoWindings?.data?.hvTestVoltage}${twoWindings?.data?.hvTestVoltage === 0 ? "" : "KV"}`,
          basicInsulationLevelLV: `${twoWindings?.data?.lvImpulseVoltage === 0 ? "-" : twoWindings?.data?.lvImpulseVoltage}${twoWindings?.data?.lvImpulseVoltage === 0 ? "" : "KVp"} / ${twoWindings?.data?.lvTestVoltage === 0 ? "-" : twoWindings?.data?.lvTestVoltage}${twoWindings?.data?.lvTestVoltage === 0 ? "" : "KV"}`,
          ampsHV: Math.round((twoWindings?.data?.hvFormulas.hvCurrentPerPhase ?? 0) * Math.sqrt(3) * 100) / 100,
          ampsLV: twoWindings?.data?.lvFormulas.lvCurrentPerPhase,
          tappingHVVariations: `+${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsPositive
            }% to -${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsNegative
            }% @${twoWindings.data.tapStepsPercent}%`,
          lossesAt50: twoWindings?.data?.lossesAt50Percent,
          lossesAt100: twoWindings?.data?.lossesAt100Percent,
          weightOfTankAndAcc: twoWindings?.data?.tankAndOilFormulas?.weightOfTankAndAcc,
        },
        turnsPerTap: twoWindings?.data?.hvFormulas?.turnsPerTap,
        tapVoltages: twoWindings?.data?.hvFormulas?.tapVoltages,
        tapCurrent: twoWindings?.data?.hvFormulas?.tapCurrent,
        tapStepPercentage: twoWindings?.data?.tapStepsPercent,
        isOCTC: twoWindings?.data?.tapStepsPercent > 0 ? true : false,
        


        // ctCurrentTransformer:formState.ctCurrentTransformer,
      },
      "fabrication",
      undefined, entityId
    );
  };

    useEffect(() => {
      const handleKeyDown = (e) => {
        // Check if Ctrl (or Cmd on Mac) and Enter are pressed
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          console.log("Ctrl + Enter pressed");
          e.preventDefault();
          if (!fabrication?.isLoading) {
            handleFabCalculate();
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      // Clean up the event listener on unmount
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [fabrication?.isLoading, handleFabCalculate]);

  const actions = useActions({
    addCalc,
    fetchEntity,
    addEntity,
    deleteEntity,
    generate3DRequest,
    generate3DCleared,
    load3DRequest,
  });

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

  useEffect(() => {
    //console.log("fab:", fabrication);
    //console.log("fabrication?.tank?.tank_L:", fabrication?.data?.tank?.tank_L);
    if (
      fabrication?.data?.tank?.tank_L == ""
    ) {
      console.log("fab useEffect inside if")
      handleFabCalculate();
    }
    fetchData();
    if (!generate3d?.data?.blob) {
      fetch3DDiagram();
    }

    return () => { };
  }, []);

  const fetch3DDiagram = () => {
    let designId = twoWindings.data?.designId;
    //  designId = "500k-72270";
    console.log("fetch3DDiagram is called");
    actions.load3DRequest(designId, "generate3d");
  };

  const fetchData = () => {
    let filterPayload = { designId: [twoWindings.data?.designId] };
    actions.fetchEntity("drawingsStatus", "offset=0&size=30", filterPayload);
  };

  useEffect(() => {
    console.log("useEffect fabrication triggered");
    /* The above code appears to be a comment block in JavaScript. It is not performing any specific
    action in the code, but is used to provide information or context about the code for developers
    who may be reading it. */
    if (fabrication?.data?.restOfVariables?.designId) {
      setFormState(fabrication?.data);
    }
  }, [fabrication]);

  const handleInputChange = (fieldPath, value) => {
    setAllow3DButton2(true);
    if (fieldPath === "gorPipe.buchholz_Relay") {
      setFormState((prevState) => ({
        ...prevState,
        gorPipe: {
          ...prevState.gorPipe,
          buchholz_Relay: value,
          single_Valve: true,
          valve_Type1: true,
        },
      }));
    }

    if (fieldPath === "hvcb.hvcb") {
      setFormState((prevState) => ({
        ...prevState,
        hvcb:{
          ...prevState.hvcb,
          hvcb:  value,
        },
        hvb:{
          ...prevState.hvb,
          hvb_Pos: (value === true || value === "true") ? "tank" : "lid",
        }
      }))
    }

    if (fieldPath === "lvcb.lvcb") {
      console.log("lvcb.lvcb", value)
      setFormState((prevState) => ({
        ...prevState,
        lvcb:{
          ...prevState.lvcb,
          lvcb: value,
        },
        lvb:{
          ...prevState.lvb,
          lvb_Pos: (value === true || value === "true") ? "tank" : "lid",
        }
      }))
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
  };

  // const handleCalculate = () => {
  //   console.log(formState);
  // };

  const handleGenerate3D = () => {
    setAllow3DButton1(false);
    setAllow3DButton2(false);
    let payload = {};
    Object.entries(formState).forEach(([key, value]) => {
      payload = {
        ...payload,
        ...value,
      };
    });
    let params = {};
    params.fileName = formState?.restOfVariables?.designId;
    params.skipBatRun = "no";

    const matchingIds = drawingsStatus?.data?.data
      ?.filter(item => item.designId === twoWindings?.data?.designId)
      ?.map(item => item.id);

    if (matchingIds?.length > 0) {
      matchingIds.forEach(id => {
        actions.deleteEntity(id, "drawingsStatus", true);
      });
    }

    actions.generate3DRequest(payload, params, "generate3d");
    handleClickSnackBar();
    //handleCalculate();
  };


  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClickSnackBar = () => {
    //console.log(snackBarOpen)
    setSnackBarOpen(true);
  };

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  // const steps = [
  //   { time: "13:36:37", label: "Docker engine: initialize context", status: "Success" },
  //   { time: "13:36:37", label: "Provenance proxy: docker session initialized", status: "Success" },
  //   { time: "13:36:37", label: "Docker engine: preparing registries config", status: "Success" },
  //   { time: "13:36:37", label: "Executing remote combo builder...", status: "Success" },
  //   { time: "13:36:38", label: "Building image...", status: "Success" },
  //   { time: "13:36:38", label: "Step 1/11 : ARG baseOllamaVersion=0.17", status: "Success" },
  //   { time: "13:36:38", label: "Step 2/11 : FROM ollama/ollama:${baseOllamaVersion}", status: "Failed" },
  //   { time: "13:36:38", label: "Step 3/11 : EXPOSE 11434", status: "Success" },
  //   { time: "13:36:38", label: "Step 4/11 : COPY Ollama.cer /etc/ssl/certs/", status: "Processing" },
  // ];




  // const [activeStep, setActiveStep] = useState(0);
  // const currentDate = new Date().toISOString().slice(0, 10); // Get today's date (YYYY-MM-DD)
  // const currentTime = new Date().toLocaleTimeString(); // Get current time

  // const handleNext = () => {
  //   setActiveStep((prevStep) => prevStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevStep) => prevStep - 1);
  // };

  const handleCalculate = () => {
    setDrawerOpen(true);
  };

  const formatDuration = (start, end) => {
    const diffInSeconds = (new Date(end) - new Date(start)) / 1000;
    if (diffInSeconds < 60) {
      return `${diffInSeconds.toFixed(2)} sec`;
    } else {
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = Math.round(diffInSeconds % 60);
      return `${minutes} min ${seconds} sec`;
    }
  };

  const stepsData = drawingsStatus?.data?.data || [];
  const totalDuration =
    stepsData.length > 1
      ? formatDuration(stepsData[0].createdAt, stepsData[stepsData.length - 1].createdAt)
      : "0.00";

  // const isGenerate3DDisabled =
  //   generate3d?.isLoading ||
  //   (drawingsStatus &&
  //     drawingsStatus?.data &&
  //     drawingsStatus?.data?.data?.filter(
  //       (i) => i.designId == formState?.restOfVariables?.designId
  //     ).length > 0);

  const isGenerate3DDisabled = drawingsStatus?.data?.data?.[0]?.designId;

  console.log("isGenerate3DDisabled:", isGenerate3DDisabled);

  const [hasFetched3D, setHasFetched3D] = useState(false);
  console.log("hasFetched3D:", hasFetched3D);

  const lastMessage = stepsData[stepsData.length - 1]?.message?.includes("Process finished!");
  useEffect(() => {
    //setHasFetched3D((prev) => canGenerate3D ? false : prev);
    if (hasFetched3D === false) {
      console.log("hasFetched3D is", hasFetched3D);
      if (lastMessage) {
        console.log("Last message");
        fetch3DDiagram();
        setHasFetched3D(true);
      }
    }
  }, [stepsData, hasFetched3D]);

  console.log("generate3D.data in fab page:", generate3d?.data);
  console.log("drawingsStatus?.data?.data", drawingsStatus?.data?.data);
  console.log("allow3Dbtn1", allow3DButton1, "allow3Dbtn2", allow3DButton2);
  console.log("drawings empty", drawingsStatus?.data?.data?.length === 0);
  console.log("generate3d blob", generate3d?.data?.blob?.includes("blob"));

  // (!(allow3DButton1 && allow3DButton2) || drawingsStatus?.data?.data?.length === 0 )
  //  && (generate3d?.data?.blob?.includes("blob")  || (allow3DButton1 && allow3DButton2))

  const isMoreThan45Minutes = drawingsStatus?.data?.data?.[0]?.createdAt
    ? (new Date().getTime() - new Date(drawingsStatus?.data?.data?.[0]?.createdAt).getTime()) > (45 * 60 * 1000)
    : false;

  console.log("isMoreThan45Minutes:", isMoreThan45Minutes);
  console.log("drawingsStatus?.data?.data?.[0]?.createdAt:", new Date(drawingsStatus?.data?.data));

  useEffect(() => {
    if (isMoreThan45Minutes) {
      setAllow3DButton1(false);
      setAllow3DButton2(false);
    }
  }, [isMoreThan45Minutes]);

  const canGenerate3D =
    (
      (allow3DButton1 && allow3DButton2) ||
      drawingsStatus?.data?.data?.length === 0 ||
      isMoreThan45Minutes
    ) &&
    (
      (generate3d?.data?.blob?.includes("blob") || generate3d?.data?.blob?.includes("")) ||
      (allow3DButton1 && allow3DButton2) ||
      isMoreThan45Minutes
    );

  console.log("canGenerate3D:", canGenerate3D);
  console.log("drawingsStatus?.data?.data?.[0]?.createdAt:", new Date(drawingsStatus?.data?.data?.[0]?.createdAt).getTime());


  return (
    <Layout
      id={id}
      isThinHeader={true}
      headProps={{
        currentPath: twoWindings.data?.designId,
      }}
    >
      <div className={`fabrication-page ${isDarkMode ? "fabrication-page-dark" : ""}`}>
      <div className="fabrication-page-shell">
      <div className="row m-1 align-items-start">
        <div className="col-xl-4 mt-3">
          <Part1
            formState={formState}
            handleInputChange={handleInputChange}
            twoWindings={twoWindings}
          />
        </div>
        <div className="col-xl-4 mt-3">
          <Part2
            formState={formState}
            handleInputChange={handleInputChange}
            twoWindings={twoWindings}
          />
        </div>
        <div className="col-xl-4 mt-3">
          <Part3
            formState={formState}
            handleInputChange={handleInputChange}
            twoWindings={twoWindings}
          />
          <FlexContainer margin="30px 0px" justify="">
            <button
              className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate"
              onClick={handleFabCalculate}
            >
              Calculate
            </button>
            {/* Drawer */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 550,
                  bgcolor: isDarkMode ? "#172233" : "#ffffff",
                  color: isDarkMode ? "#edf4ff" : "#111111",
                },
              }}
            >
              <Box sx={{ pt: 2, pr: 2, pb: 2, pl: 2 }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" >
                  <Typography variant="h6" gutterBottom sx={{ mt: 1, color: "inherit" }}>
                    Fabrication 3D Generation Status
                  </Typography>
                  <IconButton onClick={() => setDrawerOpen(false)} sx={{ mt: 1 }}>
                    <CloseIcon sx={{ color: "inherit" }} />
                  </IconButton>
                </Box>

                <Divider sx={{ width: "100%", my: 1, borderBottomWidth: 2, borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : undefined }} />

                {/* Duration and Status Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" >
                  <Typography variant="subtitle1" sx={{ color: "inherit" }}>
                    <AccessTimeIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                    Duration: <strong>{totalDuration}</strong>
                  </Typography>

                  <Typography variant="subtitle1" color={stepsData[stepsData.length - 1]?.message.includes("Process finished!") ? "green" : "orange"}>
                    {stepsData[stepsData.length - 1]?.message?.includes("Process finished!") ? (
                      <CheckCircleIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                    ) : (
                      <PendingIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                    )}
                    Status:{" "}
                    <strong>
                      {stepsData[stepsData.length - 1]?.message?.includes("Process finished!")
                        ? "Success"
                        : "Processing..."}
                    </strong>
                  </Typography>
                </Box>

                <Divider sx={{ width: "100%", my: 1, borderBottomWidth: 2, borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : undefined }} />

                <Box sx={{ pt: 2, pl: 6, ml: 3 }}>
                  {/* Stepper with Time and Text Content */}
                  <Stepper activeStep={stepsData.length} orientation="vertical">
                    {drawingsStatus?.data?.data?.map((step, index) =>
                      step?.message && (
                        <Step key={index}>
                          <Box display="flex" alignItems="center">
                            {/* Timestamp before the step label */}
                            <TimeText variant="body2" sx={{ marginLeft: "-88px", marginRight: "10px" }}>
                              {new Date(step.createdAt).toLocaleTimeString('en-GB', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </TimeText>

                            <StyledStepLabel
                              StepIconComponent={() =>
                                step.status === "Success" ? (
                                  <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
                                ) : step.status === "GENERATE_3D_REQUESTED" ? (
                                  <CheckCircleIcon fontSize="small" sx={{ color: "orange" }} />
                                ) : step.status === "Failed" ? (
                                  <ErrorRoundedIcon fontSize="small" sx={{ color: "red" }} />
                                ) : (
                                  <RadioButtonUncheckedIcon fontSize="small" />
                                )
                              }
                            >
                              {step.message}
                            </StyledStepLabel>
                          </Box>
                          <StepContent />
                        </Step>
                      )
                    )}
                  </Stepper>

                </Box>
              </Box>
            </Drawer>

            {generate3d?.isLoading ? (
              <button className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate">
                <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
              </button>
            ) : (
              (generate3d?.data?.blob?.includes("generate3d") ||
                (isGenerate3DDisabled && !isMoreThan45Minutes) ||
                generate3d?.data == "") && !lastMessage ? (
                <button
                  className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate"
                  onClick={handleCalculate}
                >
                  Show Status
                </button>
              ) : (
                // <button
                //   className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate"
                //   onClick={handleGenerate3D}
                //   disabled={!(allow3DButton1 && allow3DButton2)}
                // >
                <button
                  className="btn btn-dark rounded btn-block w-100 py-2 btn-calculate"
                  onClick={canGenerate3D ? handleGenerate3D : undefined}
                  style={
                    canGenerate3D
                      ? { cursor: "pointer" }
                      : { cursor: "not-allowed" }
                  }
                >
                  Generate 3D
                </button>
              )
            )}


            {/* <button onClick={handleClickSnackBar}>{`sb ${snackBarOpen} s`} </button> */}
          </FlexContainer>
          {/* <p>A : {JSON.stringify(drawingsStatus?.data?.data)}</p>
          <p>A : {JSON.stringify(drawingsStatus)}</p> */}
          {/* <Container margin="10px 0px">
            <FilledBtn
              text="Calculate"
              bgColor="#1B1B1B"
              fontColor="white"
              width="100%"
              padding="15px 0px"
              borderRadius="25px"
              onClick={handleCalculate}
            />
            <FilledBtn
              text="Generate 3D"
              bgColor="#1B1B1B"
              fontColor="white"
              width="100%"
              padding="15px 0px"
              borderRadius="25px"
              onClick={handleCalculate}
            />
            <FilledBtn
              text="Reset"
              bgColor="transparent"
              width="100%"
              padding="15px 0px"
              textDecoration="none"
            />
          </Container> */}
        </div>
      </div>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message="CAD drawings generation inprogress, Check after 5 minutes"
      // action={action}
      />
      </div>
      </div>
      {/* <Alert
          // onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          CAD drawings generation inprogress, Check after 5 minutes
        </Alert>
      </Snackbar> */}
    </Layout >
  );
};

export default Fabrication;
