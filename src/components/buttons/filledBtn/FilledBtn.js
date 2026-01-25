import React from "react";

const FilledBtn = ({
  text,
  width,
  fontSize = "16px",
  fontWeight = "600",
  fontColor = "black",
  bgColor = "#CCCCCC",
  padding = "7px 30px",
  borderRadius = "10px",
  ...props
}) => {
  const style = {
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: fontColor,
    width: width,
    backgroundColor: bgColor,
    border: "none",
    padding: padding,
    borderRadius: borderRadius,
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

export default FilledBtn;
