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
import ProfileLayout from "../../components/layout/ProfileLayout";
import ConfirmationDialog from "../../components/DeletingConfirmation";
import CircularProgress from "@mui/material/CircularProgress";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchEntity,
  addEntity,
  deleteEntity,
  updateEntity
} from "../../actions/EntityActions";
import { useActions } from "../../app/use-Actions";
import { useSelector } from "react-redux";
import { selectEntity } from "../../selectors/EntitySelector";


const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { users } = useSelector(selectEntity);
  const actions = useActions({
    addEntity,
    fetchEntity,
    deleteEntity,
    updateEntity
  });

  useEffect(() => {
    actions.fetchEntity("users", `offset=0&size=10&sortAttribute=createdAt&sortOrder=ASC`);
  }, []);

  useEffect(() => {
    if (users?.data?.data) {
      const transformed = users.data.data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      }));
      setUsersData(transformed);
    }
  }, [users?.data]);

  //handler function for new data
  const handleAdd = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill all fields");
      return;
    }
    const payload = {
      name: newUser.name,
      email: newUser.email,
    };

    actions.addEntity(payload, "users", false);

    setNewUser({ name: "", email: "" });
    toast.success("New User added!");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedUser(usersData[index]);
  };

  // handler function for updating data
  const handleSave = () => {
    const updatedRow = {
      name: editedUser.name,
      email: editedUser.email,
    };

    const entityId = usersData[editIndex].id;
    actions.updateEntity(entityId, updatedRow, "users");

    setEditIndex(null);
    toast.success("User updated!");
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };


  const handleConfirmDelete = () => {
    if (selectedItem) {
      actions.deleteEntity(selectedItem.id, "users", true);
      toast.success("User deleted!");
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
        <h4>Users</h4>

        <div className="mb-3 d-flex gap-2">
          <CustomInput
            width="250px"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <CustomInput
            placeholder="Email"
            type="email"
            width="300px"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <FilledBtn
            onClick={handleAdd}
            text="Add User"
            width="130px"
            bgColor="#212529"
            fontColor="#ffffff"
          />
        </div>

        <Container bgColor="white" padding="0px" borderRadius="8px" boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)">
          {users?.isLoading ? ( // Show loading spinner if isLoading is true
            <FlexContainer align="center" justify="center" padding="15px">
              <CircularProgress style={{ marginRight: "150px" }} />
            </FlexContainer>) : (
              
            <TableContainer component={Paper}>
              <Table aria-label="users table" size="small" sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: "#F4F4F4" }}>
                  <TableRow>
                    <TableCell sx={{ width: 150 }}>Name</TableCell>
                    <TableCell sx={{ width: 100 }}>Email</TableCell>
                    <TableCell style={{ width: 150, textAlign: "center" }}>
                      Options
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersData.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {editIndex === index ? (
                          <CustomInput
                            value={editedUser.name}
                            onChange={(e) =>
                              setEditedUser({ ...editedUser, name: e.target.value })
                            }
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <CustomInput
                            value={editedUser.email}
                            onChange={(e) =>
                              setEditedUser({ ...editedUser, email: e.target.value })
                            }
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {editIndex === index ? (
                          <>
                            <FaSave
                              onClick={handleSave}
                              style={{ cursor: "pointer", marginRight: 10 }}
                            />
                            <FaBan
                              onClick={() => setEditIndex(null)}
                              style={{ cursor: "pointer" }}
                            />
                          </>
                        ) : (
                          <>
                            <FaEdit
                              onClick={() => handleEdit(index)}
                              style={{ cursor: "pointer", marginRight: 10 }}
                            />
                            <FaRegTrashAlt
                              onClick={() => handleDeleteClick(user)}
                              style={{ cursor: "pointer" }}
                            />
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

export default Users;
