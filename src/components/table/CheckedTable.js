import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { CiLogin } from "react-icons/ci";
import { useSelector } from "react-redux";
import { selectEntity } from "../../selectors/EntitySelector";
import { addCalcFullfiled } from "../../actions/CalcActions";
import { useActions } from "../../app/use-Actions";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import { deleteEntity } from "../../actions/EntityActions";
import {
  fetchFileFullfiled,
  fetchFileFailed,
} from "../../actions/FileActions";

const styleCell = {
  fontSize: "16px",
  fontWeight: "600",
  padding: "10px",
};

const styleRow = {
  fontSize: "14px",
  fontWeight: "400",
  padding: "8px",
};

const linkCell = {
  color: "#0056b3",
  cursor: "pointer",
  textDecoration: "underline",
};

export default function CheckedTable({ rows, setSelectedDesigns }) {
  const navigate = useNavigate();
  const actions = useActions({ addCalcFullfiled, deleteEntity,fetchFileFullfiled });
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = React.useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.map((row) => row.id);
      setSelected(newSelected);
      setSelectedDesigns(newSelected);
      return;
    }
    setSelected([]);
    setSelectedDesigns([]);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    
    setSelected(newSelected);
    setSelectedDesigns(newSelected);
  };

  // const handleTrashClose = () => setOpen(false);

  // const handleDeleteEntities = () => {
  //   if (selectedId) {
  //     actions.deleteEntity(selectedId, "design");
  //     setOpen(false);
  //   }
  // };

  const handleExistingDesignClick = (row) => {
    if (row) {
      if (row?.twoWindings) {
        const designData = JSON.parse(row?.twoWindings);
        let metadata = {}
        metadata.designId = row.designId;
        metadata.createdAt = row.createdAt;
        actions.addCalcFullfiled("2windings", designData, metadata);
      }
      if (row?.core) {
        const coreData = JSON.parse(row?.core);
        actions.addCalcFullfiled("core", coreData);
      }
      if (row?.fabrication) {
        const coreData = JSON.parse(row?.fabrication);
        actions.addCalcFullfiled("fabrication", coreData);
      }
      if (row?.lom) {
        const lomData = JSON.parse(row?.lom);
        actions.fetchFileFullfiled({ data: lomData });
      }
      navigate("/2windings/" + row?.id);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: "#F4F4F4" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selected.length > 0 && selected.length < rows.length
                }
                checked={rows.length > 0 && selected.length === rows.length}
                onChange={handleSelectAllClick}
              />
            </TableCell>
            <TableCell sx={styleCell}>DATE</TableCell>
            <TableCell sx={styleCell}>DESIGN REF.</TableCell>
            <TableCell sx={styleCell}>CAPACITY(kVA)</TableCell>
            <TableCell sx={styleCell}>VOLTAGE</TableCell>
            <TableCell sx={styleCell}>IMPEDANCE</TableCell>
            <TableCell sx={styleCell}>FRAME</TableCell>
            <TableCell sx={styleCell}>VOLTS/TURN</TableCell>
            <TableCell sx={styleCell}>CORE/LOAD LOSS</TableCell>
            <TableCell sx={styleCell}>COST(Rs)</TableCell>
            {/* <TableCell sx={styleCell}>FILE</TableCell> */}
            <TableCell sx={styleCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const designData = JSON.parse(row.twoWindings);

            return (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onClick={() => handleClick(row.id)}
                  />
                </TableCell>
                <TableCell sx={styleRow}>
                  {row.updatedAt
                    ? new Date(row.updatedAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, // 24-hour format
                    })
                    : new Date(row.createdAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, // 24-hour format
                    })}
                </TableCell>
                <TableCell
                  sx={linkCell}
                  onClick={() => handleExistingDesignClick(row)}
                >
                  {row.designId}
                </TableCell>
                <TableCell sx={styleRow}>{designData?.kVA}</TableCell>
                <TableCell sx={styleRow}>
                  {designData?.lowVoltage}/{designData?.highVoltage}
                </TableCell>
                <TableCell sx={styleRow}>{designData?.ez}</TableCell>
                <TableCell sx={styleRow}>
                  {`${designData?.core?.coreDia} x
                  ${designData?.core?.limbHt} x 
                  ${designData?.core?.cenDist}`}
                </TableCell>
                <TableCell sx={styleRow}>{designData?.voltsPerTurn}</TableCell>
                <TableCell
                  sx={styleRow}
                >{`${designData?.coreLoss}/${designData?.loadLoss}`}</TableCell>
                <TableCell sx={styleRow}>
                  {designData?.cost?.capitalCost}
                </TableCell>
                {/* <TableCell sx={styleRow}>
                  <span className="text-primary">
                    <CiLogin /> View
                  </span>
                </TableCell> */}
                {/* <TableCell sx={styleRow}>
                  <FaRegTrashAlt
                    onClick={() => handleOpenDeleteDialog(row.id)}
                    style={{ cursor: "pointer" }}
                  />
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* <ConfirmationDialog
        isDelete={true}
        open={open}
        handleClose={handleTrashClose}
        handleAgree={handleDeleteEntities}
        message="This cannot be undone and the item gets deleted permanently."
      /> */}
    </TableContainer>
  );
}
