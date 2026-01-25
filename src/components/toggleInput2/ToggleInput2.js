import React, { useEffect, useState } from "react";
import "./ToggleInput2.css";

const ToggleInput2 = ({
  label,
  labelColor,
  value,
  onValueChange,
  isEnamel,
  onToggleChange,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) => {
  const [isSE, setIsSE] = useState(false); // SE = true, P = false

  useEffect(() => {
    setIsSE(isEnamel); // sync with prop on load/update
  }, [isEnamel]);

  const handleToggle = () => {
    const newValue = !isSE;
    setIsSE(newValue);
    onToggleChange(newValue); // true → SE, false → P
  };

  return (
    <div className="tgi2-container">
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: labelColor,
        }}
        className="tgi2-label"
      >
        {label}
      </label>
      <div className="tgi2-input-toggle-wrapper" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <input
          type="text"
          className="tgi2-input-field"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <div
          className="tgi2-toggle-switch"
          onClick={handleToggle}
          style={{ cursor: "pointer", userSelect: "none", display: "inline-block" }}
        >
          <span className={`tgi2-toggle-option highlight`}>
            {isSE ? "SE" : "P"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToggleInput2;
