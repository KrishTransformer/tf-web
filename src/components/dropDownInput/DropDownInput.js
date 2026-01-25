import React from "react";
import "./DropDownInput.css";

const DropDownInput = ({
  label,
  labelColor,
  options = [],
  inputValue,
  dropdownValue,
  onInputChange,
  onDropdownChange,
}) => {
  const handleInputChange = (e) => {
    const value = e.target.value;
    onInputChange(value);
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    onDropdownChange(value);
  };

  return (
    <div className="dropdown-container">
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: labelColor,
        }}
        className="dropdown-label"
      >
        {label}
      </label>
      <div className="input-dropdown-wrapper">
        <input
          type="text"
          className="input-field-dd"
          value={inputValue}
          onChange={handleInputChange}
        />
        <select
          className="dropdown-select"
          value={dropdownValue}
          onChange={handleDropdownChange}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropDownInput;
