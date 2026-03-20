import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { IoMdClose } from "react-icons/io";
import TextTypo from "../textTypo/TextTypo";
import "./CustomModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "var(--app-modal-bg, #fff)",
  border: "1px solid var(--app-modal-border, #000)",
  boxShadow: 24,
  borderRadius: "10px",
  p: 0,
  minWidth: 500,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 24px 8px 24px",
};

const bodyStyle = {
  padding: "8px 24px 24px 24px",
};

const CustomModal = ({
  open,
  onClose,
  title = "Modal",
  children,
  onModalSubmit,
  showButtons = true,
}) => {
  const isDarkMode = localStorage.getItem("appTheme") === "dark";

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box sx={style} className="custom-modal-shell">
        <Box sx={headerStyle}>
          <TextTypo
            text={title}
            id="custom-modal-title"
            fontSize="20px"
            fontColor={isDarkMode ? "#edf4ff" : "#111111"}
          />
          <IconButton aria-label="close" onClick={onClose}>
            <IoMdClose className="custom-modal-close" />
          </IconButton>
        </Box>
        <Box sx={bodyStyle}>{children}</Box>
        {showButtons ? (
          <div className="custom-modal-actions">
            <button
              className="custom-modal-btn custom-modal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="custom-modal-btn custom-modal-btn-primary"
              onClick={onModalSubmit}
            >
              OK
            </button>
          </div>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;
