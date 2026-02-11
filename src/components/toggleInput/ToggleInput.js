import React, { useEffect, useState } from "react";
import "./ToggleInput.css";

const currentDensityValue = (dryType, eTransCostType, dryTempClass, conductorMaterial) => {
  if (dryType === true || dryType === "true") {
    if (dryTempClass === "CLASS_B") {
      return conductorMaterial === "Cu" ? 2.3 : 1.5;
    } else if (dryTempClass === "CLASS_F") {
      return conductorMaterial === "Cu" ? 2.4 : 1.7;
    } else if (dryTempClass === "CLASS_H") {
      return conductorMaterial === "Cu" ? 2.7 : 1.9;
    } else {
      return conductorMaterial === "Cu" ? 2.6 : 1.8;
    }
  } else {
    if (eTransCostType === "ECONOMIC") {
      return conductorMaterial === "Cu" ? 4.24 : 2.37;
    } else {
      return conductorMaterial === "Cu" ? 1.7 : 0.9;
    }
  }
};

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
    if (valueOfToggle === "Al") {
      setIsAl(true);
    } else {
      setIsAl(false);
    }
  }, [valueOfToggle]);

  useEffect(() => {
    const conductorMaterial = valueOfToggle === "Al" ? "Al" : "Cu";
    const newDensity = currentDensityValue(
      formState.dryType,
      formState.eTransCostType,
      formState.dryTempClass,
      conductorMaterial
    );
    onValueChange(newDensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.dryType, formState.eTransCostType, formState.dryTempClass, valueOfToggle]);

  const handleToggle = (input) => {
    console.log(isAl);
    setIsAl(!isAl);
    console.log(input);
    onValueChange(currentDensityValue(formState.dryType, formState.eTransCostType, formState.dryTempClass, input));
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
