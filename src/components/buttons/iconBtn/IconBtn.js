import React from "react";

const IconBtn = ({
  text,
  icon,
  width="100%",
  fontSize = "16px",
  fontWeight = "600",
  fontColor = "var(--app-label-text, black)",
  bgColor = "transparent",
  padding = "7px 30px",
  borderRadius = "4px",
  gap = "8px",
  borderColor = "var(--app-input-border, #000000CC)",
  ...props
}) => {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize,
    fontWeight,
    color: fontColor,
    width,
    backgroundColor: bgColor,
    border: `0.5px solid ${borderColor}`,
    padding,
    borderRadius,
    cursor: "pointer",
  };

  return (
    <button style={style} {...props}>
      <span>{text}</span>
      <span style={{ marginLeft: gap }}>{icon}</span>
    </button>
  );
};

export default IconBtn;
