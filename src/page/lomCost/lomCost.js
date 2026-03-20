import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { FaEdit, FaSave, FaBan } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { CustomInput, FilledBtn, Container, FlexContainer } from "../../components";
import CircularProgress from "@mui/material/CircularProgress";
import Layout from "../../components/layout/Layout";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import { fetchEntity, addEntity, updateEntity } from "../../actions/EntityActions";
import { useActions } from "../../app/use-Actions";
import { useSelector } from "react-redux";
import { selectEntity } from "../../selectors/EntitySelector";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { putApi, postApi, deleteApi } from "../../api";
import { COMMON_SERVICE } from "../../constants/CommonConstants";
import defaultLomRateList from "../../resources/LomRatelist.json";
import "./lomCost.css";

const LomCost = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("appTheme") === "dark"
  );
  const [lomCost, setLomCost] = useState([]);
  const [newEntry, setNewEntry] = useState({ materialName: "", materialRate: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});
  const [isDefaultApplying, setIsDefaultApplying] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const { lomMaterial } = useSelector(selectEntity);
  const actions = useActions({
    addEntity,
    fetchEntity,
    updateEntity,
  });

  useEffect(() => {
    actions.fetchEntity("lomMaterial", "offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC");
  }, []);

  useEffect(() => {
    if (lomMaterial?.data?.data) {
      const transformed = lomMaterial.data.data.map((item) => ({
        id: item.id,
        materialName: item.materialName,
        materialRate: item.materialRate,
      }));
      setLomCost(transformed);
    }
  }, [lomMaterial?.data]);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("appTheme") === "dark";
    setIsDarkMode(darkModeEnabled);

    document.body.classList.toggle("app-dark-mode", darkModeEnabled);
    document.body.style.background = darkModeEnabled ? "#101722" : "#f4f7fb";
    document.documentElement.style.background = darkModeEnabled ? "#101722" : "#f4f7fb";

    return () => {
      document.body.classList.remove("app-dark-mode");
      document.body.style.background = "";
      document.documentElement.style.background = "";
    };
  }, []);

  const handleAdd = () => {
    if (!newEntry.materialName || !newEntry.materialRate) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      materialName: newEntry.materialName,
      materialRate: parseFloat(newEntry.materialRate),
    };

    actions.addEntity(payload, "lomMaterial", false);
    setNewEntry({ materialName: "", materialRate: "" });
    toast.success("Material added!");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedEntry(lomCost[index]);
  };

  const handleSave = () => {
    const updatedRow = {
      materialName: editedEntry.materialName,
      materialRate: parseFloat(editedEntry.materialRate),
    };

    const entityId = lomCost[editIndex].id;
    actions.updateEntity(entityId, updatedRow, "lomMaterial");
    setEditIndex(null);
    toast.success("Material updated!");
  };

  const handleSetRatesToDefault = async () => {
    if (!Array.isArray(defaultLomRateList) || defaultLomRateList.length === 0) {
      toast.error("Default rate list is empty.");
      return;
    }

    setIsDefaultApplying(true);

    try {
      const defaultsPayload = defaultLomRateList
        .map((item) => ({
          materialName: String(item.materialName || "").trim(),
          materialRate: parseFloat(item.materialRate),
        }))
        .filter((item) => item.materialName && Number.isFinite(item.materialRate));

      if (defaultsPayload.length === 0) {
        toast.error("Default rate list has no valid items.");
        return;
      }

      // Fetch full list to ensure replacement is complete, not page-limited.
      const existingResponse = await postApi(
        "/entity/v2/lomMaterial?offset=0&size=1000&sortAttribute=createdAt&sortOrder=ASC",
        {},
        {},
        {},
        COMMON_SERVICE
      );
      const existingRows = existingResponse?.data?.data || [];

      if (existingRows.length > 0) {
        await Promise.all(
          existingRows
            .filter((row) => row?.id)
            .map((row) => deleteApi(`/entity/lomMaterial/${row.id}`, COMMON_SERVICE))
        );
      }

      await Promise.all(
        defaultsPayload.map((payload) =>
          putApi("/entity/lomMaterial", payload, {}, {}, COMMON_SERVICE)
        )
      );

      actions.fetchEntity("lomMaterial", "offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC");
      toast.success("LOM rates reset to defaults.");
    } catch (error) {
      toast.error("Failed to reset default rates.");
    } finally {
      setIsDefaultApplying(false);
      setIsResetConfirmOpen(false);
    }
  };

  const lomTheme = {
    surface: "var(--lom-surface)",
    surfaceSoft: "var(--lom-surface-soft)",
    surfaceAlt: "var(--lom-surface-alt)",
    border: "var(--lom-border)",
    borderSoft: "var(--lom-border-soft)",
    text: "var(--lom-page-text)",
    muted: "var(--lom-page-muted)",
    headText: "var(--lom-table-head-text)",
    rowHover: "var(--lom-row-hover)",
    buttonBg: "var(--lom-btn-bg)",
    buttonText: "var(--lom-btn-text)",
  };

  return (
    <Layout hideSidebar>
      <ToastContainer />
      <div className={`lom-rate-page ${isDarkMode ? "lom-rate-page-dark" : ""}`}>
        <div className="lom-rate-header">
          <Button
            onClick={() => navigate("/home")}
            variant="outlined"
            startIcon={<IoHomeOutline />}
            className="lom-rate-home-btn"
          >
            Home
          </Button>
          <div className="lom-rate-heading-block">
            <h4 className="lom-rate-title">LOM Material Rate</h4>
            <p className="lom-rate-subtitle">
              Manage material names and per-unit rates used in calculations.
            </p>
          </div>
          <Button
            onClick={() => setIsResetConfirmOpen(true)}
            variant="contained"
            className="lom-rate-default-btn"
            disabled={isDefaultApplying}
          >
            {isDefaultApplying ? "Applying..." : "Set Rates to Default"}
          </Button>
        </div>

        <div className="lom-rate-form-card">
          <div className="lom-rate-form-grid">
            <CustomInput
              width="100%"
              placeholder="Material Name"
              value={newEntry.materialName}
              onChange={(e) => setNewEntry({ ...newEntry, materialName: e.target.value })}
            />
            <CustomInput
              width="100%"
              placeholder="Material Rate"
              value={newEntry.materialRate}
              onChange={(e) => setNewEntry({ ...newEntry, materialRate: e.target.value })}
            />
            <FilledBtn
              onClick={handleAdd}
              text="Add Material"
              width="100%"
              bgColor={lomTheme.buttonBg}
              fontColor={lomTheme.buttonText}
            />
          </div>
          <div className="lom-rate-count">
            Total materials: <strong>{lomCost?.length || 0}</strong>
          </div>
        </div>

        <Container
          bgColor={lomTheme.surface}
          padding="0px"
          borderRadius="12px"
          border={`1px solid ${lomTheme.borderSoft}`}
          boxShadow="var(--lom-shadow)"
        >
          {lomMaterial?.isLoading ? (
            <FlexContainer align="center" justify="center" padding="20px">
              <CircularProgress />
            </FlexContainer>
          ) : (
            <TableContainer component={Paper} className="lom-rate-table-wrap" sx={{ backgroundColor: lomTheme.surface, boxShadow: "none" }}>
              <Table aria-label="lom cost table" size="small">
                <TableHead sx={{ backgroundColor: lomTheme.surfaceSoft }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: lomTheme.headText }}>Material Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: lomTheme.headText }}>Material Rate (Rs.)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: lomTheme.headText }}>
                      Options
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lomCost && lomCost.length > 0 ? (
                    lomCost.map((item, index) => (
                      <TableRow
                        key={item.id || index}
                        sx={{
                          backgroundColor: lomTheme.surface,
                          "&:nth-of-type(even)": { backgroundColor: lomTheme.surfaceAlt },
                          "&:hover": { backgroundColor: lomTheme.rowHover },
                        }}
                      >
                        <TableCell>
                          {editIndex === index ? (
                            <TextField
                              type="text"
                              size="small"
                              fullWidth
                              value={editedEntry.materialName}
                              onChange={(e) =>
                                setEditedEntry({ ...editedEntry, materialName: e.target.value })
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "var(--app-input-bg)",
                                  color: "var(--app-input-text)",
                                  "& fieldset": { borderColor: "var(--app-input-border)" },
                                },
                                "& .MuiInputBase-input": { color: "var(--app-input-text)" },
                              }}
                            />
                          ) : (
                            item.materialName
                          )}
                        </TableCell>
                        <TableCell>
                          {editIndex === index ? (
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              value={editedEntry.materialRate}
                              onChange={(e) =>
                                setEditedEntry({ ...editedEntry, materialRate: e.target.value })
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "var(--app-input-bg)",
                                  color: "var(--app-input-text)",
                                  "& fieldset": { borderColor: "var(--app-input-border)" },
                                },
                                "& .MuiInputBase-input": { color: "var(--app-input-text)" },
                              }}
                            />
                          ) : (
                            `Rs. ${item.materialRate}`
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editIndex === index ? (
                            <>
                              <IconButton onClick={handleSave} size="small" sx={{ color: lomTheme.text }}>
                                <FaSave />
                              </IconButton>
                              <IconButton
                                onClick={() => setEditIndex(null)}
                                size="small"
                                sx={{ color: lomTheme.text }}
                              >
                                <FaBan />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                onClick={() => handleEdit(index)}
                                size="small"
                                sx={{ color: lomTheme.text }}
                                className="lom-rate-action-btn"
                              >
                                <FaEdit />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ padding: "28px 12px", color: lomTheme.muted }}>
                        No materials available. Add your first material rate above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>

        <ConfirmationDialog
          open={isResetConfirmOpen}
          handleClose={() => setIsResetConfirmOpen(false)}
          handleAgree={handleSetRatesToDefault}
          isLoading={isDefaultApplying}
          isDelete={false}
          message="This will replace all the rates to defualt, do you wish to continue?"
        />
      </div>
    </Layout>
  );
};

export default LomCost;
