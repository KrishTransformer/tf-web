import React from "react";
import "./CustomInputUnit.css";

const CustomInputUnit = ({
  label,
  unit,
  onInputChange,
  inputValue,
  labelColor,
  margin,
  type = "text",
  dropdownOptions = [],
}) => {
  return (
    <div className="labeled-input-container" style={{ margin }}>
      <label className="custominput-label me-3" style={{ color: labelColor }}>
        {label}
      </label>

      {type === "text" ? (
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          className="labeled-input-unit-label"
        />
      ) : (
        <select
          value={inputValue}
          onChange={onInputChange}
          className="labeled-input-unit-label"
        >
          {dropdownOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <span className="unit-label">{unit}</span>
    </div>
  );
};

export default CustomInputUnit;
