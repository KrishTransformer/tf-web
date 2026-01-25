import React, { useState } from "react";
import "./ToggleBtn.css";

const ToggleBtn = ({ label, labelColor, onChange }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    
    onChange(newValue ? "Yes" : "No");
  };

  return (
    <div className="my-2">
      {label && (
        <label
          style={{
            color: labelColor || "#000",
          }}
          className="toggle-btn-label"
        >
          {label}
        </label>
      )}
      <div className="switch-toggle">
        <input
          className="switch-toggle-checkbox"
          type="checkbox"
          id="pricing-plan-switch"
          checked={isChecked} 
          onChange={handleChange} 
        />
        <label className="switch-toggle-label" htmlFor="pricing-plan-switch">
          <span>Yes</span>
          <span>No</span>
        </label>
      </div>
    </div>
  );
};

export default ToggleBtn;
