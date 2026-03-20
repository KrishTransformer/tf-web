import React from "react";

const Container = ({
  children,
  margin = "0px",
  padding = "0px",
  width = "100%",
  bgColor = "transparent",
  border = "none",
  borderRadius="0px",
  boxShadow = "none",
  className = "",
  style = {},
}) => {
  const containerStyle = {
    margin: margin,
    padding: padding,
    width: width,
    align: "center",
    backgroundColor: bgColor,
    border: border,
    borderRadius: borderRadius,
    boxShadow: boxShadow,
    ...style,
  };

  return <div className={className} style={containerStyle}>{children}</div>;
};

export default Container;
