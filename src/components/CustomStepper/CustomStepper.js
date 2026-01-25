import { useState } from "react";

const CustomStepper = ({
    label = "",
    value = 0,
    onChange,
    min = 0,
    max = 10,
    step = 1,
    disabled = false,
    width = "auto",
    margin = "0",
    style = {},
    required = false,
    name,
    ...props
  }) => {
    console.log("value:",value)
    const [internalValue, setInternalValue] = useState(value)
  
    const currentValue = onChange ? value : internalValue
  
    const handleIncrement = () => {
      if (disabled || currentValue >= max) return
  
      const newValue = currentValue + step
      if (onChange) {
        onChange({ target: { name, value: newValue } })
      } else {
        setInternalValue(newValue)
      }
    }
  
    const handleDecrement = () => {
      if (disabled || currentValue <= min) return
  
      const newValue = currentValue - step
      if (onChange) {
        onChange({ target: { name, value: newValue } })
      } else {
        setInternalValue(newValue)
      }
    }
  
    const handleInputChange = (e) => {
      const newValue = Number.parseInt(e.target.value) || 0
      if (newValue >= min && newValue <= max) {
        if (onChange) {
          onChange({ target: { name, value: newValue } })
        } else {
          setInternalValue(newValue)
        }
      }
    }

    
  
    return (
      <div style={{ margin: margin, width: width, ...style }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {label && (
            <label
              style={{
                marginBottom: 0,
                color: "#000000",
                fontSize: "14px",
                fontWeight: "500",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {label}
              {required && <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>}
            </label>
          )}
  
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "12px",
              //border: "2px solid #2a2ad1",
              backgroundColor: "#eeeef1",
              width: "fit-content",
              minWidth: "100px",
              height: "40px",
              overflow: "hidden",
              padding: "0 8px",
            }}
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || currentValue <= min}
              style={{
                background: "none",
                border: "none",
                color: disabled || currentValue <= min ? "#c0c0c0" : "#222",
                fontSize: "22px",
                fontWeight: 700,
                cursor: disabled || currentValue <= min ? "not-allowed" : "pointer",
                width: "32px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
                outline: "none",
                boxShadow: "none",
                padding: 0,
              }}
              tabIndex={-1}
            >
              -
            </button>
  
            <input
              type="text"
              name={name}
              value={currentValue}
              onChange={handleInputChange}
              style={{
                border: "none",
                outline: "none",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: 700,
                padding: "0 8px",
                width: "32px",
                backgroundColor: "transparent",
                color: "#1400fa",
                opacity: disabled ? 0.5 : 1,
                flex: 1,
                pointerEvents: disabled || props.readOnly ? "none" : "auto",
              }}
              min={min}
              max={max}
              disabled={disabled}
              readOnly={props.readOnly}
            />
  
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || currentValue >= max}
              style={{
                background: "none",
                border: "none",
                color: disabled || currentValue >= max ? "#c0c0c0" : "#222",
                fontSize: "22px",
                fontWeight: 700,
                cursor: disabled || currentValue >= max ? "not-allowed" : "pointer",
                width: "32px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
                outline: "none",
                boxShadow: "none",
                padding: 0,
              }}
              tabIndex={-1}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }
  export default CustomStepper;