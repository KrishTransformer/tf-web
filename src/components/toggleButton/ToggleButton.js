import React from "react";
import { Switch } from "@mui/material";
import "./ToggleButton.css";

const ToggleButton = ({
  labelLeft,
  labelRight,
  checked,
  onChange,
  labelStyle = {},
  switchStyle = {},
  disabled = false,
}) => {
  return (
    <div className="toggle-button-wrapper">
      <span className={`toggle-label-left ${!checked ? "active-label" : ""}`} style={labelStyle}>
        {labelLeft}
      </span>
      
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#000", 
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#d1ff00",
          },
          ...switchStyle,
        }}
      />
      
      <span className={`toggle-label-right ${checked ? "active-label" : ""}`} style={labelStyle}>
        {labelRight}
      </span>
    </div>
  );
};

export default ToggleButton;
