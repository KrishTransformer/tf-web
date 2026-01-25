import React from "react";

const TextBtn = ({
  text,
  fontSize = "16px",
  fontWeight = "600",
  fontColor = "black",
  padding = "0px 30px",
  textDecoration = "underline",
  ...props
}) => {
  const style = {
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: fontColor,
    backgroundColor: "transparent",
    border: "none",
    padding: padding,
    cursor: "pointer",
    textDecoration: textDecoration,
  };

  return (
    <div>
      <button style={style} {...props}>
        {text}
      </button>
    </div>
  );
};

export default TextBtn;
