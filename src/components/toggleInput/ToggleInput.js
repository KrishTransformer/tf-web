import React, { useEffect, useState } from "react";
import "./ToggleInput.css";
import { Tuple } from "@reduxjs/toolkit";

const ToggleInput = ({
  label,
  labelColor,
  value,
  valueOfToggle,
  onValueChange,
  onLabelChange,
  formState = {},
}) => {
  const [isAl, setIsAl] = useState(false);

  useEffect(() => {
    if (valueOfToggle == "Al") {
      setIsAl(true);
    } else {
      setIsAl(false);
    }
  }, [valueOfToggle]);

  const handleToggle = (input) => {
    console.log(isAl);
    setIsAl(!isAl);
    console.log(input);
    onValueChange(formState.eTransCostType == "ECONOMIC" ? (input == "Cu" ? 4.24 : 2.37) : (input == "Cu" ? 1.7 : 0.9));
    onLabelChange(input);
  };
  console.log("formState in toggleInput:", formState);

  return (
    <div className="toggle-container">
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: labelColor,
        }}
        className="custominput-label"
        data-bs-toggle={label.length > 10 ? "tooltip" : undefined}
        data-bs-placement="top"
        title={label.length > 10 ? label : ""}
      >
        {label.length > 10 ? `${label.slice(0, 10)}...` : label}
      </label>
      <div className="input-toggle-wrapper">
        <input
          type="text"
          className="input-field"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <div className="toggle-switch">
          <span
            className={`toggle-option ${isAl ? "highlight" : ""}`}
            onClick={() => handleToggle("Al")}
          >
            Al
          </span>
          <span
            className={`toggle-option ${!isAl ? "highlight" : ""}`}
            onClick={() => handleToggle("Cu")}
          >
            Cu
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToggleInput;
