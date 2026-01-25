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
  TextField,
} from "@mui/material";
import { FaEdit, FaSave, FaBan, FaRegTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { CustomInput, FilledBtn, Container, FlexContainer } from "../../components";
import CircularProgress from "@mui/material/CircularProgress";
import ProfileLayout from "../../components/layout/ProfileLayout";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import {
  fetchEntity,
  addEntity,
  deleteEntity,
  updateEntity
} from "../../actions/EntityActions";
import { useActions } from "../../app/use-Actions";
import { useSelector } from "react-redux";
import { selectEntity } from "../../selectors/EntitySelector";

const LomCost = () => {
  const [lomCost, setLomCost] = useState([]);
  const [newEntry, setNewEntry] = useState({ materialName: "", materialRate: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { lomMaterial } = useSelector(selectEntity);
  const actions = useActions({
    addEntity,
    fetchEntity,
    deleteEntity,
    updateEntity
  });

  useEffect(() => {
    actions.fetchEntity("lomMaterial", `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`);
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

  //handler function for new data
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

  // handler function for updating data
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

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };


  const handleConfirmDelete = () => {
    if (selectedItem) {
      actions.deleteEntity(selectedItem.id, "lomMaterial", true);
      toast.success("Material deleted!");
      setSelectedItem(null);
      setOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <ProfileLayout>
      <ToastContainer />
      <div className="container-full p-4" style={{ background: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <h4>LOM Material Rate</h4>

        <div className="mb-3 d-flex gap-2" style={{ marginBottom: 20 }}>
          <CustomInput
            width="250px"
            placeholder="Material Name"
            value={newEntry.materialName}
            onChange={(e) => setNewEntry({ ...newEntry, materialName: e.target.value })}
          />
          <CustomInput
            width="250px"
            placeholder="Material Rate"
            value={newEntry.materialRate}
            onChange={(e) => setNewEntry({ ...newEntry, materialRate: e.target.value })}
          />
          <FilledBtn
            onClick={handleAdd}
            text="Add Material"
            width="155px"
            bgColor="#212529"
            fontColor="#ffffff"
          />
        </div>

        <Container bgColor="white" padding="0px" borderRadius="8px" boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)">
          {lomMaterial?.isLoading ? ( // Show loading spinner if isLoading is true
            <FlexContainer align="center" justify="center" padding="15px">
              <CircularProgress style={{ marginRight: "150px" }} />
            </FlexContainer>) : (

            <TableContainer component={Paper}>
              <Table aria-label="lom cost table" size="small">
                <TableHead sx={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell>Material Name</TableCell>
                    <TableCell>Material Rate</TableCell>
                    <TableCell align="center">Options</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lomCost && lomCost.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>
                        {editIndex === index ? (
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            value={editedEntry.materialName}
                            onChange={(e) => setEditedEntry({ ...editedEntry, materialName: e.target.value })}
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
                            onChange={(e) => setEditedEntry({ ...editedEntry, materialRate: e.target.value })}
                          />
                        ) : (
                          `	₹${item.materialRate}`
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editIndex === index ? (
                          <>
                            <IconButton onClick={handleSave} size="small" sx={{ color: "black" }}>
                              <FaSave />
                            </IconButton>
                            <IconButton onClick={() => setEditIndex(null)} size="small" sx={{ color: "black" }}>
                              <FaBan />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => handleEdit(index)} size="small" sx={{ color: "black" }}>
                              <FaEdit />
                            </IconButton>
                            {/* <IconButton onClick={() => handleDeleteClick(item)} size="small" sx={{ color: "black" }}>
                              <FaRegTrashAlt style={{ cursor: "pointer" }} />
                            </IconButton> */}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)}
        </Container>

        <ConfirmationDialog
          isDelete={true}
          open={open}
          handleClose={handleCancelDelete}
          handleAgree={handleConfirmDelete}
          message="This cannot be undone and the item gets deleted permanently."
        />
      </div>
    </ProfileLayout>
  );
};

export default LomCost;