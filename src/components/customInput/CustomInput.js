import React from "react";
import "./CustomInput.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { TextField, OutlinedInput, InputAdornment } from "@mui/material";
import { BsUnlock as VscUnlock, BsLock as VscLock } from "react-icons/bs";
import CustomToolTip from "../customToolTip/customToolTip";
const CustomInput = ({
  showUnlockIcon,
  handleToggleLock,
  isLocked,
  type = "text",
  label,
  labelText = "",
  labelColor = "var(--app-label-text, black)",
  options = [],
  value,
  onChange,
  defaultOption,
  placeholder,
  radio1,
  radio2,
  style = {},
  width = "100%",
  required = false,
  variant = "box",
  margin = "5px 0px",
  bgColor = "var(--app-input-bg, #eeeef1)",
  borderColor = "var(--app-input-border, #00000033)",
  onClick,
  readOnly = false,
  name,
  unit,
  checked = false,
  disabled = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  ...props
}) => {
  const inputStyles = {
    padding: "8px",
    width: "100%",
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    readOnly: { readOnly },
    borderRadius: "4px",
    ...props.inputStyle,
  };

  return (
    <div style={{ margin: margin, width: width, ...style }}>
      {label && type !== "checkbox" && (
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
          {label.length > 15 ? `${label.slice(0, 15)}...` : label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        {type === "text" && (
          <>
            <input
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              onClick={onClick}
              placeholder={placeholder}
              className={`custominput-inputFeild ${variant}`}
              style={{ ...inputStyles, ...style }}
              required={required}
              readOnly={readOnly}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
            {unit && (
              <span className="unit-label" style={{ fontWeight: "bold" }}>
                {unit}
              </span>
            )}

          </>
        )}
        {type === "email" && (
          <input
            type="email"
            name={name}
            value={value}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
            className={`custominput-inputFeild ${variant}`}
            style={{ ...inputStyles, ...style }}
            required={required}
            readOnly={readOnly}
          />
        )}
        {type === "integer" && (
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`custominput-inputFeild ${variant}`}
            style={inputStyles}
            required={required}
            readOnly={readOnly}
          />
        )}

        {type === "number" && (
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">
              {labelText}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              name={name}
              startAdornment={
                <InputAdornment position="start">h</InputAdornment>
              }
              label="Amount"
              value={value}
              onChange={onChange}
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                ...props.inputStyle,
              }}
            />
          </FormControl>
        )}
        {type === "textarea" && (
          <TextField
            fullWidth
            id="outlined-multiline-flexible"
            name={name}
            label={labelText}
            value={value}
            multiline
            maxRows={4}
            onChange={onChange}
            style={{
              backgroundColor: bgColor,
              borderColor: borderColor,
              ...props.inputStyle,
            }}
          />
        )}
        {type === "dropdown" && (
          <FormControl sx={{ minWidth: 100 }} fullWidth size="medium">
            <InputLabel id="demo-simple-select-label">{labelText}</InputLabel>
            <select
              className={disabled ? "dropdown-select-main disabled" : "dropdown-select-main"}
              name={name}
              value={value}
              onChange={onChange}
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                cursor : disabled ? "not-allowed" : "pointer",                
              }}
              disabled={disabled}
            >
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
        )}
        {type === "date" && (
          <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            className={`custominput-inputFeild ${variant}`}
            style={inputStyles}
            required={required}
            readOnly={readOnly}
          />
        )}
        {type === "file" && (
          <input
            type="file"
            name={name}
            onChange={onChange}
            className={`custominput-inputFeild ${variant}`}
            style={inputStyles}
            required={required}
            readOnly={readOnly}
          />
        )}
        {type === "checkbox" && (
          <div className="form-check">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              className={`form-check-input custominput-inputField ${variant}`}
              id="exampleCheck1"
              required={required}
              readOnly={readOnly}
            />
            <label
              className="form-check-label"
              htmlFor="exampleCheck1"
              style={{ color: labelColor }}
            >
              {label}
            </label>
          </div>
        )}
        {type === "radio" && (
          <div className="form-check-radio">
            <label className="form-check-label">
              <input

                type="radio"
                name={name}
                value="Round"
                checked={value === "Round"}
                onChange={onChange}
              />
              <span>{radio1}</span>

            </label>

            <label className="form-check-label ml-5">
              <input
                type="radio"
                name={name}
                value="Strip"
                checked={value === "Strip"}
                onChange={onChange}
              />
              <span>{radio2}</span>
            </label>
          </div>
        )}

        {type === "time" && (
          <input
            type="time"
            name={name}
            value={value}
            onChange={onChange}
            className={`custominput-inputFeild ${variant}`}
            style={inputStyles}
            required={required}
            readOnly={readOnly}
          />
        )}
        {showUnlockIcon && (
          <div
            style={{
              cursor: "pointer",
              position: "absolute",
              right: 0,
              alignItems: "center",
              paddingBottom: "3px",
            }}
          >
            {isLocked ? (
              <VscLock size={20} color="#666" onClick={handleToggleLock} /> // Locked state
            ) : (
              <VscUnlock size={20} color="#666" onClick={handleToggleLock} /> // Unlocked state
            )}
          </div>
        )}

        {type === "image" && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={onChange}
              style={{ width: "18px", height: "18px" }}
              readOnly={readOnly}
            />
            <CustomToolTip imageUrl={value} altText={label} />
            <span style={{ marginLeft: "5px" }}>{label}</span>
          </div>
        )}


      </div>
    </div>
  );
};

export default CustomInput;
