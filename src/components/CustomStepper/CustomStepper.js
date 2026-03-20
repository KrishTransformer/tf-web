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

    const controlShellStyle = {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      borderRadius: "16px",
      border: "1px solid var(--app-input-border, #00000033)",
      background:
        "linear-gradient(135deg, var(--app-input-bg, #eeeef1), var(--app-input-accent-bg, #d7f3fc))",
      minWidth: "124px",
      minHeight: "46px",
      padding: "6px",
      boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)",
    }

    const buttonStyle = (isDisabled) => ({
      background: isDisabled
        ? "transparent"
        : "var(--app-toggle-track, rgba(255, 255, 255, 0.75))",
      border: "1px solid var(--app-input-border, #00000033)",
      color: isDisabled ? "#c0c0c0" : "var(--app-input-text, #222)",
      fontSize: "20px",
      fontWeight: 700,
      cursor: isDisabled ? "not-allowed" : "pointer",
      width: "34px",
      height: "34px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
      outline: "none",
      boxShadow: "none",
      padding: 0,
      borderRadius: "10px",
      flexShrink: 0,
    })

    
  
    return (
      <div style={{ margin: margin, width: width, ...style }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {label && (
            <label
              style={{
                marginBottom: 0,
                color: "var(--app-label-text, #000000)",
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
            style={controlShellStyle}
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || currentValue <= min}
              style={buttonStyle(disabled || currentValue <= min)}
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
                border: "1px solid var(--app-input-border, #00000033)",
                outline: "none",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: 700,
                padding: "0 10px",
                width: "40px",
                height: "34px",
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                color: "var(--app-input-accent-text, #1400fa)",
                opacity: disabled ? 0.5 : 1,
                borderRadius: "10px",
                flex: "0 0 auto",
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
              style={buttonStyle(disabled || currentValue >= max)}
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
