import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { addCalcFullfiled } from "../../actions/CalcActions";
import { useActions } from "../../app/use-Actions";
import { useNavigate } from "react-router-dom";
import {
  fetchFileFullfiled,
} from "../../actions/FileActions";

const safeJsonParse = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Invalid JSON value:", value, error);
    return fallback;
  }
};

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

const formatDisplayValue = (value, fallback = "-") => {
  return value === undefined || value === null || value === "" ? fallback : value;
};

const formatJoinedValues = (values, separator = "/") => {
  const filteredValues = values.filter(
    (value) => value !== undefined && value !== null && value !== ""
  );

  if (filteredValues.length === 0) {
    return "-";
  }

  return filteredValues.join(separator);
};

const isMultiWindingRow = (row) =>
  row?.designType === "multi" || (!row?.designType && !!row?.multiWindings);

const parseDesignData = (row) =>
  isMultiWindingRow(row)
    ? safeJsonParse(row?.multiWindings, {})
    : safeJsonParse(row?.twoWindings, {});

const getVoltageValue = (designData, isMultiWindingDesign) =>
  isMultiWindingDesign
    ? formatJoinedValues(
        [designData?.primaryVoltage, designData?.secondaryVoltage],
        "/"
      )
    : formatJoinedValues([designData?.lowVoltage, designData?.highVoltage], "/");

export default function CheckedTable({
  rows,
  selectedDesigns = [],
  setSelectedDesigns,
  isDarkMode = false,
}) {
  const navigate = useNavigate();
  const actions = useActions({ addCalcFullfiled, fetchFileFullfiled });
  const rowIds = rows?.map((row) => row.id) || [];
  const selectedCount = rowIds.filter((id) => selectedDesigns.includes(id)).length;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const mergedSelection = Array.from(
        new Set([...(selectedDesigns || []), ...rowIds])
      );
      setSelectedDesigns(mergedSelection);
      return;
    }
    setSelectedDesigns(
      (selectedDesigns || []).filter((selectedId) => !rowIds.includes(selectedId))
    );
  };

  const handleClick = (id) => {
    if (selectedDesigns.includes(id)) {
      setSelectedDesigns(selectedDesigns.filter((selectedId) => selectedId !== id));
      return;
    }

    setSelectedDesigns([...selectedDesigns, id]);
  };

  const handleExistingDesignClick = (row) => {
    if (row) {
      const isMultiWindingDesign = isMultiWindingRow(row);
      const calcName = isMultiWindingDesign ? "multiwindings" : "2windings";
      const routePath = isMultiWindingDesign ? "/multiwindings/" : "/2windings/";
      const designData = parseDesignData(row);

      sessionStorage.setItem("newDesignType", isMultiWindingDesign ? "multi" : "two");

      const metadata = {
        designId: row.designId,
        createdAt: row.createdAt,
        entityId: row.id,
      };

      if (designData && Object.keys(designData).length > 0) {
        actions.addCalcFullfiled(calcName, designData, metadata);
      }
      if (row?.core) {
        const coreData = safeJsonParse(row?.core, {});
        actions.addCalcFullfiled("core", coreData);
      }
      if (row?.fabrication) {
        const coreData = safeJsonParse(row?.fabrication, {});
        actions.addCalcFullfiled("fabrication", coreData);
      }
      if (row?.lom) {
        const lomData = safeJsonParse(row?.lom, []);
        actions.fetchFileFullfiled({ data: lomData });
      }
      navigate(routePath + row?.id);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: isDarkMode ? "#1a2534" : "#fafffe",
        color: isDarkMode ? "#edf3ff" : "#183d54",
        boxShadow: isDarkMode
          ? "0 18px 34px rgba(0, 0, 0, 0.35)"
          : undefined,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: isDarkMode ? "#243246" : "#dff4ec" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedCount > 0 && selectedCount < rowIds.length
                }
                checked={rowIds.length > 0 && selectedCount === rowIds.length}
                onChange={handleSelectAllClick}
                sx={{
                  color: isDarkMode ? "#8fb5ff" : "#247e84",
                  "&.Mui-checked": {
                    color: isDarkMode ? "#8fb5ff" : "#247e84",
                  },
                  "&.MuiCheckbox-indeterminate": {
                    color: isDarkMode ? "#8fb5ff" : "#247e84",
                  },
                }}
              />
            </TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>DATE</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>DESIGN REF.</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>CAPACITY(kVA)</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>VOLTAGE</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>IMPEDANCE</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>FRAME</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>VOLTS/TURN</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>CORE/LOAD LOSS</TableCell>
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}>COST(Rs)</TableCell>
            {/* <TableCell sx={styleCell}>FILE</TableCell> */}
            <TableCell sx={{ ...styleCell, color: isDarkMode ? "#edf3ff" : "#183d54" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isMultiWindingDesign = isMultiWindingRow(row);
            const designData = parseDesignData(row);
            const frameValue = formatJoinedValues(
              [designData?.core?.coreDia, designData?.core?.limbHt, designData?.core?.cenDist],
              " x "
            );
            const voltageValue = getVoltageValue(designData, isMultiWindingDesign);
            const lossesValue = formatJoinedValues(
              [designData?.coreLoss, designData?.loadLoss],
              "/"
            );

            return (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: isDarkMode ? "#1a2534" : "#fafffe",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#202f44" : "#eaf7f5",
                  },
                  "& td": {
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#cfe6e3",
                    color: isDarkMode ? "#d7e5ff" : "#183d54",
                  },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedDesigns.includes(row.id)}
                    onClick={() => handleClick(row.id)}
                    sx={{
                      color: isDarkMode ? "#8fb5ff" : "#247e84",
                      "&.Mui-checked": {
                        color: isDarkMode ? "#8fb5ff" : "#247e84",
                      },
                    }}
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
                  sx={{
                    ...linkCell,
                    color: isDarkMode ? "#8fb5ff" : "#0056b3",
                  }}
                  onClick={() => handleExistingDesignClick(row)}
                >
                  {row.designId}
                </TableCell>
                <TableCell sx={styleRow}>{formatDisplayValue(designData?.kVA)}</TableCell>
                <TableCell sx={styleRow}>{voltageValue}</TableCell>
                <TableCell sx={styleRow}>
                  {formatDisplayValue(
                    designData?.ez ?? designData?.commonFormulas?.ek
                  )}
                </TableCell>
                <TableCell sx={styleRow}>{frameValue}</TableCell>
                <TableCell sx={styleRow}>{formatDisplayValue(designData?.voltsPerTurn)}</TableCell>
                <TableCell sx={styleRow}>{lossesValue}</TableCell>
                <TableCell sx={styleRow}>
                  {formatDisplayValue(designData?.cost?.capitalCost)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
