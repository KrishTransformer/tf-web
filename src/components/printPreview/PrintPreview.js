import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import FlexContainer from "../flexbox/FlexContainer";
import TextTypo from "../textTypo/TextTypo";
import Container from "../container/Container";
import core1 from "../../assets/core1.png";
import core2 from "../../assets/core2.png";
import core3 from "../../assets/core3.png";
import core4_1 from "../../assets/core4.1.png";
import core4_2 from "../../assets/core4.2.png";
import core4_3 from "../../assets/core4.3.png";
import core4_4 from "../../assets/core4.4.png";

import { useSelector } from "react-redux";
import { selectCalc } from "../../selectors/CalcSelector";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PrintPreview = ({
  open,
  onClose,
  title = "Modal",
  children,
  coreData,
}) => {
  const { twoWindings } = useSelector(selectCalc);
  const isDarkMode = localStorage.getItem("appTheme") === "dark";
  const previewTheme = {
    modalBg: isDarkMode ? "#172233" : "#ffffff",
    modalBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#000000",
    text: isDarkMode ? "#edf4ff" : "#111111",
    mutedText: isDarkMode ? "#9eb0ca" : "#333333",
    summaryBg: isDarkMode ? "#203147" : "#ebebeb",
    sectionBg: isDarkMode ? "#172233" : "#ffffff",
    tableHeadBg: isDarkMode ? "#263a54" : "#f4f4f4",
    tableHeadCellBg: isDarkMode ? "#304865" : "#e0e0e0",
    tableRowAlt: isDarkMode ? "#1d2b40" : "#f9f9f9",
    tableRow: isDarkMode ? "#172233" : "#ffffff",
    tableTotalBg: isDarkMode ? "#25476b" : "#d9edf7",
    tableBorder: isDarkMode ? "rgba(255, 255, 255, 0.16)" : "#000000",
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    height: "92vh",
    bgcolor: previewTheme.modalBg,
    border: `0.5px solid ${previewTheme.modalBorder}`,
    boxShadow: 24,
    borderRadius: "10px",
    pr: 0,
    minWidth: 500,
    display: "flex",
    flexDirection: "column",
    color: previewTheme.text,
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 10px 0px 20px",
  };

  const bodyStyle = {
    flex: 1,
    minHeight: 0,
    paddingBottom: "10px",
    margin: "5px 20px",
    bgcolor: previewTheme.modalBg,
    color: previewTheme.text,
    position: "relative",
    overflowY: "auto",
  };

  const table1Stacking = coreData?.centerLimbStacking;
  const table2Stacking = coreData?.eCoreBladeType === "CRUSI_3" || coreData?.eCoreBladeType === "BLADE_3"
    ? coreData?.yokeStacking
    : coreData?.sideLimbStacking;
  const table3Stacking = coreData?.eCoreBladeType === "CRUSI_3" || coreData?.eCoreBladeType === "BLADE_3"
    ? coreData?.sideLimbStacking
    : coreData?.doubleNotchStacking;
  const table4Stacking = coreData?.singleNotchStacking;

  const weightIndex = coreData.eCoreBladeType === "CRUSI_3" ? 5 : 4;
  const table1TotalWeight = table1Stacking?.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0) || 0;
  const table2TotalWeight = table2Stacking?.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0) || 0;
  const table3TotalWeight = table3Stacking?.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0) || 0;
  const table4TotalWeight = table4Stacking?.reduce((sum, row) => sum + (parseFloat(row[weightIndex]) || 0), 0) || 0;

  const totalWeight = (coreData.eCoreBladeType === "CRUSI_3" || coreData.eCoreBladeType === "BLADE_3")
    ? (table1TotalWeight + table2TotalWeight + table3TotalWeight).toFixed(2) :
    (table1TotalWeight + table2TotalWeight + table3TotalWeight + table4TotalWeight).toFixed(2);

  const tableHead = coreData.eCoreBladeType === "CRUSI_3"
    ? ["Step\n  No.", "Len A\n  mm", "Len B\n  mm", "Width\n mm", "Stack\n mm", "Weight\n   kg"]
    : ["Step\n  No.", "Length\n  mm", "Width\n mm", "Stack\n mm", "Weight\n   kg"];

  const coreImage1 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_1 : core1;
  const coreImage2 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_2 : core2;
  const coreImage3 = (coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") ? core4_3 : core3;
  const imageHeight = "55vh";

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          <div id="custom-modal-title" />
          <IconButton aria-label="close" onClick={onClose}>
            <IoMdClose color={previewTheme.text} />
          </IconButton>
        </Box>
        <Box sx={bodyStyle}>
          <Container
            margin="0px 0px"
            bgColor={previewTheme.summaryBg}
            padding="20px"
            borderRadius="5px"
          >
            <FlexContainer align="center" direction="column">
              <FlexContainer align="center" direction="column">
                <TextTypo text={`CORE Details for Transformer`} fontColor={previewTheme.text} />
                <TextTypo
                  text={`Voltage : ${twoWindings?.data?.lowVoltage}V / 
                                ${twoWindings?.data?.highVoltage}V,    Frequency : ${twoWindings?.data?.frequency}Hz`}
                  fontColor={previewTheme.text}
                />
                <TextTypo
                  text={`Core Size : ${twoWindings?.data?.core?.coreDia} / 
                                ${twoWindings?.data?.core?.limbHt} / 
                                ${twoWindings?.data?.core?.cenDist},    kVA : ${twoWindings?.data?.kVA}`}
                  fontColor={previewTheme.text}
                />
              </FlexContainer>
            </FlexContainer>
          </Container>
          <div style={{ width: "100%", minHeight: "100%", padding: "30px", boxSizing: "border-box" }}>

            {/* table1 */}
            <div className="d-flex" style={{ marginTop: "30px", alignItems: "center", gap: "30px", flexWrap: "wrap", }} >

              <img src={coreImage1} alt="Core 1" style={{
                width: "20vw", height: imageHeight,
                maxWidth: "100%", objectFit: "contain", flexShrink: 0,
              }} />

              <div style={{ flex: 1, minWidth: "300px" }}>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse", }} >
                  <thead style={{ backgroundColor: previewTheme.tableHeadBg, color: previewTheme.text }}>
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: `1px solid ${previewTheme.tableBorder}`,
                            backgroundColor: previewTheme.tableHeadCellBg,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table1Stacking
                      ?.filter(row =>
                        row.some(value => value !== "" && value !== null && value !== undefined)
                      )
                      .map((row, index) => (
                        <tr
                          key={index}
                          style={{
                            cursor: "pointer",
                            backgroundColor: index % 2 === 0 ? previewTheme.tableRowAlt : previewTheme.tableRow,
                            color: previewTheme.text,
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: `1px solid ${previewTheme.tableBorder}` }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    {/* Grand Total Row */}
                    <tr style={{ fontWeight: "bold", backgroundColor: previewTheme.tableTotalBg, color: previewTheme.text }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: `1px solid ${previewTheme.tableBorder}`,
                          textAlign: "right",
                          paddingRight: "15px",
                        }}
                      >
                        Grand Total = {table1TotalWeight.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            {/* table2 */}
            <div className="d-flex" style={{ marginTop: "30px", alignItems: "center", gap: "30px", flexWrap: "wrap", }} >

              <img src={coreImage2} alt="Core 2" style={{
                width: "20vw", height: imageHeight,
                maxWidth: "100%", objectFit: "contain", flexShrink: 0,
              }} />


              <div style={{ flex: 1, minWidth: "300px" }}>
                <table
                  border="1"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: previewTheme.tableHeadBg,
                      color: previewTheme.text,
                    }}
                  >
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: `1px solid ${previewTheme.tableBorder}`,
                            backgroundColor: previewTheme.tableHeadCellBg,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table2Stacking
                      ?.filter(row =>
                        row.some(value => value !== "" && value !== null && value !== undefined)
                      )
                      .map((row, index) => (
                        <tr
                          key={index}
                          style={{
                            cursor: "pointer",
                            backgroundColor: index % 2 === 0 ? previewTheme.tableRowAlt : previewTheme.tableRow,
                            color: previewTheme.text,
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: `1px solid ${previewTheme.tableBorder}` }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: previewTheme.tableTotalBg, color: previewTheme.text }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: `1px solid ${previewTheme.tableBorder}`,
                          textAlign: "right",
                          paddingRight: "15px",
                        }}
                      >
                        Grand Total = {table2TotalWeight.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            {/* table3 */}
            <div className="d-flex" style={{ marginTop: "30px", alignItems: "center", gap: "30px", flexWrap: "wrap", }} >

              <img src={coreImage3} alt="Core 3" style={{
                width: "20vw", height: imageHeight,
                maxWidth: "100%", objectFit: "contain", flexShrink: 0,
              }} />



              <div style={{ flex: 1, minWidth: "300px" }}>
                <table
                  border="1"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: previewTheme.tableHeadBg,
                      color: previewTheme.text,
                    }}
                  >
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: `1px solid ${previewTheme.tableBorder}`,
                            backgroundColor: previewTheme.tableHeadCellBg,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table3Stacking
                      ?.filter(row =>
                        row.some(value => value !== "" && value !== null && value !== undefined)
                      )
                      .map((row, index) => (
                        <tr
                          key={index}
                          style={{
                            cursor: "pointer",
                            backgroundColor: index % 2 === 0 ? previewTheme.tableRowAlt : previewTheme.tableRow,
                            color: previewTheme.text,
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: `1px solid ${previewTheme.tableBorder}` }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: previewTheme.tableTotalBg, color: previewTheme.text }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: `1px solid ${previewTheme.tableBorder}`,
                          textAlign: "right",
                          paddingRight: "15px",
                        }}
                      >
                        Grand Total = {table3TotalWeight.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* table4 */}
            {(coreData.eCoreBladeType === "CRUSI_4" || coreData.eCoreBladeType === "BLADE_4") && (
              <div
                className="d-flex"
                style={{
                  marginTop: "30px",
                  alignItems: "center",
                  gap: "30px",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={core4_4}
                  alt="Core 4.4"
                  style={{
                    width: "20vw",
                    height: imageHeight,
                    maxWidth: "100%",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: "300px" }}>
                  <table
                    border="1"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: previewTheme.tableHeadBg,
                        color: previewTheme.text,
                      }}
                    >
                      <tr>
                        {tableHead.map((head, index) => (
                          <th
                            key={index}
                            style={{
                              padding: "10px",
                              border: `1px solid ${previewTheme.tableBorder}`,
                              backgroundColor: previewTheme.tableHeadCellBg,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table4Stacking
                        ?.filter(row =>
                          row.some(
                            value =>
                              value !== "" && value !== null && value !== undefined
                          )
                        )
                        .map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              cursor: "pointer",
                              backgroundColor: index % 2 === 0 ? previewTheme.tableRowAlt : previewTheme.tableRow,
                              color: previewTheme.text,
                            }}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                style={{ padding: "8px", border: `1px solid ${previewTheme.tableBorder}` }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      <tr style={{ fontWeight: "bold", backgroundColor: previewTheme.tableTotalBg, color: previewTheme.text }}>
                        <td
                          colSpan="6"
                          style={{
                            padding: "8px",
                            border: `1px solid ${previewTheme.tableBorder}`,
                            textAlign: "right",
                            paddingRight: "15px",
                          }}
                        >
                          Grand Total = {table4TotalWeight.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center", fontSize: "16px", color: previewTheme.text }}>
              Total Weight: {totalWeight} kg
            </div>



            {/* <div className="d-flex justify-content-end gap-2 mt-2">
              <button className="btn btn-dark" onClick={generatePDF}>
                Print
              </button>
            </div> */}

          </div>
        </Box>
      </Box>
    </Modal>
  );
};

export default PrintPreview;
