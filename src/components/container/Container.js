import React from "react";

const Container = ({
  children,
  margin = "0px",
  padding = "0px",
  width = "100%",
  bgColor = "transparent",
  border = "none",
  borderRadius="0px",
}) => {
  const style = {
    margin: margin,
    padding: padding,
    width: width,
    align: "center",
    backgroundColor: bgColor,
    border: border,
    borderRadius: borderRadius,
  };

  return <div style={style}>{children}</div>;
};

export default Container;
