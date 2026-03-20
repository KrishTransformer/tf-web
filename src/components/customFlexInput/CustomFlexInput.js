import React from "react";

const CustomFlexInput = ({
  type = "text",
  label,
  labelText = "",
  labelColor = "var(--app-label-text, black)",
  options = [],
  value,
  onChange,
  defaultOption,
  placeholder,
  style = {},
  width = "100%",
  required = false,
  variant = "box",
  margin = "5px 0px",
  ...props
}) => {
  return (
    <div
      className="d-flex align-items-center"
      style={{ margin: margin, width: width, ...style }}
    >
      {label && type !== "checkbox" && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            color: labelColor,
          }}
          className="custominput-label mt-2 me-3"
        >
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}{" "}
      &nbsp;
      {type === "text" && (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`custominput-inputFeildFlex ${variant}`}
          style={{ padding: "8px", width: "100%", ...props.inputStyle }}
          required={required}
        />
      )}
      {type === "dropdown" && (
        <select
          className="dropdown-select-main"
          value={value}
          onChange={onChange}
          style={{minWidth:"140px",maxWidth:"200px"}}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CustomFlexInput;
