import React, { useEffect, useState } from "react";
import {
  Layout,
  FlexContainer,
  TextTypo,
  Container,
  BorderStyled,
  OutlinedBtn,
  FilledBtn,
  IconBtn,
} from "../../components";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaCheckSquare } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { selectCalc, selectCore, selectFile, selectFabrication } from "../../selectors/CalcSelector";
import { useSelector } from "react-redux";

import { Description } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button, TextField } from "@mui/material";

import {

  CustomInput,
} from "../../components";

import tableData from "../files/Tabledata.json"; // Import JSON file
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./../../assets/files/logo.png"
import saraConsultants from "./../../assets/files/saraConsultants.png"
import { data, get } from "jquery";
import { registerDejaVuSansFont } from '../../assets/fonts/DejaVuSans-normal';
import core1 from "../../assets/core1.png";
import core2 from "../../assets/core2.png";
import core3 from "../../assets/core3.png";
import core4_1 from "../../assets/core4.1.png";
import core4_2 from "../../assets/core4.2.png";
import core4_3 from "../../assets/core4.3.png";
import core4_4 from "../../assets/core4.4.png";
import assembly1 from "../../assets/Assembly1.png";
import assembly2 from "../../assets/Assembly2.png";
import { useActions } from "../../app/use-Actions";
import { fetchFile, addDataToLom, deleteDataFromLom, addCustomer } from "../../actions/FileActions";
import { selectEntity } from "../../selectors/EntitySelector";
import { fetchEntity, addEntity } from "../../actions/EntityActions";

const Files = () => {
  const { id } = useParams();
  const { twoWindings } = useSelector(selectCalc);
  const { fabrication } = useSelector(selectFabrication);
  const { core } = useSelector(selectCore);
  const { design, lomMaterial } = useSelector(selectEntity);
  const { lom } = useSelector(selectFile);
  const { customer } = useSelector(selectFile);
  console.log("lomMaterial", lomMaterial);
  //console.log("design in file:", design);
  const actions = useActions({
    fetchFile,
    addDataToLom,
    deleteDataFromLom,
    addEntity,
    addCustomer,
  });

  const [coreData, setCoreData] = useState(core?.data);

  const [openAccordions, setOpenAccordions] = useState({
    generals: false,
    specifications: false,
    documents: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const accordions = [
    // { key: "generals", title: "Generals", content: "General details go here" },
    // {
    //   key: "coreWindings",
    //   title: "Core Windings",
    //   content: "Specification details go here",
    // },
    // {
    //   key: "tankParameter",
    //   title: "Tank Parameter",
    //   content: "Document details go here",
    // },
    {
      key: "LOM",
      title: "LOM",
      content: "table",
    },
    {
      key: "CCC",
      title: "CCC",
      content: " comprehensive cost calculations",
    },
  ];


  //Cell-style
  const styleCell = {
    fontSize: "16px",
    fontWeight: "600",
    padding: "10px",
    fontFamily: "'Segoe UI', sans-serif !important",
    border: "1px solid #ddd",
    fontWeight: "bold !important"
  };
  //Row-Style
  const styleRow = {
    fontSize: "14px",
    fontWeight: "400",
    padding: "8px",
    fontFamily: "'Segoe UI', sans-serif !important",
    border: "1px solid #ddd"
  };

  //Add-item style
  const styleAddItem = {
    backgroundColor: "rgb(27, 27, 27)",
    fontFamily: "'Segoe UI',sans-serif",
    fontSize: "15px",
    margin: "5px",
    textTransform: "none"
  };

  //State variable for show input field
  const [showInputRow, setShowInputRow] = useState(false);

  //for storing new data
  const [newItem, setNewItem] = useState({
    index: "",
    description: "",
    specification: "",
    unit: "",
    quantity: "",
    rate: "",
    cost: "",
  });

  //TextField onchange handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    //console.log(name, value)
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // const handleInputChange = (fieldPath, value) => {
  //   setNewItem((prevState) => {
  //     // Split the field path to handle nested keys
  //     const keys = fieldPath.split(".");

  //     // Traverse through the keys to build the new state
  //     let newState = { ...prevState };
  //     let current = newState;

  //     keys.forEach((key, index) => {
  //       // If we are at the last key, set the value
  //       if (index === keys.length - 1) {
  //         current[key] = value;
  //       } else {
  //         // Otherwise, move deeper in the structure
  //         current[key] = { ...current[key] };
  //         current = current[key];
  //       }
  //     });
  //     return newState;
  //   });
  // };

  const handleNewAddItem = () => { // Add new item handler
    if (!showInputRow) {
      setShowInputRow(true);
    }
  }

  //Payload for LOM
  const materialData = lomMaterial?.data?.data || [];
  const [lomPayload, setlomPayload] = useState({
    isTrue: true,
    lomBooleans: {
      hvCableBox: fabrication.data.hvcb.hvcb == false ? false : true,
      lvCableBox: fabrication.data.lvcb.lvcb == false ? false : true,
      hvBushing: fabrication.data.hvcb.hvcb == false ? true : false,
      lvBushing: fabrication.data.lvcb.lvcb == false ? true : false,
      permaWood: true,
      drainValve: fabrication.data.drain_Vlv.drain_Vlv,
      filterValve: fabrication.data.fill_Vlv.fill_Vlv,
      samplingValve: fabrication.data.smpl_Vlv.smpl_Vlv,
      relayShutOffValve: true, // false in payload //{no changes for now}
      thermometerPocket: true,
      airReleasePlug: true, // Air Release Plug - false - doesn't need this - {left as blank}
      oltc: twoWindings.data.isOLTC,
      octc: twoWindings.data.isOLTC === true ? false : true,
      oti: true, // false in payload -  {left as blank}
      wti: true, // false in payload -  {left as blank}
      buchholzRelay: true, // {no changes required for now}
      marshallingBox: true, // {no changes required for now}
      oilLevelGauge: twoWindings.data.isCSP === false ? true : false,
      //mog: fabrication.data.mog.mog,
      mog: false,
      //pressureReliefValve: fabrication.data.restOfVariables.prv, // {no changes required for now}
      pressureReliefValve: false, // {no changes required for now}

      oilCirculatingPump: true, // {no changes required for now}
      avrrtcc: true, // {no changes required for now}
      rollers: fabrication.data.roller.roller,
      pumpControlCubicle: true, // {no changes required for now}
      biMetallicConn: true, // {no changes required for now}
      fasteners: true, // {no changes required for now}
    },
    lomQuantity: {
      lamination: twoWindings.data.core.coreWeight,
      hvConductor: twoWindings.data.hvFormulas.hvProcurementWeight,
      lvConductor: twoWindings.data.lvFormulas.lvProcurementWeight,
      hvConnectionLeads: twoWindings.data.tankAndOilFormulas.hvConnectionWeight,
      lvConnectionLeads: twoWindings.data.tankAndOilFormulas.lvConnectionWeight,
      insulationMaterial: twoWindings.data.tankAndOilFormulas.insulationWeight,
      transformerOil: twoWindings.data.tankAndOilFormulas.totalOil,
      tankLidEtc: twoWindings.data.tankAndOilFormulas.weightOfTankAndAcc,
      hvCableBox: 1,
      lvCableBox: 1,
      hvBushing: twoWindings.data.vectorGroup.charAt(0) == "D" ? 3 : 4,
      lvBushing: twoWindings.data.vectorGroup.charAt(1) == "d" ? 3 : 4,
      radiatorsAndHeatExc: twoWindings.data.tankAndOilFormulas.totalRadiatorWeight,
      permaWood: 0.0,
      drainValve: fabrication.data.drain_Vlv.drain_Vlv_Nos,
      filterValve: fabrication.data.fill_Vlv.fill_Vlv_Nos,
      samplingValve: fabrication.data.smpl_Vlv.smpl_Vlv_Nos,
      relayShutOffValve: 0.0, //skipped for now
      breatherSilicaGel: 1, //have doubt [Breather Si Gel	- "cons_Breath": true ? 1 : doesn't need this ]
      ratingPlate: 1,
      thermometerPocket: 1, //hardcoded for now
      airReleasePlug: 0.0, //skipped for now
      coreBoltsAndTieRods: twoWindings.data.tankAndOilFormulas.channelWeight,
      oltc: 1,
      octc: 1,
      oti: 0.0, //skipped for now
      wti: 0.0, //skipped for now
      buchholzRelay: 0.0, //skipped for now
      marshallingBox: 0.0, //skipped for now
      oilLevelGauge: fabrication.data.cons.cons_Olg_Nos,
      mog: 1,
      pressureReliefValve: 0.0, //skipped for now
      oilCirculatingPump: 0.0, //skipped for now
      avrrtcc: 0.0, //skipped for now
      rollers: 4,
      pumpControlCubicle: 0.0, //skipped for now
      biMetallicConnector: 0.0, //skipped for now
      fasteners: 0.0, //skipped for now
      otherMaterials: 0.0, //skipped for now
    },
    lomRate: {
      lamination: materialData[0]?.materialRate || 0.0,
      hvConductor: materialData[1]?.materialRate || 0.0,
      lvConductor: materialData[2]?.materialRate || 0.0,
      hvConnectionLeads: materialData[3]?.materialRate || 0.0,
      lvConnectionLeads: materialData[4]?.materialRate || 0.0,
      insulationMaterial: materialData[5]?.materialRate || 0.0,
      transformerOil: materialData[6]?.materialRate || 0.0,
      tankLidEtc: materialData[7]?.materialRate || 0.0,
      ...(fabrication.data.hvcb.hvcb && { hvCableBox: materialData[8]?.materialRate || 0.0 }),
      ...(fabrication.data.lvcb.lvcb && { lvCableBox: materialData[9]?.materialRate || 0.0 }),
      ...(fabrication.data.hvcb.hvcb == false && { hvBushing: materialData[10]?.materialRate || 0.0 }),
      ...(fabrication.data.lvcb.lvcb == false && { lvBushing: materialData[11]?.materialRate || 0.0 }),
      radiatorsAndHeatExc: materialData[12]?.materialRate || 0.0,
      permaWood: materialData[13]?.materialRate || 0.0,
      ...(fabrication.data.drain_Vlv.drain_Vlv && { drainValve: materialData[14]?.materialRate || 0.0 }),
      ...(fabrication.data.fill_Vlv.fill_Vlv && { filterValve: materialData[15]?.materialRate || 0.0 }),
      ...(fabrication.data.smpl_Vlv.smpl_Vlv && { samplingValve: materialData[16]?.materialRate || 0.0 }),
      relayShutOffValve: materialData[17]?.materialRate || 0.0,
      breatherSilicaGel: materialData[18]?.materialRate || 0.0,
      ratingPlate: materialData[19]?.materialRate || 0.0,
      thermometerPocket: materialData[20]?.materialRate || 0.0,
      airReleasePlug: materialData[21]?.materialRate || 0.0,
      coreBoltsAndTieRods: materialData[22]?.materialRate || 0.0,
      ...(twoWindings.data.isOLTC && { oltc: materialData[23]?.materialRate || 0.0 }),
      ...(!twoWindings.data.isOLTC && { octc: materialData[24]?.materialRate || 0.0 }),
      oti: materialData[25]?.materialRate || 0.0,
      wti: materialData[26]?.materialRate || 0.0,
      buchholzRelay: materialData[27]?.materialRate || 0.0,
      marshallingBox: materialData[28]?.materialRate || 0.0,
      ...(twoWindings.data.isCSP === false && { oilLevelGauge: materialData[29]?.materialRate || 0.0 }),
      ...(fabrication.data.mog.mog && { mog: materialData[30]?.materialRate || 0.0 }),
      ...(fabrication.data.restOfVariables.prv && { pressureReliefValve: materialData[31]?.materialRate || 0.0 }),
      oilCirculatingPump: materialData[32]?.materialRate || 0.0,
      avrrtcc: materialData[33]?.materialRate || 0.0,
      ...(fabrication.data.roller.roller && { rollers: materialData[34]?.materialRate || 0.0 }),
      pumpControlCubicle: materialData[35]?.materialRate || 0.0,
      biMetallicConnector: materialData[36]?.materialRate || 0.0,
      fasteners: materialData[37]?.materialRate || 0.0,
      otherMaterials: materialData[38]?.materialRate || 0.0,
    }
  });

  useEffect(() => {
    // if (
    //   lom?.data[0].size==0
    // ) {
    actions.fetchFile(lomPayload);
    //}
  }, [fabrication, twoWindings]);


  console.log("customer:", customer);
  const [tableRows, setTableRows] = useState(lom.data);

  //Green checkBox handler
  const handleAddItem = () => {
    if (!newItem.description || !newItem.specification ||
      !newItem.unit ||
      !newItem.quantity || !newItem.rate) {
      alert("Please fill all fields before adding!")
    }

    else {
      const newRow = {
        ...newItem,
        index: tableRows.length,
        quantity: Number(newItem.quantity),
        rate: Number(newItem.rate),
        cost: Number(newItem.quantity) * Number(newItem.rate),
        isNew: true,
      };
      setTableRows([...tableRows, newRow]);
      actions.addDataToLom(newRow);
      setNewItem({ description: "", specification: "", unit: "", quantity: "", rate: "", cost: "" });
      setShowInputRow(false)
    }
  }
  console.log("LOM Data:", lom.data);
  //console.log("newly added userData in LOM table:", tableRows);

  //Delete button handler
  const handleDeleteItem = (indexToDelete) => {
    console.log("deleting row :", indexToDelete);
    console.log("before delete tableRows", tableRows);
    setTableRows((prevRows) => prevRows.filter((_, index) => index !== indexToDelete));
    actions.deleteDataFromLom(indexToDelete);
  };
  //console.log("after delete tableRows", tableRows);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editableRate, setEditableRate] = useState("");

  const startEditing = (index, rate) => {
    setEditingIndex(index);
    setEditableRate(rate);
  };

  //Rate Edit handler
  const handleRateUpdate = (index) => {
    const updatedRows = [...tableRows]; // actual data from API
    console.log("updatedRows:", updatedRows)
    const updatedRate = parseFloat(editableRate);
    updatedRows[index].rate = updatedRate;

    // const descriptionKey = updatedRows[index].description.toLowerCase();
    // console.log("des:", descriptionKey);

    const isNewRow = updatedRows[index].isNew;

    if (!isNewRow) {
      const Key = Object.keys(lomPayload.lomRate)[index];
      setlomPayload(prevlomPayload => {
        //Spreading prev lomRate and changing specific rate with descriptionKey eg,[lamination]:500
        const updatedLomRate = {
          ...prevlomPayload.lomRate,
          [Key]: updatedRate
        };
        console.log("updatedLomRate", updatedLomRate);

        //Spreading the entire prev lomPayload [payload] and changing the prev lomRate with new lomRate; 
        const updatedlomPayload = {
          ...prevlomPayload,
          lomRate: updatedLomRate
        };
        console.log("updatedlomPayload", updatedlomPayload);

        actions.fetchFile(updatedlomPayload);
        return updatedlomPayload;
      });
    }
    else {
      updatedRows[index].cost = updatedRows[index].quantity * updatedRate;
    }
    setEditingIndex(null);
  };

  useEffect(() => {
    setTableRows(lom.data);
  }, [lom.data]);

  const LomTable = () => {
    // const totalQty = tableRows.reduce((sum, row) => sum + Number(row.quantity), 0);
    const totalCost = tableRows.reduce((sum, row) => sum + Number(row.cost), 0);
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: "1px solid #ddd" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={styleCell}>S.No</TableCell>
              <TableCell sx={styleCell}>Description</TableCell>
              <TableCell sx={styleCell}>Specification</TableCell>
              {/* <TableCell sx={styleCell}>Materials</TableCell> */}
              <TableCell sx={styleCell}>Unit</TableCell>
              <TableCell sx={styleCell}>Quantity</TableCell>
              <TableCell sx={styleCell}>Rate</TableCell>
              <TableCell sx={styleCell}>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              tableRows.map((row, index) => {
                return (
                  <TableRow
                    key={index}>
                    <TableCell sx={styleRow}>{index + 1}</TableCell>
                    <TableCell sx={styleRow}>{row.description}</TableCell>
                    <TableCell sx={styleRow}>{row.specification}</TableCell>
                    {/* <TableCell sx={styleRow}>{row.materials}</TableCell> */}
                    <TableCell sx={styleRow}>{row.unit}</TableCell>
                    <TableCell sx={styleRow}>{row.quantity}</TableCell>
                    <TableCell sx={styleRow}>
                      {editingIndex === index ? (
                        <TextField
                          type="number"
                          value={editableRate ?? ""}
                          onChange={(e) => setEditableRate(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleRateUpdate(row.index);
                            }
                          }}
                          size="small"
                        />
                      ) : (
                        <span onClick={() => startEditing(index, row.rate)} style={{ cursor: 'pointer' }}>
                          ₹{row.rate}
                        </span>
                      )}
                    </TableCell>
                    <TableCell sx={styleRow}>{row.cost}</TableCell>

                    {row.isNew && (
                      <TableCell sx={styleRow}>
                        <FaRegTrashAlt
                          onClick={() => handleDeleteItem(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            }

            {showInputRow && (
              <TableRow>
                <TableCell sx={styleRow}>{tableRows.length + 1}</TableCell>
                <TableCell sx={styleRow}><CustomInput type="text" name="description" value={newItem.description}
                  onChange={
                    handleInputChange
                  } /></TableCell>
                <TableCell sx={styleRow}><TextField variant="outlined" fullWidth size="small" name="specification" value={newItem.specification} onChange={handleInputChange} /></TableCell>
                {/* <TableCell sx={styleRow}><TextField variant="outlined" fullWidth size="small" name="materials" value={newItem.materials} onChange={handleInputChange} /></TableCell> */}
                <TableCell sx={styleRow}><TextField variant="outlined" fullWidth size="small" name="unit" value={newItem.unit} onChange={handleInputChange} /></TableCell>
                <TableCell sx={styleRow}><TextField variant="outlined" fullWidth size="small" name="quantity" type="number" value={newItem.quantity} onChange={handleInputChange} /></TableCell>
                <TableCell sx={styleRow}><TextField variant="outlined" fullWidth size="small" name="rate" type="number" value={newItem.rate} onChange={handleInputChange} /></TableCell>
                {/* <TableCell sx={styleRow}><TextField disabled="true" variant="outlined" fullWidth size="small" name="cost" value={newItem.cost} onChange={handleInputChange} /></TableCell> */}
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    onClick={handleAddItem}
                    variant="contained"
                    size="small"
                    sx={{ minWidth: "30px", padding: "2px", backgroundColor: "transparent", border: "none" }}>
                    ✔️
                  </Button>
                  <Button
                    onClick={() => { setShowInputRow(false) }}
                    variant="contained"
                    size="small"
                    sx={{ minWidth: "30px", padding: "2px", backgroundColor: "transparent", border: "none" }}>
                    ❌
                  </Button>
                </TableCell>

              </TableRow>
            )}



            <TableRow>
              <TableCell sx={{ border: "0px", padding: "8px", textAlign: "right", fontWeight: "bold", backgroundColor: "#ADD8E6" }} colSpan={9}>
                {/* <strong>Total: Qty. {totalQty.toFixed(2)} | Cost ₹{totalCost}</strong> */}
                <strong>Total Cost: ₹{totalCost}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="contained" onClick={handleNewAddItem} sx={styleAddItem}>Add Item</Button>
      </TableContainer>
    )
  }

  registerDejaVuSansFont(jsPDF);
  const desGeneratePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const commonStyles = {
      fontSize: 8,
      cellPadding: 0.8,
      halign: "left",
      valign: "middle",
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
      textColor: 20
    };

    let currentY = 5;
    const spacing = 3;

    // === Customer Details ===
    autoTable(doc, {
      startY: currentY,
      margin: { left: 10, right: 10 },
      theme: "plain",
      styles: commonStyles,
      // tableLineWidth: 0.25,
      tableWidth: 80,
      tableLineColor: [0, 0, 0],
      columnStyles: {
        0: { cellWidth: 85 },  // Label column
        1: { cellWidth: 85 }, // Value column

      },
      body: [
        ["Customer Name", customer.data.customerName],
        ["Place", customer.data.customerPlace],
        ["Design Ref: " + twoWindings.data.designId,
        "KVA: " + twoWindings.data.kVA]
      ]
    });

    // === Insert logo ===
    const lastTable = doc.lastAutoTable;
    const logoSize = 18;
    const tableRightEdge = lastTable?.table?.startX + lastTable?.table?.width || 200;
    const logoX = tableRightEdge - logoSize; // aligned to right end
    const logoY = (lastTable?.table?.startY || 7) - 5; // Move 5 units up


    doc.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);

    currentY = lastTable.finalY + spacing;

    // === Core Details (Main) ===
    autoTable(doc, {
      startY: currentY,
      margin: { left: 10, right: 10 },
      theme: "plain",
      styles: commonStyles,
      // tableLineWidth: 0.25,
      // tableLineColor: [0, 0, 0],
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 }
      },
      body: [
        ["Frame: " + twoWindings.data.core.coreDia + "/" + twoWindings.data.core.limbHt + "/" + twoWindings.data.core.cenDist,
        "Core Factor: " + (twoWindings.data.lvFormulas.netArea / twoWindings.data.lvFormulas.grossArea).toFixed(2),
        "Core Type: " + twoWindings.data.core.coreType,
        "Grade: " + `${twoWindings.data.core.coreMaterial} (${twoWindings.data.hvFormulas.specificLoss} W/kg)`],
        ["Area: " + twoWindings.data.lvFormulas.netArea,
        "Weight: " + twoWindings.data.core.coreWeight + "kg",
        "Flux Density: " + twoWindings.data.lvFormulas.revisedFluxDensity.toFixed(3) + "T",
        "Frequency: " + twoWindings.data.frequency + "Hz"],
        ["Volts/Turn: " + twoWindings.data.lvFormulas.revisedVoltsPerTurn,
        "Temperature: " + twoWindings.data.windingTemp + "/" + twoWindings.data.topOilTemp,
        "Cooling: " + "ONAN",
        "Vector Group: " + twoWindings.data.vectorGroup]
      ]
    });
    currentY = doc.lastAutoTable.finalY + spacing;

    // === Winding Data (Left) ===
    doc.setFont("DejaVuSans", "normal");

    autoTable(doc, {
      startY: currentY,
      margin: { left: 10 },
      tableWidth: 105,
      theme: "grid",
      styles: commonStyles,
      // tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
      columnStyles: {
        0: { cellWidth: 35, halign: "center" },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 40, halign: "center" }
      },
      head: [[
        {
          content: "Winding Data:",
          colSpan: 3,
          styles: {
            halign: "center",
            lineWidth: 0,
            fillColor: null,
            textColor: 0
          }
        }
      ]],
      bodyStyles: {
        font: "DejaVuSans",
      },
      body: [
        ["Winding Type", `${twoWindings.data.lvWindingType}(${twoWindings.data.lVConductorMaterial})`, `${twoWindings.data.hvWindingType}(${twoWindings.data.hVConductorMaterial})`],
        ["Voltage (V)", "Inner:" + `${twoWindings.data.lowVoltage} ${twoWindings.data.vectorGroup.charAt(1) === "y" ? `/ √3` : ""} `, "Outer:" + `${twoWindings.data.highVoltage} ${twoWindings.data.vectorGroup.charAt(0) === "Y" ? `/ √3` : ""}`],
        ["Current (A)", twoWindings.data.innerWindings.phaseCurrent, twoWindings.data.outerWindings.phaseCurrent],
        ["No. of Limbs", 3, 3],
        ["Turns/Limb", twoWindings.data.innerWindings.turnsPerPhase, twoWindings?.data?.tapStepsPercent ? `${twoWindings?.data?.hvFormulas.hvTurnsAtHighest} - ${twoWindings?.data?.hvFormulas?.hvTurnsPerPhase} - ${twoWindings?.data?.hvFormulas?.hvTurnsAtLowest}` :
          twoWindings.data.outerWindings.turnsPerPhase],
        ["Coils / Discs", twoWindings?.data?.lvWindingType === "DISC" ? (twoWindings?.data?.lvFormulas?.lvDiscArrangement?.replace(/\([^)]*\)/g, '').match(/\d+/g)?.filter(n => n !== "0")?.join(' + ') || '') : twoWindings.data.hvFormulas.hvNoOfCoils === 0 ? 1 : twoWindings.data.hvFormulas.hvNoOfCoils,
          twoWindings?.data?.hvWindingType === "DISC" ? (twoWindings?.data?.hvFormulas?.hvDiscArrangement?.replace(/\([^)]*\)/g, '').match(/\d+/g)?.filter(n => n !== "0")?.join(' + ') || '') :
            twoWindings.data.hvFormulas.hvNoOfCoils === 0 ? 1 : twoWindings.data.hvFormulas.hvNoOfCoils
        ],
        ["Turns/Coil or Disc", twoWindings?.data?.lvWindingType === "DISC" ?
          `${(twoWindings?.data?.lvFormulas?.lvNumberOfLayers - 1)}(${(twoWindings?.data?.lvFormulas?.lvNoOfSpacers - 1)}/${twoWindings?.data?.lvFormulas?.lvNoOfSpacers}) + ${(twoWindings?.data?.lvFormulas?.lvNumberOfLayers - 0.5)}${twoWindings?.data?.lvFormulas?.lvDiscArrangement.match(/\(([^)]+)\)/)?.[0] ? ` + ${(twoWindings?.data?.lvFormulas?.lvNumberOfLayers - 1)} ${twoWindings?.data?.lvFormulas?.lvDiscArrangement.match(/\(([^)]+)\)/)?.[0]}` : ''}`
          : twoWindings.data.lvFormulas.lvTurnsPerPhase,

          twoWindings?.data?.hvWindingType === "DISC" ?
            `${(twoWindings?.data?.hvFormulas?.hvNumberOfLayers - 1)}(${(twoWindings?.data?.hvFormulas?.hvNoOfSpacers - 1)}/${twoWindings?.data?.hvFormulas?.hvNoOfSpacers}) + ${(twoWindings?.data?.hvFormulas?.hvNumberOfLayers - 0.5)}${twoWindings?.data?.hvFormulas?.hvDiscArrangement.match(/\(([^)]+)\)/)?.[0] ? ` + ${(twoWindings?.data?.hvFormulas?.hvNumberOfLayers - 1)} ${twoWindings?.data?.hvFormulas?.hvDiscArrangement.match(/\(([^)]+)\)/)?.[0]}` : ''}`

            : (twoWindings.data.hvFormulas.hvturnspercoil != null ? twoWindings.data.hvFormulas.hvturnspercoil
              : twoWindings.data.hvFormulas.hvTurnsAtHighest)
        ],
        ["No. of Layers", twoWindings.data.innerWindings.noOfLayers, twoWindings.data.outerWindings.noOfLayers],
        ["Turns/Layer", twoWindings?.data?.lvWindingType === "DISC" ? 1 : twoWindings.data.innerWindings.turnsPerLayer,
          twoWindings?.data?.hvWindingType === "DISC" ? 1 : `${parseInt(twoWindings.data.hvFormulas.hvNumberOfLayers, 10)} X ${twoWindings.data.hvFormulas.hvTurnsPerLayer} + ${(twoWindings.data.hvFormulas.hvTurnsAtHighest - (parseInt(twoWindings.data.hvFormulas.hvNumberOfLayers, 10) * twoWindings.data.hvFormulas.hvTurnsPerLayer)).toFixed(0)}`],
        ["Insu. b/w layer (mm)", `${twoWindings.data.innerWindings.interLayerInsulation} (${Math.round(twoWindings.data.innerWindings.interLayerInsulation / 0.0254)} mil)`, `${twoWindings.data.outerWindings.interLayerInsulation} (${Math.round(twoWindings.data.outerWindings.interLayerInsulation / 0.0254)} mil)`],
        ["Oil Duct (mm)", twoWindings.data.innerWindings.noOfDuctsWidth.replace(" / ", " x ") + " oil", twoWindings.data.outerWindings.noOfDuctsWidth.replace(" / ", " x ") + " oil"],
        ["Conductor (mm)",
          twoWindings.data.innerWindings.conductorSizes + (twoWindings.data.innerWindings.isEnamel ? "SE" : "P") + " " + twoWindings.data.lvFormulas.lvConductorInsulation,
          twoWindings.data.outerWindings.conductorSizes.replace("Round", "Ø") + (twoWindings.data.outerWindings.isEnamel ? "SE" : "P") + " " + twoWindings.data.hvFormulas.hvConductorInsulation],
        ["Parallels", `R${twoWindings.data.innerWindings.radialParallelCond} x A${twoWindings.data.innerWindings.axialParallelCond} = ${twoWindings.data.innerWindings.radialParallelCond * twoWindings.data.innerWindings.axialParallelCond}`,
          `R${twoWindings.data.outerWindings.radialParallelCond} x A${twoWindings.data.outerWindings.axialParallelCond} = ${twoWindings.data.outerWindings.radialParallelCond * twoWindings.data.outerWindings.axialParallelCond}`],
        ["Cond Cross Sec (mm)", twoWindings.data.innerWindings.condCrossSec, twoWindings.data.outerWindings.condCrossSec],
        ["Current Dens. (A/mm²)", twoWindings.data.innerWindings.currentDensity, `${twoWindings.data.hvFormulas.hVRevisedCurrDenAtNormal} (${twoWindings.data.hvFormulas.hVRevisedCurrDenAtLowest})`],
        ["Radial Thick. (mm)", twoWindings.data.lvFormulas.lvRadialThickness, twoWindings.data.hvFormulas.hvRadialThickness],
        ["Turn Length (mm)", twoWindings.data.lvFormulas.lvLmt.toFixed(4), twoWindings.data.hvFormulas.hvLmt.toFixed(4)],
        ["Wire Length (m)", twoWindings.data.lvFormulas.lvWireLength, twoWindings.data.hvFormulas.hvWireLength],
        ["Resist. @ 75°C", twoWindings.data.lvFormulas.lvR75, twoWindings.data.hvFormulas.hvR75.toFixed(1)],
        // ["Resist. @ 35°C", "", ""],
        ["Resist. @ 26°C", twoWindings.data.lvFormulas.lvR26, twoWindings.data.hvFormulas.hvR26.toFixed(1)],
        ["Wt – Bare/Ins. (kg)", twoWindings.data.innerWindings.weightBareInsulated, twoWindings.data.outerWindings.weightBareInsulated],
        ["Stray Loss (%)", twoWindings.data.innerWindings.eddyStrayLoss, twoWindings.data.outerWindings.eddyStrayLoss],
        ["Load Loss (W)", twoWindings.data.innerWindings.loadLoss, `${twoWindings.data.hvFormulas.hvLoadLossAtNormal} (${twoWindings.data.hvFormulas.hvLoadLossAtLowest})`],
        ["Gradient (°C)", twoWindings.data.lvFormulas.lvGradient, twoWindings.data.hvFormulas.hvGradient],
        ["Transposition (mm)", twoWindings?.data?.lvWindingType === "DISC" ? twoWindings?.data?.lvFormulas?.lvDiscDuctsSize : twoWindings.data.lvFormulas.lvTransposition,
          twoWindings?.data?.hvWindingType === "DISC" ? twoWindings?.data?.hvFormulas?.hvDiscDuctsSize : twoWindings.data.hvFormulas.hvTransposition],
        ["Winding Length (mm)", twoWindings.data.innerWindings.windingLength, twoWindings.data.outerWindings.windingLength],
        ["End Clearance (mm)", twoWindings.data.innerWindings.endClearances, twoWindings.data.outerWindings.endClearances],
        ["Window Ht. (mm)", twoWindings.data.core.limbHt, twoWindings.data.core.limbHt],
        ["Ampere Turns (A)", twoWindings.data.commonFormulas.ampereTurns, twoWindings.data.commonFormulas.ampereTurns],
        ["Terminals", twoWindings.data.innerWindings.terminal == 0 ? "" : twoWindings.data.innerWindings.terminal,
          twoWindings.data.outerWindings.terminal == 0 ? "" : twoWindings.data.outerWindings.terminal]
      ],
    });

    const rightStartX = 120;
    let rightY = currentY;

    const rightTables1 = [
      {
        title: "Coil Dimensions:",
        rows: [
          twoWindings.data.coilDimensions.coreDia + "    Ø Core",
          "2x" + twoWindings.data.coilDimensions.coreGap + "    δ 1",
          twoWindings.data.coilDimensions.lvid + "    LV-ID",
          "2x" + twoWindings.data.coilDimensions.lvradial,
          twoWindings.data.coilDimensions.lvod + "    LV-OD",
          "2x" + twoWindings.data.coilDimensions.lvhvgap + "    Δ",
          twoWindings.data.coilDimensions.hvid + "    HV-ID",
          "2x" + twoWindings.data.coilDimensions.hvradial,
          twoWindings.data.coilDimensions.hvod + "    HV-OD",
          twoWindings.data.coilDimensions.hvhvgap + "        δ 2",
          twoWindings.data.core.cenDist + "    Centre distance",
          // "Active Part Size:" + twoWindings.data.coilDimensions.activePartSize
        ]
      }
    ];

    doc.setFont("DejaVuSans", "normal");
    // === Right Column Tables ===
    rightTables1.forEach(section => {
      autoTable(doc, {
        startY: rightY,
        margin: { left: rightStartX },
        tableWidth: 85,
        theme: "plain",
        styles: commonStyles,
        tableLineWidth: 0.25,
        tableLineColor: [0, 0, 0],
        head: [[{ content: section.title, styles: { halign: "center" } }]],
        bodyStyles: {
          cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 },
          font: "DejaVuSans"
        },
        body: [
          ...section.rows.map(r => [{ content: r }])
        ]
      });
    });
    rightY = doc.lastAutoTable.finalY + 0.1;

    const rightTables2 = [
      {
        title: "Impedance:",
        rows: [
          `Ls: ${twoWindings.data.commonFormulas.l.toFixed(1)}, ${twoWindings.data.commonFormulas.b.toFixed(1)}, ${twoWindings.data.commonFormulas.kR} → ${twoWindings.data.commonFormulas.ls}`,
          `Δ’: ${twoWindings.data.commonFormulas.delta.toFixed(2)} + ((${twoWindings.data.commonFormulas.h2.toFixed(2)} + ${twoWindings.data.commonFormulas.h1.toFixed(2)
          }) / 3) → ${twoWindings.data.commonFormulas.delta1.toFixed(2)}`,
          `Ds: ${(twoWindings.data.lvFormulas.lvOd - twoWindings?.data?.innerWindings.condInsulation).toFixed(1)} + ${twoWindings.data.commonFormulas.delta.toFixed(2)} + (${twoWindings.data.commonFormulas.h2.toFixed(2)} - ${twoWindings.data.commonFormulas.h1.toFixed(2)
          }) / 3 → ${twoWindings.data.commonFormulas.ds.toFixed(2)}`,
          `  (H):${twoWindings.data.commonFormulas.ampereTurns}         V / T:${twoWindings.data.lvFormulas.revisedVoltsPerTurn}`,
          `ex = (1.24 * (H) * Δ’ * Ds * 10^-4) / (V / T * ls)`,
          `er: ${twoWindings.data.commonFormulas.er}`,
          `ex: ${twoWindings.data.commonFormulas.ex}`,
          `ez: ${twoWindings.data.ez}`
        ]
      }
    ];

    rightTables2.forEach(section => {
      autoTable(doc, {
        startY: rightY,
        margin: { left: rightStartX },
        tableWidth: 85,
        theme: "plain",
        styles: commonStyles,
        columnStyles: {
          0: {
            halign: 'left',
            lineWidth: 0
          }
        },
        tableLineWidth: 0.25,
        tableLineColor: [0, 0, 0],
        headStyles: {
          lineWidth: 0,
          halign: "center",
        },
        bodyStyles: {
          cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 },
          font: "DejaVuSans"
        },
        head: [[{ content: section.title, colSpan: 1 }]],
        body: [
          ...section.rows.map(r => [{ content: r }])
        ]
      });
    });
    rightY = doc.lastAutoTable.finalY + 0.1;

    // ==Insulation Clearances Table==
    const rightTables3 = [
      {
        title: "Insulation Clearances:",
        rows: [
          ["Insul. Core-LV:", twoWindings.data.insCoreLv],
          ["Insul. LV-HV:", twoWindings.data.insLvHv],
          ["Insul. HV-HV:", twoWindings.data.insHvHv]
        ]
      },
    ];

    rightTables3.forEach(section => {
      autoTable(doc, {
        startY: rightY,
        margin: { left: rightStartX },
        tableWidth: 85,
        theme: "plain",
        styles: commonStyles,
        tableLineWidth: 0.25,
        tableLineColor: [0, 0, 0],
        headStyles: {
          lineWidth: 0,
          halign: "center",
        },
        bodyStyles: {
          cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
        },
        columnStyles: {
          0: { halign: 'left', lineWidth: 0, cellWidth: 22 },
          1: {
            halign: 'left', lineWidth: 0, cellWidth: 66,
            cellPadding: { left: 0.1, top: 0.8, right: 0.8, bottom: 0.8 }
          }
        },
        head: [[{ content: section.title, colSpan: 2 }]],
        body: section.rows.map(([label, value]) => [label, value])
      });
    });
    rightY = doc.lastAutoTable.finalY + 0.1;

    // ==Tank Clearances Table==
    const rightTables4 = [
      {
        title: "Tank Clearances:",
        rows: [["Yoke- Cover:", twoWindings.data.tankAndOilFormulas.topYokeCoverGap],
        ["Wdg-Tank:", twoWindings.data.tankAndOilFormulas.wdgTankGap],
        ["Wdg-Leads:", twoWindings.data.tankAndOilFormulas.connectionGap],
        ]
      }
    ]
    rightTables4.forEach(section => {
      autoTable(doc, {
        startY: rightY,
        margin: { left: rightStartX },
        tableWidth: 85,
        theme: "plain",
        styles: commonStyles,
        columnStyles: {
          0: {
            halign: 'left',
            lineWidth: 0
          }
        },
        headStyles: {
          lineWidth: 0,
          halign: "center",
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.25,
        bodyStyles: {
          cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
        },
        columnStyles: {
          0: { halign: 'left', lineWidth: 0, cellWidth: 20 },
          1: {
            halign: 'left', lineWidth: 0, cellWidth: 68,
            cellPadding: { left: 0.1, top: 0.8, right: 0.8, bottom: 0.8 }
          }
        },
        head: [[{ content: section.title, colSpan: 2 }]],
        body: section.rows.map(([label, value]) => [label, value])
      });
    });

    rightY = doc.lastAutoTable.finalY + 4.5;

    const belowBoth = Math.max(doc.lastAutoTable.finalY, rightY) + spacing + 5;

    // === Core Details 2 ===
    autoTable(doc, {
      startY: belowBoth,
      theme: "plain",
      styles: commonStyles,
      tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
      margin: { left: 10, right: 10 },
      bodyStyles: {
        cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
      },
      body: [
        ["Side sheet: " + twoWindings.data.tank.tankWallThickness,
        "Bot. Sheet: " + twoWindings.data.tank.tankBottomThickness,
        "Lid Sheet: " + twoWindings.data.tank.tankLidThickness,
        "Frame: " + twoWindings.data.tank.frameThickness],

        ["Tank Size: (mm)",
          "Length: " + twoWindings.data.tank.tankLength,
          "Width: " + twoWindings.data.tank.tankWidth,
          "Height: " + twoWindings.data.tank.tankHeight],

        ["Radiator: (mm)",
          "Length: " + twoWindings.data.tankAndOilFormulas.radiatorHeight,
          "Width: " + twoWindings.data.tankAndOilFormulas.radiatorWidth,
          "Sections: " + `${twoWindings.data.tankAndOilFormulas.noOfRadiators} x ${twoWindings.data.tankAndOilFormulas.radiatorSection}`],

        ["Conservator: (mm)",
          "Dia: " + twoWindings.data.tankAndOilFormulas.conservatorDia,
          "Length: " + twoWindings.data.tankAndOilFormulas.conservatorLength,
          "Volume: " + Math.round(twoWindings.data.tankAndOilFormulas.conservatorCapacity) + " Liters"]
      ],
      didParseCell: function (data) {
        if (data.column.index === 0 && (data.row.index === 1 || data.row.index === 2 || data.row.index === 3)) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    const genStartY = doc.lastAutoTable.finalY + spacing;

    const generalTableData = {
      coreAndWdg: twoWindings.data.tankAndOilFormulas.weightsOfActivePart,
      oilCost: twoWindings.data.tankAndOilFormulas.totalOil,
      tankAndFitting: twoWindings.data.tankAndOilFormulas.totalSteelWeight + twoWindings.data.tankAndOilFormulas.totalRadiatorWeight,
      cond: `${twoWindings.data.lvFormulas.lvProcurementWeight} + ${twoWindings.data.hvFormulas.hvProcurementWeight} + ${(twoWindings.data.tankAndOilFormulas.totalConnectionWeight)}`,
      oilWeight: twoWindings.data.tankAndOilFormulas.oilWeight,
      weightCore: twoWindings?.data?.tankAndOilFormulas?.weightCore,
      total: (twoWindings.data.tankAndOilFormulas.weightsOfActivePart +
        twoWindings.data.tankAndOilFormulas.weightOfTankAndAcc +
        twoWindings.data.tankAndOilFormulas.oilWeight
      ),
      insulation: twoWindings.data.tankAndOilFormulas.insulationWeight,
      overallDimensions: twoWindings.data.tank.overallDimension.split(" x ").
        map((v, i) => `${(parseFloat(v) / 1000).toFixed(2)}${['L', 'B', 'H'][i]}`).join(" x "),
      steel: twoWindings.data.tankAndOilFormulas.totalSteelWeight,
      radiators: twoWindings.data.tankAndOilFormulas.totalRadiatorWeight,
    };

    // === Generals Table ===
    autoTable(doc, {
      startY: genStartY,
      theme: "plain",
      styles: commonStyles,
      tableWidth: 95,
      tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
      margin: { left: 10, right: 10 },
      head: [
        [
          { content: "Generals", colSpan: 2, styles: { halign: "center", fontStyle: "bold", lineWidth: 0.25 } },
        ]
      ],
      bodyStyles: {
        cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
      },
      columnStyles: {
        0: { halign: 'center', lineWidth: 0, cellWidth: 47.5 },
        1: {
          lineWidth: 0, cellWidth: 47.5
        }
      },
      body: [
        ["Weights (kg)", "Costing Data"],
        ["Core & Wdg:   " + generalTableData.coreAndWdg, "Oil (l)\t        : " + generalTableData.oilCost],
        ["Tank & Fitting: " + generalTableData.tankAndFitting, "Cond: (kg)\t: " + generalTableData.cond],
        ["Oil:\t\t   " + generalTableData.oilWeight, "Core: (kg)\t : " + generalTableData.weightCore],
        ["Total:\t      " + generalTableData.total, "Insulation: (kg)  : " + generalTableData.insulation],
        ["Over-all Dimensions: (m)", "Steel: (kg)\t : " + generalTableData.steel],
        [generalTableData.overallDimensions, "Radiators\t  : " + generalTableData.radiators]
      ],
      didParseCell: function (data) {
        //for header
        if (data.column.index === 0 && data.column.index === 1) {
          //data.cell.styles.halign = 'left';
          data.cell.styles.cellPadding = { left: 6, top: 0.8, right: 0.8, bottom: 0.8 };
        }

        if (data.row.index === 0 && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.lineWidth = 0.25;
          data.cell.styles.halign = "center";
        }

        //for both columns in body
        if (data.row.index !== 0 && (data.row.index !== 5 && data.column.index === 0) && data.row.index !== 6 && data.section === 'body') {
          data.cell.styles.halign = 'left';
        }

        //for overAllDimension cell
        if (data.row.index === 5 && data.section === 'body' && data.column.index === 0) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.cellPadding = { left: 3, top: 0.8, right: 0.8, bottom: 0.8 };
        }

        //for overAllDimension value 
        if (data.row.index === 6 && data.section === 'body' && data.column.index === 1) {
          data.cell.styles.halign = 'left';
          if (data.column.index == 0) {
            data.cell.styles.cellPadding = { left: 6, top: 0.8, right: 0.8, bottom: 0.8 };
          }
        }

      },
      didDrawCell: function (data) {
        const doc = data.doc;

        //Center line
        if (data.section === 'body' && data.column.index === 0) {
          const lineX = data.cell.x + data.cell.width;
          const y1 = data.cell.y;
          let y2 = data.cell.y + data.cell.height;
          // if (data.row.index === 6) {
          //   y2 = data.cell.y + data.cell.height - 0.85;
          // }
          doc.setDrawColor(0);
          doc.setLineWidth(0.25);
          doc.line(lineX, y1, lineX, y2);
        }

        //line after head
        // if (data.section === 'head' && data.column.index === 0) {
        //   const padding = 2;
        //   const lineY = data.cell.y + data.cell.height;
        //   const startX = data.cell.x + padding;
        //   const endX = data.cell.x + 93;
        //   doc.setDrawColor(0);
        //   doc.setLineWidth(0.25);
        //   doc.line(startX, lineY, endX, lineY);
        // }
      }
    }
    );

    const performaceTableData = {
      noLoadLoss: twoWindings.data.hvFormulas.coreLoss,
      loadLoss: twoWindings.data.hvFormulas.totalLoadLoss,
      tankStrayLoss: twoWindings.data.tank.tankLoss,
      resistance: twoWindings.data.commonFormulas.er,
      reactance: twoWindings.data.commonFormulas.ex,
      impedance: twoWindings.data.commonFormulas.ek,
      noLoadCurrent: twoWindings.data.nlcurrentPercentage
    };
    // Performance Table
    autoTable(doc, {
      startY: genStartY,
      theme: "plain",
      styles: commonStyles,
      tableWidth: 95,
      tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
      margin: { left: 105.1, right: 10 },
      head: [
        [
          { content: "Performance", styles: { halign: "center", fontStyle: "bold", lineWidth: 0.25 } },
          { content: "Calculated", styles: { halign: "center", fontStyle: "bold", lineWidth: 0.25 } },
          { content: "Guaranteed", styles: { halign: "center", fontStyle: "bold", lineWidth: 0.25 } }
        ]
      ],
      bodyStyles: {
        cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
      },
      columnStyles: {
        0: { halign: 'left', lineWidth: 0.25, cellWidth: 31.67 },
        1: { halign: 'left', lineWidth: 0.25, cellWidth: 31.67 },
        2: { lineWidth: 0.25, cellWidth: 31.67 }
      },
      body: [
        ["No Load Loss (W):", performaceTableData.noLoadLoss, ""],
        ["Load Loss (W):", performaceTableData.loadLoss, ""],
        ["Tank Stray Loss (W):", performaceTableData.tankStrayLoss, ""],
        ["Resistance (5):", performaceTableData.resistance, ""],
        ["Reactance (%):", performaceTableData.reactance, ""],
        ["Impedance (%):", performaceTableData.impedance, ""],
        ["No Load Curr. (%):", performaceTableData.noLoadCurrent, ""]
      ],

    });

    const tapY = doc.lastAutoTable.finalY + spacing;

    // === Tapping Section ===
    const tappingTableData = {
      taps: `${twoWindings.data.tapStepsPositive + twoWindings.data.tapStepsNegative
        } taps, +${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsPositive
        }% to -${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsNegative
        }% @${twoWindings.data.tapStepsPercent}%, HV, ${twoWindings.data.isOLTC == true ? "OLTC" : "OCTC"
        }`,
      turns: [0, ...twoWindings.data.hvFormulas.turnsPerTap].join(" - "),
      testVoltageHv: `${twoWindings.data.hvTestVoltage
        } / ${Number.isInteger((2 * twoWindings.data.highVoltage) / 1000) ?
          ((2 * twoWindings.data.highVoltage) / 1000) : ((2 * twoWindings.data.highVoltage) / 1000).toFixed(3)
        } / ${twoWindings.data.hvImpulseVoltage}`,
      testVoltageLv: `${twoWindings.data.lvTestVoltage
        } / ${Number.isInteger((2 * twoWindings.data.lowVoltage) / 1000) ?
          ((2 * twoWindings.data.lowVoltage) / 1000) : ((2 * twoWindings.data.lowVoltage) / 1000).toFixed(3)
        } / ${twoWindings.data.lvImpulseVoltage == 0 ? "-" : twoWindings.data.lvImpulseVoltage}`,
    };

    autoTable(doc, {
      startY: tapY,
      theme: "plain",
      styles: commonStyles,
      margin: { left: 10, right: 10 },
      //tableLineWidth: 0.25,
      tableLineColor: [0, 0, 0],
      head: [[
        {
          content: "Tapping:",
          colSpan: 2,
          styles: {
            halign: "left",
            lineWidth: 0,
            fillColor: null,
            textColor: 0
          },
        }
      ]],
      columnStyles: {
        0: {
          fontStyle: "bold"
        }
      },
      bodyStyles: {
        cellPadding: { left: 2, top: 0.8, right: 0.8, bottom: 0.8 }
      },
      body: [
        ["Taps:", tappingTableData.taps],
        ["Turns:", tappingTableData.turns],
        ["Test Voltage", `HV: ${tappingTableData.testVoltageHv} kV, LV: ${tappingTableData.testVoltageLv} kV`]
      ]
    });

    const footerY = doc.lastAutoTable.finalY + 10;

    // === Footer ===
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 10;
    const sectionWidth = (pageWidth - marginX * 2) / 3;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Date: __________________", marginX, footerY);
    doc.text("Designed By: __________________", marginX + sectionWidth, footerY);
    doc.text("Verified By: __________________", marginX + sectionWidth * 2, footerY);

    // === Save ===
    //doc.save("Transformer_Design_Data_Sheet.pdf");
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };


  const gtpGeneratePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const outerMargin = 10;
    const gap = 2;
    const cornerPadding = 2;

    const innerOffset = 1.5;
    const headerX = outerMargin + gap;
    const headerY = outerMargin + gap;
    const headerWidth = pageWidth - outerMargin * 2 - (2 * gap);
    const headerHeight = 30;

    function drawPageDecorations(doc) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      const outerMargin = 10;
      const gap = 2;
      const pageMarginX = outerMargin + gap;
      const pageMarginY = outerMargin + gap;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(pageMarginX, pageMarginY, pageWidth - outerMargin - gap, pageMarginY);
      doc.line(pageMarginX, pageHeight - outerMargin - gap, pageWidth - outerMargin - gap, pageHeight - outerMargin - gap);
      doc.line(pageMarginX, pageMarginY, pageMarginX, pageHeight - outerMargin - gap);
      doc.line(pageWidth - outerMargin - gap, pageMarginY, pageWidth - outerMargin - gap, pageHeight - outerMargin - gap);
    }

    function drawStripedBorder(x, y, width, height, stripeSpacing = 2) {
      const stripeColor = [180, 0, 180];
      const stripeWidth = 0.7;

      doc.setDrawColor(...stripeColor);
      doc.setLineWidth(stripeWidth);

      for (let i = 0; i < width; i += stripeSpacing) {
        if (i + stripeSpacing / 2 <= width) {
          doc.line(x + i, y, x + i + stripeSpacing / 2, y + stripeSpacing / 2);
        }
        if (i + stripeSpacing / 2 <= width) {
          doc.line(x + i, y + height, x + i + stripeSpacing / 2, y + height - stripeSpacing / 2);
        }
      }

      for (let j = 0; j < height; j += stripeSpacing) {
        if (j + stripeSpacing / 2 <= height) {
          doc.line(x, y + j, x + stripeSpacing / 2, y + j + stripeSpacing / 2);
        }
        if (j + stripeSpacing / 2 <= height) {
          doc.line(x + width, y + j, x + width - stripeSpacing / 2, y + j + stripeSpacing / 2);
        }
      }
    }

    drawStripedBorder(headerX, headerY, headerWidth, headerHeight);

    doc.setDrawColor(255);
    doc.setFillColor(255, 255, 255);
    doc.rect(
      headerX + innerOffset,
      headerY + innerOffset,
      headerWidth - innerOffset * 2,
      headerHeight - innerOffset * 2,
      "F"
    );

    const title = "SCHEDULE  OF  PARTICULARS  AS  PER  IS - 2026  APPENDIX";
    doc.setTextColor(204, 0, 204);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const titleY = headerY + headerHeight / 2 + 3;
    doc.text(title, pageWidth / 2, titleY, { align: "center" });
    const underlineWidth = doc.getTextWidth(title);
    const underlineX = (pageWidth - underlineWidth) / 2;
    const underlineY = titleY + 1.5;
    doc.setLineWidth(0.5);
    doc.setDrawColor(204, 0, 204);
    doc.line(underlineX, underlineY, underlineX + underlineWidth, underlineY);

    doc.addImage(
      logo,
      'PNG',
      pageWidth - outerMargin - 25,
      headerY + 5,
      20,
      20
    );

    const marginX = 13;
    const tableWidth = pageWidth - 2 * marginX;

    let currentX = marginX;
    let currentY = headerY + headerHeight + 7;

    const colWidths = [
      tableWidth * 0.08,
      tableWidth * 0.42,
      tableWidth * 0.50
    ];

    //GTP-DATA
    let gtpData = {
      kVA: twoWindings.data.kVA,
      nameOfTheManuFacture: "",
      service: (twoWindings.data.innerWindings.terminal == "Cable Box" &&
        twoWindings.data.outerWindings.terminal == "Cable Box") ? "INDOOR" : "OUTDOOR",
      hvKVARating: twoWindings.data.hVConductorMaterial == "Cu" ? "COPPER" : "ALUMINIUM",
      lvKVARating: twoWindings.data.lVConductorMaterial == "Cu" ? "COPPER" : "ALUMINIUM",
      noOfPhases: 3,
      connectionSymbol: twoWindings.data.vectorGroup,
      tappingsRange: `+${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsPositive
        }% To -${twoWindings.data.tapStepsPercent * twoWindings.data.tapStepsNegative
        }% @ ${twoWindings.data.tapStepsPercent
        }%`,
      tappingsNoOfSteps: `${twoWindings.data.tapStepsPositive + twoWindings.data.tapStepsNegative + 1}`,
      tapppingFor: "HV VARIATION",
      refAmbientTemp: `${twoWindings.data.ambientTemp}°C`,
      typeOfCooling: "ONAN",
      tempRiseTopOil: `${twoWindings.data.topOilTemp}°C`,
      tempRiseWinding: `${twoWindings.data.windingTemp}°C`,
      totallossRatedVoltage: "",
      totallossNominalTap: twoWindings.data.hvFormulas.totalLoadLoss,
      componentLossesNoLoadLoss: twoWindings.data.coreLoss,
      componentLossesLoadLoss: "",
      hvRatedVoltage: twoWindings.data.lowVoltage,
      lvRatedVoltage: twoWindings.data.highVoltage,
      hvConnection: twoWindings.data.vectorGroup.charAt(0) == "D" ? "DELTA" : "STAR",
      lvConnection: twoWindings.data.vectorGroup.charAt(1) == "y" ? "STAR" : "DELTA",
      impedanceVolt: twoWindings.data.ez,
      reactanceRatedVoltage: twoWindings.data.commonFormulas.ex,
      noLoadCurrentRV: twoWindings.data.nlcurrentPercentage,
      insulationLevelPfHv: "",
      insulationLevelPfLv: "",
      impulseWithStandHv: "",
      impulseWithStandLv: "",
      teritiaryWindingData: "N.A.",
      efficienciesFullLoad: twoWindings.data.efficiencyAndVr.efficiencyAtUnity_100,
      efficiencies75FullLoad: twoWindings.data.efficiencyAndVr.efficiencyAtUnity_75,
      efficiencies50FullLoad: twoWindings.data.efficiencyAndVr.efficiencyAtUnity_50,
      regulationUpf: twoWindings.data.efficiencyAndVr.voltageRegulation_100,
      regulation80: twoWindings.data.efficiencyAndVr.voltageRegulation_80,
      equipmentForOnanCooling: "YES",
      equipmentForOfafCooling: "",
      noOfRadiatorsPerTrf: `${twoWindings.data.tankAndOilFormulas.radiatorHeight
        } x ${twoWindings.data.tankAndOilFormulas.radiatorWidth
        } - ${twoWindings.data.tankAndOilFormulas.radiatorSection
        } x ${twoWindings.data.tankAndOilFormulas.noOfRadiators}`,
      ratingOfEachRadiator: "",
      offCircuitVariationTapSwitch: "YES",
      offCircuitVariationLink: "N.A.",
      detailOfOnLoadTapCharger: "",
      terminalLV: twoWindings.data.innerWindings.terminal,
      terminalHV: twoWindings.data.outerWindings.terminal,
      approxMassesCoreAndWinging: twoWindings.data.tankAndOilFormulas.weightsOfActivePart,
      approxMassesTankFittingAndAcc: twoWindings.data.tankAndOilFormulas.weightOfTankAndAcc,
      approxMassesOil: twoWindings.data.tankAndOilFormulas.oilWeight,
      approxMassesTotal: (twoWindings.data.tankAndOilFormulas.weightsOfActivePart +
        twoWindings.data.tankAndOilFormulas.weightOfTankAndAcc +
        twoWindings.data.tankAndOilFormulas.oilWeight),
      approxQtyOfOilForFirstFill: twoWindings.data.tankAndOilFormulas.totalOil,
      approxOverallDimLength: twoWindings.data.tank.overallDimension.split(" x ")[0].split(".")[0],
      approxOverallDimBreadth: twoWindings.data.tank.overallDimension.split(" x ")[1].split(".")[0],
      approxOverallDimHeight: twoWindings.data.tank.overallDimension.split(" x ")[2].split(".")[0],
      despatchDetailsMassOfHeaviestPack: (twoWindings.data.tankAndOilFormulas.weightsOfActivePart +
        twoWindings.data.tankAndOilFormulas.weightOfTankAndAcc +
        twoWindings.data.tankAndOilFormulas.oilWeight),
      despatchDetailsDimOfLargestPack: twoWindings.data.tank.overallDimension.split(" x ")
        .map((v, i) => `${(parseFloat(v) / 1000).toFixed(2)}${['L', 'B', 'H'][i]}`).join(" x "),
      unTankingHeight: "",
      refStandardsTransformer: "IS - 2026   Trafo-Standard",
      refStandardsOil: "IS - 335",
      refStandardsBushing: "IS - 2099",
      refStandardsLoading: "IS - 6600",
    };

    const tableHead = [["S.NO.", "DESCRIPTION", "PARTICULARS"]];

    const tableBodyPart1 = [
      ["1.", "NAME OF THE MANUFACTURER:", ""],
      ["2.", "SERVICE :", gtpData.service],
      ["3.", "KVA RATING :\t\t a) HV :\n\t\t\t\t\t b) LV :",
        gtpData.kVA + "  " + (gtpData.hvKVARating) + "\n" +
        gtpData.kVA + "  " + (gtpData.lvKVARating)
      ],
      ["4.", "RATED VOLTAGE :\t a) HV :\t (V)\n\t\t\t\t\t b) LV : \t (V)",
        gtpData.hvRatedVoltage + "\n" +
        gtpData.lvRatedVoltage
      ],
      ["5.", "RATED FREQUENCY :\t\t\t(Hz)", ""],
      ["6.", "CONNECTIONS :\t    a) HV :\n\t\t\t\t\t b) LV :",
        gtpData.hvConnection + "\n" +
        gtpData.lvConnection
      ],
      ["7.", "NO.  OF PHASES :", gtpData.noOfPhases],
      ["8.", "CONNECTION  SYMBOL :", gtpData.connectionSymbol],

      ["9.", "TAPPINGS :    \t\ta) RANGE :", gtpData.tappingsRange],
      ["", "\t\t\t\t\tb) NO.OF.STEPS :", gtpData.tappingsNoOfSteps],
      ["", "\t\t\t\t\tc) FOR :", gtpData.tapppingFor],

      ["10.", "REFERENCE  AMBIENT  TEMP. IN  DEG  C :", gtpData.refAmbientTemp],
      ["11.", "TYPE OF  COOLING :", gtpData.typeOfCooling],

      ["12.", "TEMPERATURE  RISE :  a) TOP OIL IN  DEG  C :\n" +
        "\t\t\t\t\t  b) WINDING:"
        , gtpData.tempRiseTopOil + "\n" +
        gtpData.tempRiseWinding
      ],

      ["13.",
        "TOTAL LOSS IN Watts     @ RATED VOLTAGE:\n" +
        "\t\t\t\t\t  @ RATED  CURRENT:",
        gtpData.totallossRatedVoltage + "\n" +
        gtpData.totallossNominalTap
      ],

      ["14.",
        "COMPONENT  LOSSES  IN Watts:\n a) NO LOAD LOSS @ RATED VOLTAGE:\n" +
        " b) LOAD LOSS @ RATED  CURRENT:",
        "\n" + gtpData.componentLossesNoLoadLoss + "\n" +
        gtpData.componentLossesLoadLoss
      ],

      ["15.", "IMPEDANCE VOLT. @ NORMAL  TAPPING -- %", gtpData.impedanceVolt],
      ["16.", "REACTANCE @ RATED VOLTAGE -- %", gtpData.reactanceRatedVoltage],
      ["17.", "NO LOAD CURRENT @ RATED VOLTAGE", gtpData.noLoadCurrentRV + "%"],
      ["18.", "INPUT TO COOLING PLANT:", ""],

      ["19.",
        "A) INSULATION  LEVEL IN  kV:\n" +
        "\t\t\t a) p.f TEST VOLTAGE - HV:\n" +
        "\t\t\t b) p.f TEST VOLTAGE - LV:",
        gtpData.insulationLevelPfHv + "\n" + gtpData.insulationLevelPfLv
      ],
      ["", "B) INDUCED OVER VOLTAGE  IN kV:  a) HV:\n" +
        "\t\t\t\t\t\t\t\tb) LV:",
        gtpData.insulationLevelPfHv + "\n" + gtpData.insulationLevelPfLv],
      ["", "C) IMPULSE WITHSTAND  IN kV PEAK:\n" +
        "     FULL  WAVE:\t\t\t\t     a) HV:\n" +
        "\t\t\t\t\t\t\t\tb) LV:",
        gtpData.impulseWithStandHv + "\n" + gtpData.impulseWithStandLv],

      ["20.", "TERITIARY WINDING DATA:", gtpData.teritiaryWindingData],

      ["21.", "EFFICIENCIES:  @ upf -- %:\n" +
        "\t\t\ta) @ FULL LOAD:\n" +
        "\t\t\tb) @ 0.75 FULL LOAD:\n" +
        "\t\t\tc) @ 0.50 FULL LOAD:"
        , "\n" + gtpData.efficienciesFullLoad + "\n" + gtpData.efficiencies75FullLoad + "\n" + gtpData.efficiencies50FullLoad],

      ["22.", "REGULATION @ FULL LOAD :\n" +
        "\t\t\ta) @ Upf --- %:\n" +
        "\t\t\tb) @ 0.8 p.f. Lag:",
        "\n" + gtpData.regulationUpf + "\n" + gtpData.regulation80],
    ];

    const tableBodyPart2 = [
      ["23.",
        "EQUIPMENT FOR ONAN COOLING\nRADIATORS MOUNTED ON TANK :",
        "\n" + gtpData.equipmentForOnanCooling],
      ["24.", "EQUIPMENT FOR OFAF  COOLING :", gtpData.equipmentForOfafCooling],
      ["25.", "NO. OF RADIATORS PER TRF..:", gtpData.noOfRadiatorsPerTrf],
      ["26.", "RATING OF EACH  RADIATOR :", gtpData.ratingOfEachRadiator],

      ["27.", "OFF CIRCUIT VARIATION :  a) TAP SWITCH :\n" +
        "\t\t\t\t\t       b)  LINK :"
        , gtpData.offCircuitVariationTapSwitch + "\n" + gtpData.offCircuitVariationLink],

      ["28.", "DETAILS OF ON LOAD TAP CHANGER :", gtpData.detailOfOnLoadTapCharger],

      ["29.", "TERMINAL ARRANGEMENT :\n" +
        "\t\t\t\t\t       a) HV:\n" +
        "\t\t\t\t\t       a) LV:"
        , "\n" + gtpData.terminalHV + "\n" + gtpData.terminalLV],

      ["30.", "APPROXIMATE MASSES IN kg :\n" +
        "\t    a) CORE & WINDING :\n" +
        "\t    b) TANK FITTINGS & ACC. :\n" +
        "\t    c) OIL :\n" +
        "\t    d) TOTAL :"
        , "\n" + gtpData.approxMassesCoreAndWinging + "\n" +
        gtpData.approxMassesTankFittingAndAcc + "\n" +
        gtpData.approxMassesOil + "\n" +
        gtpData.approxMassesTotal],

      ["31.", "APPROX QTY OF OIL REQUIRED FOR FIRST FILL:", gtpData.approxQtyOfOilForFirstFill],

      ["32.", "APPROXIMATE OVERALL DIMENSIONS :\n" +
        "\t    a) LENGTH\t\t\t   mm :\n" +
        "\t    b) BREADTH\t\t\tmm :\n" +
        "\t    c) HEIGHT\t\t\t    mm :",
        "\n" + gtpData.approxOverallDimLength + "\n" + gtpData.approxOverallDimBreadth + "\n" + gtpData.approxOverallDimHeight],
      ["33.", "DESPATCH  DETAILS :\n" +
        "a) APPROX. MASS OF HEAVIEST PACK :\n" +
        "b) APPROX. DIM OF LARGEST  PACK :"
        , "\n" + gtpData.despatchDetailsMassOfHeaviestPack + "\n" + gtpData.despatchDetailsDimOfLargestPack],
      ["34.", "UNTANKING  HEIGHT :", gtpData.unTankingHeight],
      ["35.", "REFERENCE  STANDARDS :",
        ""],
      ["", "\t\t\t    a) TRANSFORMERS :", gtpData.refStandardsTransformer],
      ["", "\t\t\t    b) OIL :", gtpData.refStandardsOil],
      ["", "\t\t\t    c) BUSHING :", gtpData.refStandardsBushing],
      ["", "\t\t\t    d) LOADING :", gtpData.refStandardsLoading]
    ];

    autoTable(doc, {
      startX: currentX,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 1.5,
        valign: "middle",
        halign: "left",
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [0, 0, 0]
      },
      margin: { left: marginX, right: marginX },
      columnStyles: {
        0: { cellWidth: colWidths[0], halign: 'center' },
        1: { cellWidth: colWidths[1] },
        2: { cellWidth: colWidths[2] }
      },
      head: tableHead,
      body: tableBodyPart1,
      showHead: 'firstPage',
      didDrawPage: function (data) {
        drawPageDecorations(data.doc);
      },
    });

    doc.addPage();

    autoTable(doc, {
      startX: currentX,
      startY: headerY + 1,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 1.5,
        valign: "middle",
        halign: "left",
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
      },

      bodyStyles: {
        fontSize: 8.5,
        textColor: [0, 0, 0]
      },
      margin: { left: marginX, right: marginX },
      columnStyles: {
        0: { cellWidth: colWidths[0], halign: 'center' },
        1: { cellWidth: colWidths[1] },
        2: { cellWidth: colWidths[2] }
      },
      body: tableBodyPart2,

      didDrawPage: function (data) {
        drawPageDecorations(data.doc);
        const textY = data.cursor.y + 10;
        const leftMargin = data.settings.margin.left;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0)
        doc.text("DESIGN / PREPARED BY :", leftMargin, textY);
        doc.text("CHECKED BY :", leftMargin + 90, textY);
        doc.text("DATE :", leftMargin, textY + 10);
      },

    });
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");

  }

  const generateLomPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const totalCost = tableRows.reduce((sum, row) => sum + Number(row.cost), 0);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const outerMargin = 10;
    const gap = 2;
    const cornerPadding = 2;

    const commonStyles = {
      fontSize: 9,
      cellPadding: 1.5,
      valign: "middle",
      halign: "left",
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
    };

    const marginX = 13;
    const tableWidth = pageWidth - 2 * marginX;

    let currentX = marginX;


    const topLine1Y = 10;
    const topLine2Y = 20;
    const titleY = 28;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    doc.text(`Design Ref: ${twoWindings.data.designId}`, 10, topLine1Y);
    doc.text(`Customer Name: ${customer?.data?.customerName}        Place: ${customer?.data?.customerPlace}`, 10, topLine2Y);
    doc.text("LOM (LIST OF MATERIALS)", pageWidth / 2, titleY, { align: "center" });

    const imageWidth = 20;
    const imageHeight = 20;
    const paddingRight = 10;
    const imageX = pageWidth - imageWidth - paddingRight;
    const imageY = 5;

    doc.addImage(
      logo,
      'PNG',
      imageX,
      imageY,
      imageWidth,
      imageHeight
    );


    let currentY = titleY + 5;

    const tableHead = [["S.No", "Description", "Specification", "Unit", "Quantity", "Rate", "Cost"]];
    autoTable(doc, {
      startX: currentX,
      startY: currentY,
      theme: 'grid',
      styles: {
        commonStyles
      },

      bodyStyles: {
        ...commonStyles,
        fontSize: 8.5,
        textColor: [0, 0, 0]
      },
      margin: { left: marginX, right: marginX },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.25,
      },
      head: tableHead,
      body: tableRows.slice(0, -1).map(row => [
        row.index + 1,
        row.description,
        row.specification,
        row.unit,
        row.quantity,
        row.rate,
        row.cost
      ]),
      didDrawCell: function (data) {
        const { doc, cell } = data;

        if (cell.text && cell.text[0] === "Other Materials") {
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          //doc.setFont("DejaVuSans", "normal");
          doc.setTextColor(0, 0, 0);

          const pageWidth = doc.internal.pageSize.getWidth();
          const formattedCost = Number(totalCost).toLocaleString("en-IN");

          const totalText = `Total Cost: Rs. ${formattedCost}/-`;
          const totalTextWidth = doc.getTextWidth(totalText);
          const totalTextX = pageWidth - totalTextWidth - 13;
          const totalTextY = cell.y + 12;

          doc.text(totalText, totalTextX, totalTextY);


          const signatureText = "Authorized Signature: __________________";
          const signatureTextWidth = doc.getTextWidth(signatureText);
          const signatureTextX = 10;
          const signatureTextY = totalTextY + 15;
          doc.setFontSize(9);

          doc.text(signatureText, signatureTextX, signatureTextY);
        }
      },



    });
    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  }

  // 3 Cruci;
  //   - A: centerLimbStacking
  //   - B: yokeStacking
  //   - C: sideLimbStacking

  // 4 blade:
  // - A : centerLimbStacking
  // - B : sideLimbStacking
  // - C : doubleNotchStacking
  // - D : singleNotchStacking

  const coreBladeGeneratePDF = () => {

    const coreBladeTypeMap = {
      "CRUSI_3": "3Crusi",
      "BLADE_3": "3Blade",
      "BLADE_4": "4Blade",
      "CRUSI_4": "4Crusi",
    };
    const coreBladeType = coreBladeTypeMap[coreData.eCoreBladeType];


    const PDFData = {
      data1: `${twoWindings.data.lowVoltage
        } / ${twoWindings.data.highVoltage
        }V, Hz:${twoWindings.data.frequency
        }, ${twoWindings.data.kVA}kVA`,
      data2: `CORE Size: ${twoWindings.data.core.coreDia
        } / ${twoWindings.data.core.limbHt} / ${twoWindings.data.core.cenDist
        }, ${coreBladeType}`,
    };

    const table1Stacking = coreData.centerLimbStacking;
    const table2Stacking = coreData.eCoreBladeType === "CRUSI_3" || coreData.eCoreBladeType === "BLADE_3"
      ? coreData.yokeStacking
      : coreData.sideLimbStacking;
    const table3Stacking = coreData.eCoreBladeType === "CRUSI_3" || coreData.eCoreBladeType === "BLADE_3"
      ? coreData.sideLimbStacking
      : coreData.doubleNotchStacking;
    const table4Stacking = coreData.singleNotchStacking;



    const tableBodyPart1 = table1Stacking
      .filter(row => row.some(value => value !== "" && value !== null && value !== undefined))
      .map(row => coreData.eCoreBladeType === "CRUSI_3"
        ? [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`, `${row[5]}`]
        : [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`]
      );

    const tableBodyPart2 = table2Stacking
      .filter(row => row.some(value => value !== "" && value !== null && value !== undefined))
      .map(row => coreData.eCoreBladeType === "CRUSI_3"
        ? [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`, `${row[5]}`]
        : [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`]
      );

    const tableBodyPart3 = table3Stacking
      .filter(row => row.some(value => value !== "" && value !== null && value !== undefined))
      .map(row => coreData.eCoreBladeType === "CRUSI_3"
        ? [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`, `${row[5]}`]
        : [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`]
      );

    const tableBodyPart4 = table4Stacking
      .filter(row => row.some(value => value !== "" && value !== null && value !== undefined))
      .map(row => [`${row[0]}`, `${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`]
      );


    const weightIndex = coreData.eCoreBladeType === "CRUSI_3" ? 5 : 4;
    const table1TotalWeight = table1Stacking.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0);
    const table2TotalWeight = table2Stacking.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0);
    const table3TotalWeight = table3Stacking.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0);
    const table4TotalWeight = table4Stacking.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0);

    const totalWeight = (coreData.eCoreBladeType === "CRUSI_3" || coreData.eCoreBladeType === "BLADE_3")
      ? (table1TotalWeight + table2TotalWeight + table3TotalWeight).toFixed(2) :
      (table1TotalWeight + table2TotalWeight + table3TotalWeight + table4TotalWeight).toFixed(2);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const marginX = 140;
    const marginY = 15;
    const imageWidth = 50; // img wdth changed
    const imageLeftMargin = 10;
    const spaceBetweenImageAndTable = 5;
    const tableLeftMargin = imageLeftMargin + imageWidth + spaceBetweenImageAndTable;

    doc.setFontSize(12);
    doc.setFont("courier", 'bold');
    doc.text("Design Ref:", marginX, marginY);
    doc.setFontSize(12);
    doc.setFont("courier", 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text("CORE Details for Transformer", 65, marginY + 15);
    doc.text(PDFData.data1, 65, marginY + 20.5);
    doc.text(PDFData.data2, 65, marginY + 26);
    let table1StartY = marginY + 30;

    if ((coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") && coreData.coreFormulas.noOfSteps >= 16) {
      table1StartY = marginY + 45;
    }

    const table1Head = coreData.eCoreBladeType === "CRUSI_3"
      ? [["Step\n  No.", "Len A\n  mm", "Len B\n  mm", "Width\n mm", "Stack\n mm", "Weight\n   kg"]]
      : [["Step\n  No.", "Length\n  mm", "Width\n mm", "Stack\n mm", "Weight\n   kg"]];

    const colWidths = coreData.eCoreBladeType === "CRUSI_3"
      ? [18, 18, 18, 18, 16, 20]
      : [18, 18, 18, 16, 20];

    const columnStyles = {
      0: { cellWidth: colWidths[0], halign: 'center' },
      1: { cellWidth: colWidths[1], halign: 'center' },
      2: { cellWidth: colWidths[2], halign: 'center' },
      3: { cellWidth: colWidths[3], halign: 'center' },
      4: { cellWidth: colWidths[4], halign: 'center' },
      ...(coreData.eCoreBladeType === "CRUSI_3" && {
        5: { cellWidth: colWidths[5], halign: 'center' }
      })
    };

    const tableFontSize = ((coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4")
      && coreData.coreFormulas.noOfSteps >= 12) || (coreData.coreFormulas.noOfSteps >= 16) ? 7.5 : 10;

    let Line = coreData.eCoreBladeType == "CRUSI_3" ? "---------------------------------------------------"
      : "---------------------------------------";


    let totalLine = coreData.eCoreBladeType == "CRUSI_3" ? "------------------------------------Group Total="
      : "---------------------------Group Total=";

    if (tableFontSize == 7.5) {
      Line = "------------------------------------------------------";
      totalLine = "------------------------------------Group Total=";
      if (coreData.eCoreBladeType == "CRUSI_3") {
        Line = "-----------------------------------------------------------------";
        totalLine = "-----------------------------------------------Group Total=";
      }
    }

    const coreImage1 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_1 : core1;
    const coreImage2 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_2 : core2;
    const coreImage3 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_3 : core3;

    // Table 1 - centerLimbStacking
    autoTable(doc, {
      startX: 80,
      startY: table1StartY,
      theme: 'plain',
      styles: {
        fontSize: tableFontSize,
        cellPadding: 0.2,
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0,
      },
      headStyles: {
        fontSize: tableFontSize,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fontWeight: 'normal',
        font: 'courier',
        cellPadding: { left: 0.2, top: 0.2, right: 0.2, bottom: 1 },
      },
      bodyStyles: {
        marginTop: "1px",
        fontSize: tableFontSize,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fontWeight: 'normal',
        font: 'courier',
      },
      margin: { left: tableLeftMargin, right: marginY },
      columnStyles: columnStyles,
      head: table1Head,
      body: tableBodyPart1,
      willDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === 0) {
          data.cell.styles.cellPadding = { top: 2, right: 0.2, bottom: 0.2, left: 0.2 };
        }

        if (data.section === 'body' && data.row.index === tableBodyPart1.length - 1) {
          data.cell.styles.cellPadding = { top: 0.2, right: 0.2, bottom: 2, left: 0.2 };
        }

        if (data.section === 'head' && data.column.index === 0) {
          const lineY = data.cell.y + data.cell.height + 1;
          const lineText = Line;
          doc.setFontSize(tableFontSize);
          doc.text(lineText, tableLeftMargin + 4.5, lineY);
        }
      },
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === tableBodyPart1.length - 1 && data.column.index === 0) {
          const totalY = data.cell.y + data.cell.height + 2;
          const totalText = totalLine + table1TotalWeight.toFixed(2);
          doc.setFontSize(tableFontSize);
          doc.text(totalText, tableLeftMargin + 4.5, totalY);
        }
      }
    });


    const table1Height = doc.lastAutoTable.finalY - table1StartY;
    doc.addImage(coreImage1, "PNG", imageLeftMargin, table1StartY, imageWidth, table1Height);

    // Table 2 - yokeStacking
    const table2StartY = doc.lastAutoTable.finalY + 3;

    autoTable(doc, {
      startX: 80,
      startY: table2StartY,
      theme: 'plain',
      styles: {
        fontSize: tableFontSize,
        cellPadding: 0.2,
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0,
      },
      bodyStyles: {
        fontSize: tableFontSize,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fontWeight: 'normal',
        font: 'courier',
      },
      margin: { left: tableLeftMargin, right: marginY },
      columnStyles: columnStyles,
      body: tableBodyPart2,
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === tableBodyPart2.length - 1 && data.column.index === 0) {
          const totalY = data.cell.y + data.cell.height + 2;
          const totalText = totalLine + table2TotalWeight.toFixed(2);
          doc.setFontSize(tableFontSize);
          doc.text(totalText, tableLeftMargin + 4.5, totalY);
        }
      }
    });

    const table2Height = doc.lastAutoTable.finalY - table2StartY;
    doc.addImage(coreImage2, "PNG", imageLeftMargin, table2StartY, imageWidth, table2Height);

    // Table 3 - sideLimbStacking
    const table3StartY = doc.lastAutoTable.finalY + 3;
    autoTable(doc, {
      startX: 80,
      startY: table3StartY,
      theme: 'plain',
      styles: {
        fontSize: tableFontSize,
        cellPadding: 0.2,
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0,
      },
      bodyStyles: {
        fontSize: tableFontSize,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fontWeight: 'normal',
        font: 'courier',
      },
      margin: { left: tableLeftMargin, right: marginY },
      columnStyles: columnStyles,
      body: tableBodyPart3,
      didDrawCell: function (data) {
        if (data.section === 'body' && data.row.index === tableBodyPart3.length - 1 && data.column.index === 0) {
          const totalY = data.cell.y + data.cell.height + 2;
          const totalText = totalLine + table3TotalWeight.toFixed(2);
          doc.setFontSize(tableFontSize);
          doc.text(totalText, tableLeftMargin + 4.5, totalY);
        }
      }
    });

    const table3Height = doc.lastAutoTable.finalY - table3StartY;
    doc.addImage(coreImage3, "PNG", imageLeftMargin, table3StartY, imageWidth, table3Height);

    // Table 4
    if (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") {
      let table4StartY = doc.lastAutoTable.finalY + 3;
      let flag = false;
      if (coreData.coreFormulas.noOfSteps >= 16) {
        doc.addPage();
        flag = true;
        table4StartY = 10;
      }

      autoTable(doc, {
        startX: 80,
        startY: table4StartY,
        theme: 'plain',
        styles: {
          fontSize: tableFontSize,
          cellPadding: 0.2,
          valign: "middle",
          halign: "center",
          lineColor: [0, 0, 0],
          lineWidth: 0,
        },
        bodyStyles: {
          fontSize: tableFontSize,
          textColor: [0, 0, 0],
          fontStyle: 'normal',
          fontWeight: 'normal',
          font: 'courier',
        },
        margin: { left: tableLeftMargin, right: marginY },
        columnStyles: columnStyles,
        body: tableBodyPart4,
        didDrawCell: function (data) {
          if (data.section === 'body' && data.row.index === tableBodyPart3.length - 1 && data.column.index === 0) {
            const totalY = data.cell.y + data.cell.height + 2;
            const totalText = totalLine + table4TotalWeight.toFixed(2);
            doc.setFontSize(tableFontSize);
            doc.text(totalText, tableLeftMargin + 4.5, totalY);
          }
        },

        ...(flag && {
          head: table1Head,
          headStyles: {
            fontSize: tableFontSize,
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            fontWeight: 'normal',
            font: 'courier',
            cellPadding: { left: 0.2, top: 0.2, right: 0.2, bottom: 1 },
          },
          willDrawCell: function (data) {
            if (data.section === 'body' && data.row.index === 0) {
              data.cell.styles.cellPadding = { top: 2, right: 0.2, bottom: 0.2, left: 0.2 };
            }

            if (data.section === 'body' && data.row.index === tableBodyPart1.length - 1) {
              data.cell.styles.cellPadding = { top: 0.2, right: 0.2, bottom: 2, left: 0.2 };
            }

            if (data.section === 'head' && data.column.index === 0) {
              const lineY = data.cell.y + data.cell.height + 1;
              const lineText = Line;
              doc.setFontSize(tableFontSize);
              doc.text(lineText, tableLeftMargin + 4.5, lineY);
            }
          },
        })

      });

      const table4Height = doc.lastAutoTable.finalY - table4StartY;
      doc.addImage(core4_4, "PNG", imageLeftMargin, table4StartY, imageWidth, table4Height);
    }

    const afterLastTableY = doc.lastAutoTable.finalY + 6;
    const tableWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const centerX = tableLeftMargin + tableWidth / 2 - 1;

    doc.setFontSize(11);
    doc.setFont("courier", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Weight: ${totalWeight} kg`, centerX, afterLastTableY, { align: 'center' });

    const extraGap = 3;
    const minusExtraGap = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4")
      && (coreData.coreFormulas.noOfSteps == 15) ? -3 : 0;
    const firstLineY = afterLastTableY + extraGap + minusExtraGap;
    const imageCenterX = imageLeftMargin + imageWidth / 2;
    const textStartX = imageCenterX - 15;
    const lineSpacing = 5;

    doc.setFont("courier", "normal");
    doc.text("1. All dimensions are in mm. 2. All cutting angles are at 45 deg.", textStartX, firstLineY + lineSpacing * 1);
    doc.text("3. Deburring And/Or Annealing required. 5. The weights are Approx.", textStartX, firstLineY + lineSpacing * 2);
    doc.text(`4. NET C/S(sq mm):${coreData.designedCoreArea}   Material : ${twoWindings.data.core.coreMaterial}`, textStartX, firstLineY + lineSpacing * 3);
    doc.text(`5. Gross C/s = ${coreData.coreArea}    Stack factor = 0.97`, textStartX, firstLineY + lineSpacing * 4);

    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  }

  const coreAssemblyGeneratePDF = () => {

    const coreBladeTypeMap = {
      "CRUSI_3": "3Crusi",
      "BLADE_4": "4Blade",
      "CRUSI_4": "4Crusi",
      "BLADE_3": "3Blade"
    };

    const coreBladeType = coreBladeTypeMap[coreData.eCoreBladeType];

    const PDFData = {
      data1: `${twoWindings.data.lowVoltage
        } / ${twoWindings.data.highVoltage
        }V, Hz:${twoWindings.data.frequency}, ${twoWindings.data.kVA}kVA`,
      data2: `CORE Size: ${twoWindings.data.core.coreDia
        } / ${twoWindings.data.core.limbHt
        } / ${twoWindings.data.core.cenDist}, ${coreBladeType}`,
    };

    const tableSize = coreData.coreFormulas.noOfSteps;
    const tableBodyPart1 = [
      ["Stack Step No", ...coreData.bldStacks.slice(0, tableSize).map(row => `${row.stepNo}`)],
      ["Width     (mm)", ...coreData.bldStacks.slice(0, tableSize).map(row => `${row.width}`)],
      ["Step Ht   (mm)", ...coreData.bldStacks.slice(0, tableSize).map(row => `${row.stack}`)]
    ];

    const tableFontSize = coreData.coreFormulas.noOfSteps >= 16 ? 8.5 : 10;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const marginX = 125;
    const marginY = 15;
    const imageWidth = 75;
    let imageHeight = 55;
    const imageLeftMargin = 30;
    let spaceBelowImage = 30;
    const tableLeftMargin = 20;
    let images = "";
    doc.setFontSize(11);
    doc.setFont("courier", 'bold');
    doc.text("Design Ref:", marginX, marginY);
    doc.setFont("courier", 'normal');
    doc.setTextColor(0, 0, 0);

    const coreTitleY = marginY + 15;
    const data1Y = coreTitleY + 5.5;
    const data2Y = data1Y + 5.5;

    doc.text("CORE Details for Transformer", 45, coreTitleY);
    doc.text(PDFData.data1, 45, data1Y);
    doc.text(PDFData.data2, 45, data2Y);

    const imageStartY = data2Y + 20;
    if (coreData.eCoreBladeType === "CRUSI_3" || coreData.eCoreBladeType === "BLADE_3") {
      images = assembly1;
    } else if (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") {
      images = assembly2;
      imageHeight = imageHeight + 30;
      spaceBelowImage = spaceBelowImage - 20;
    }
    doc.addImage(images, "PNG", imageLeftMargin, imageStartY, imageWidth, imageHeight);


    const tableStartY = imageStartY + imageHeight + spaceBelowImage;

    autoTable(doc, {
      startX: tableLeftMargin,
      startY: tableStartY,
      theme: 'plain',
      styles: {
        font: 'courier',
        fontSize: tableFontSize,
        cellPadding: 0.2,
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        //lineWidth: 0.25,
        lineWidth: 0,
      },
      bodyStyles: {
        fontSize: tableFontSize,
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fontWeight: 'normal',
        halign: "right",
        font: 'courier',
        cellPadding: { top: 0.3, bottom: 0.3, left: 0.5, right: 1 },
      },
      margin: { left: tableLeftMargin, right: marginY },
      body: tableBodyPart1,

      didDrawPage: (data) => {
        const finalY = data.cursor.y + 15;
        doc.setFontSize(11);
        doc.setFont("courier", "normal");
        const lines = [
          "TOTAL CROSS-SECTION (sqcm)\t     :" + coreData.coreArea,
          "EFFECTIVE CROSS-SECTION(sqcm)\t  :" + coreData.designedCoreArea,
          "HIGHEST V/F CONDITION %\t\t:12.5 %",
          "NORMAL FLUX DENSITY\t\t    :" + twoWindings.data.lvFormulas.revisedFluxDensity.toFixed(3) + "T",
          "HIGHEST FLUX DENSITY Under V/F Condn.  :" + ((twoWindings.data.lvFormulas.revisedFluxDensity * 1.125).toFixed(3) + "T"),
          "SATURATION LEVEL FOR THE CORE MATERIAL :20,500 guass",
          "VOLTS per TURN :" + twoWindings.data.lvFormulas.revisedVoltsPerTurn + "     Weight Of CORE :" + coreData.coreWeight + "kg",
          "NO-LOAD Current:" + twoWindings.data.nlcurrentPercentage + "%  NO-LOAD Loss :" + twoWindings.data.hvFormulas.coreLoss + "kW"
        ];

        lines.forEach((line, index) => {
          doc.text(line, tableLeftMargin, finalY + index * 4)
        });
      },

      didParseCell: function (data) {
        if (data.column.index === 0 && data.section == "body") {
          data.cell.styles.cellWidth = 33;
          if (tableSize >= 16) {
            data.cell.styles.cellWidth = 26;
          }
          data.cell.styles.halign = "left";
          data.cell.styles.cellPadding = { top: 0.3, bottom: 0.3, left: 0, right: 0 };
        }
        if (data.column.index !== 0 && data.section == "body") {
          data.cell.styles.cellWidth = 10;
          if (tableSize >= 18) {
            data.cell.styles.cellWidth = 7;
          }
        }
      },

    });

    const pdfBlobUrl = doc.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  };

  const handleSaveThisDesign = () => {
    console.log("lom selector:", lom);
    console.log("twoWindings?.data?.designId:", twoWindings?.data?.designId);
    let entityId = "";
    if (twoWindings?.data?.designId) {
      entityId = design?.data?.data?.filter(
        (item) => item.designId == twoWindings?.data?.designId
      )[0]?.id;
    }
    console.log("entityId:", entityId);
    let payload = design?.data?.data?.filter(
      (item) => item.designId == twoWindings?.data?.designId
    )[0];
    payload.lom = JSON.stringify(lom?.data);
    console.log("entity payload:", payload);
    actions.addEntity(payload, "design", true);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [customerName, setCustomerName] = useState(customer?.data?.customerName);
  const [customerPlace, setCustomerPlace] = useState(customer?.data?.customerPlace);


  const handleSave = () => {
    setIsEditing(false);
    actions.addCustomer({
      customerName: customerName,
      customerPlace: customerPlace
    });

  };
  console.log("twoWindings.data.innerWindings.isEnamel:", twoWindings.data.innerWindings.isEnamel);
  return (
    <Layout id={id} isThinHeader={true} headProps={{
      currentPath: twoWindings.data.designId,
    }}>
      <div className="row m-1">
        <div className="col-sm-9 mt-3">
          <Container bgColor="white" padding="20px" borderRadius="5px" margin="0 0 18px 0">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flex: 1
              }}>
                {/* Customer Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                  <label style={{ fontWeight: 600, fontSize: 16 }}>Customer Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        fontSize: 16
                      }}
                    />
                  ) : (
                    <span>{customerName}</span>
                  )}
                </div>

                {/* Customer Place */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                  <label style={{ fontWeight: 600, fontSize: 16 }}>Customer Place:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={customerPlace}
                      onChange={e => setCustomerPlace(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        fontSize: 16
                      }}
                    />
                  ) : (
                    <span>{customerPlace}</span>
                  )}
                </div>
              </div>

              {/* Icon Button */}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? <FaCheckSquare size={20} /> : <FaEdit size={20} />}
              </div>
            </div>
          </Container>
          <Container bgColor="white" padding="20px" borderRadius="5px">
            <FlexContainer justify="space-between" align="center">
              <TextTypo text="Details" fontSize="22px" fontWeight="600" />
              <div className="search-container" style={{ width: "50%" }}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  style={{ backgroundColor: "#EEEEF1" }}
                  placeholder="Search"
                />
              </div>
            </FlexContainer>

            {accordions.map(({ key, title, content }) => (
              <Container
                key={key}
                bgColor={openAccordions[key] ? "white" : "#EEEEF1"}
                border="0.5px solid #00000033"
                padding="10px"
                borderRadius="3px"
                margin="20px 0px"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleAccordion(key)}
                >
                  <h5>{title}</h5>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "16px",
                    }}
                  >
                    {openAccordions[key] ? (
                      <IoIosArrowUp size={23} />
                    ) : (
                      <IoIosArrowDown size={23} />
                    )}
                  </button>
                </div>
                {openAccordions[key] && (
                  <div style={{ marginTop: "10px" }}>
                    {content === "table" ? <LomTable /> : <p>{content}</p>}
                  </div>
                )}
              </Container>
            ))}
            <BorderStyled borderColor="#000000CC" />
            <FlexContainer justify="end" margin="20px 0px">
              <OutlinedBtn
                text="Discard"
                borderRadius="5px"
                padding="15px 30px"
              />
              <FilledBtn
                text="Save this Design"
                onClick={handleSaveThisDesign}
                bgColor="#1B1B1B"
                fontColor="white"
                borderRadius="5px"
                padding="15px 30px"
              />
            </FlexContainer>
          </Container>
        </div>
        <div className="col-md-3 mt-3">
          <Container bgColor="white" padding="20px" borderRadius="5px">
            <TextTypo
              text="Download Options"
              fontSize="22px"
              fontWeight="600"
            />
            <FlexContainer direction="column" margin="20px 0px">
              <IconBtn
                text="Des. Prnt Out"
                icon={<FiDownload />}
                onClick={desGeneratePDF}
                bgColor="#D2E7FF"
              />
              <IconBtn
                text="GTP"
                onClick={gtpGeneratePDF}
                icon={<FiDownload />}
                bgColor="#EADFE7"
              />
              <IconBtn
                text="Core Assembly"
                onClick={coreAssemblyGeneratePDF}
                icon={<FiDownload />}
                bgColor="#FFF6E9"
              />
              <IconBtn
                text="Core Blade"
                onClick={coreBladeGeneratePDF}
                icon={<FiDownload />}
                bgColor="#E6F1FF"
              />
              <IconBtn
                text="LOM"
                icon={<FiDownload />}
                bgColor="#D2E7FF"
                onClick={generateLomPDF}
              />
              <IconBtn
                text="Tank"
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_Tank_GAD.pdf`,
                    "_blank"
                  );
                }}
                icon={<FiDownload />}
                bgColor="#EADFE7"
              />
              <IconBtn
                text="ActivePart"
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_ActivePart_GAD.pdf`,
                    "_blank"
                  );
                }}
                icon={<FiDownload />}
                bgColor="#FFF6E9"
              />
              <IconBtn
                text="Conservator"
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_Conservator.pdf`,
                    "_blank"
                  );
                }}
                icon={<FiDownload />}
                bgColor="#E6F1FF"
              />
              <IconBtn
                text="Lid"
                icon={<FiDownload />}
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_Lid.pdf`,
                    "_blank"
                  );
                }}
                bgColor="#D2E7FF"
              />
              <IconBtn
                text="MainAssembly_GAD"
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_MainAssembly_GAD.pdf`,
                    "_blank"
                  );
                }}
                icon={<FiDownload />}
                bgColor="#eadfe7"
              />
              <IconBtn
                text="Rating Plate"
                onClick={() => {
                  window.open(
                    `https://transformer.treffertech.com/000_delivery/${twoWindings.data.designId}/${twoWindings.data.designId}_Rating_plate.pdf`,
                    "_blank"
                  );
                }}
                icon={<FiDownload />}
                bgColor="#FFF6E9"
              />
            </FlexContainer>
            <IconBtn
              text="Print All"
              icon={<FiDownload />}
              fontColor="#1400FA"
            />
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default Files;
