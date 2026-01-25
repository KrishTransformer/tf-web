import React from "react";
import "./LabeledInputWithUnit.css";

const LabeledInputWithUnit = ({
  label,
  unit,
  onInputChange,
  inputValue,
  labelColor,
  isChecked,
  onCheckboxChange,
  margin,
  type = "text",
  dropdownOptions = [],
  hideCheckbox = false,
}) => {
  return (
    <div className="labeled-input-container" style={{ margin }}>
      <div className="form-check">
        {!hideCheckbox && 
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
          className="form-check-input custominput-inputField box"
          id="exampleCheck1"
        />
        }
        <label
          className="form-check-label-field"
          htmlFor="exampleCheck1"
          style={{ color: labelColor }}
        >
          {label}
        </label>
      </div>

      {type === "text" ? (
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange} // Ensure this is triggered correctly
          className="labeled-input-field"
        />
      ) : (
        <select
          value={inputValue}
          onChange={onInputChange}
          className="labeled-input-field"
        >
          {dropdownOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        // <></>
      )}

      {type === "number" ? (
        <input
          type="number"
          value={inputValue}
          onChange={onInputChange}
          className="labeled-input-field"
        />
      ) : (
        // <select
        //   value={inputValue}
        //   onChange={onInputChange}
        //   className="labeled-input-field"
        // >
        //   {dropdownOptions.map((option) => (
        //     <option key={option.value} value={option.value}> 
        //       {option.label}
        //     </option>
        //   ))}
        // </select>
        <></>
      )}
      
      {/* {type === "dropdown" && (
        <select
          value={inputValue}
          onChange={onInputChange}
          className="labeled-input-field"
        >
          {dropdownOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )} */}


      <span className="form-check-label">{unit}</span>
    </div>
  );
};

export default LabeledInputWithUnit;
