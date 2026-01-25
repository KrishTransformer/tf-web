import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { IoMdClose } from "react-icons/io";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import FlexContainer from "../flexbox/FlexContainer";
import TextTypo from "../textTypo/TextTypo";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#fff",
  border: "0.5px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 0,
  minWidth: 500,
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 20px 0px 20px",
};

const CustomModalWithMaximize = ({
  open,
  onClose,
  title = "Modal",
  children,
  onModalSubmit,
  showButtons = true,
  isMaximized,  
  onToggleMaximize,
}) => {
  const modalStyle = isMaximized
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: 0,
        minWidth: "100%",
        background: "red", // for 3D viewer background
        border: "none",
        p: 0,
        display: "flex",
        flexDirection: "column",
      }
    : {
        ...baseStyle,
        width: "fit-content",
      };

  const bodyStyle = isMaximized
    ? {
        flex: 1,
        padding: 0,
        overflow: "hidden",
        display: "flex", // let viewer fill space
      }
    : {
        padding: "0px 20px 20px 20px",
      };

  return (
    <Modal keepMounted open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header only in normal mode */}
        {!isMaximized && (
          <Box sx={headerStyle}>
            <TextTypo text={title} id="custom-modal-title" fontSize="20px" />
            <Box>
              <IconButton aria-label="maximize" onClick={onToggleMaximize}>
                {isMaximized ? (
                  <MdOutlineFullscreenExit size={20} />
                ) : (
                  <MdOutlineFullscreen size={20} />
                )}
              </IconButton>
              <IconButton aria-label="close" onClick={onClose}>
                <IoMdClose color="#333" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Body fills remaining space */}
        <Box sx={bodyStyle}>{children}</Box>

        {/* Footer only in normal mode */}
        {!isMaximized && showButtons && (
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
        )}

        {/* Floating buttons in fullscreen mode */}
        {isMaximized && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton aria-label="restore" onClick={onToggleMaximize}>
              <MdOutlineFullscreenExit size={20} color="#fff" />
            </IconButton>
            <IconButton aria-label="close" onClick={onClose}>
              <IoMdClose color="#fff" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModalWithMaximize;
