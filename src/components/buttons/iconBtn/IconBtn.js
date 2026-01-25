import React from "react";

const IconBtn = ({
  text,
  icon,
  width="100%",
  fontSize = "16px",
  fontWeight = "600",
  fontColor = "black",
  bgColor = "transparent",
  padding = "7px 30px",
  borderRadius = "4px",
  gap = "8px",
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
    border: "0.5px solid #000000CC",
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
