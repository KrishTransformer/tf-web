import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

const CustomToolTip = ({ imageUrl, altText, thumbnailSize = 100, previewSize = 200 }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{
          width: thumbnailSize,
          height: thumbnailSize,
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5"
        }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={altText} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" 
            }} 
          />
        ) : (
          <span style={{ color: "#999", fontSize: "12px" }}>No Image</span>
        )}
      </div>
      
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "bottom",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        style={{
          pointerEvents: "none",
          marginLeft: "15px",
        }}
      >
        <Box
          style={{
            width: previewSize-35,
            height: previewSize-25,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "4px",
          }}
        >
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={`Preview - ${altText}`} 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "100%", 
                objectFit: "contain" 
              }} 
            />
          )}
        </Box>
      </Popover>
    </>
  );
};

export default CustomToolTip;