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
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  height: "90vh",
  bgcolor: "#fff",
  border: "0.5px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  pr: 0,
  minWidth: 500,

};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 10px 0px 20px",
};

const bodyStyle = {
  paddingBottom: "10px",
  margin: "5px 20px",
  bgcolor: "#fff",
  //   borderRadius: "10px",
  position: "relative",
  // overflow: "hidden",
  overflowY: "auto"
};

const PrintPreview = ({
  open,
  onClose,
  title = "Modal",
  children,
  coreData,
}) => {
  const { twoWindings } = useSelector(selectCalc);

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
          <TextTypo
            text="PDF VIEWER"
            id="custom-modal-title"
            fontSize="20px"
            fontColor="white"
          />
          <TextTypo
            text="Zoom in"
            id="custom-modal-title"
            fontSize="20px"
            fontColor="white"
          />
          <TextTypo
            text="Zoom out"
            id="custom-modal-title"
            fontSize="20px"
            fontColor="white"
          />
          <TextTypo
            text="Download Options"
            id="custom-modal-title"
            fontSize="20px"
            fontColor="white"
          />
          <IconButton aria-label="close" onClick={onClose}>
            <IoMdClose color="#000" />
          </IconButton>
        </Box>
        <Box sx={bodyStyle}>
          <Container
            margin="0px 0px"
            bgColor="#ebebeb"
            padding="20px"
            borderRadius="5px"
          >
            <FlexContainer align="center" direction="column">
              <FlexContainer align="center" direction="column">
                <TextTypo text={`CORE Details for Transformer`} />
                <TextTypo
                  text={`Voltage : ${twoWindings?.data?.lowVoltage}V / 
                                ${twoWindings?.data?.highVoltage}V,    Frequency : ${twoWindings?.data?.frequency}Hz`}
                />
                <TextTypo
                  text={`Core Size : ${twoWindings?.data?.core?.coreDia} / 
                                ${twoWindings?.data?.core?.limbHt} / 
                                ${twoWindings?.data?.core?.cenDist},    kVA : ${twoWindings?.data?.kVA}`}
                />
              </FlexContainer>
            </FlexContainer>
          </Container>
          <div style={{ height: "40vh", padding: "30px" }}>

            {/* table1 */}
            <div className="d-flex" style={{ marginTop: "30px", alignItems: "center", gap: "30px", flexWrap: "wrap", }} >

              <img src={coreImage1} alt="Core 1" style={{
                width: "20vw", height: imageHeight,
                maxWidth: "100%", objectFit: "contain", flexShrink: 0,
              }} />

              <div style={{ flex: 1, minWidth: "300px" }}>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse", }} >
                  <thead style={{ backgroundColor: "#f4f4f4", color: "#333", }}>
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: "1px solid black",
                            backgroundColor: "#e0e0e0",
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
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: "1px solid black" }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    {/* Grand Total Row */}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#d9edf7" }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: "1px solid black",
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
                      backgroundColor: "#f4f4f4",
                      color: "#333",
                    }}
                  >
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: "1px solid black",
                            backgroundColor: "#e0e0e0",
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
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: "1px solid black" }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#d9edf7" }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: "1px solid black",
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
                      backgroundColor: "#f4f4f4",
                      color: "#333",
                    }}
                  >
                    <tr>
                      {tableHead.map((head, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px",
                            border: "1px solid black",
                            backgroundColor: "#e0e0e0",
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
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{ padding: "8px", border: "1px solid black" }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#d9edf7" }}>
                      <td
                        colSpan="6"
                        style={{
                          padding: "8px",
                          border: "1px solid black",
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
                        backgroundColor: "#f4f4f4",
                        color: "#333",
                      }}
                    >
                      <tr>
                        {tableHead.map((head, index) => (
                          <th
                            key={index}
                            style={{
                              padding: "10px",
                              border: "1px solid black",
                              backgroundColor: "#e0e0e0",
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
                              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                style={{ padding: "8px", border: "1px solid black" }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      <tr style={{ fontWeight: "bold", backgroundColor: "#d9edf7" }}>
                        <td
                          colSpan="6"
                          style={{
                            padding: "8px",
                            border: "1px solid black",
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

            <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center", fontSize: "16px" }}>
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
