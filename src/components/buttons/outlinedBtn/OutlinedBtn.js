import React from "react";

const OutlinedBtn = ({
  text,
  fontSize = "16px",
  fontWeight = "600",
  fontColor = "var(--app-label-text, black)",
  margin = "0px",
  padding = "7px 30px",
  borderRadius = "10px",
  borderColor = "var(--app-input-border, #333)",
  ...props
}) => {
  const style = {
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: fontColor,
    backgroundColor: "transparent",
    border: `1px solid ${borderColor}`,
    padding: padding,
    borderRadius: borderRadius,
    margin: margin,
    cursor: "pointer",
  };

  return (
    <div>
      <button style={style} {...props}>
        {text}
      </button>
    </div>
  );
};

export default OutlinedBtn;
