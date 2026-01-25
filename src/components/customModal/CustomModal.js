import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import FlexContainer from "../flexbox/FlexContainer";
import TextTypo from "../textTypo/TextTypo";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "#fff",
  border: "0.5px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 0,
  minWidth: 500,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 20px 0px 20px",
};

const bodyStyle = {
  padding: "0px 20px 20px 20px",
};

const CustomModal = ({
  open,
  onClose,
  title = "Modal",
  children,
  onModalSubmit,
  showButtons = true,
}) => {
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
          <TextTypo text={title} id="custom-modal-title" fontSize="20px" />
          <IconButton aria-label="close" onClick={onClose}>
            <IoMdClose color="#333" />
          </IconButton>
        </Box>
        <Box sx={bodyStyle}>{children}</Box>
        {showButtons ? (
          <FlexContainer justify="end" align="center" margin="20px">
            <button
              className="bg-transparent rounded btn-block w-100 py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-dark rounded btn-block w-100 py-2"
              onClick={onModalSubmit}
            >
              OK
            </button>
          </FlexContainer>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;
