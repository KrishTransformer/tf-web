import React, { useEffect, useState } from "react";

const FlexContainer = ({
  children,
  direction = "row",
  justify = "space-between",
  align = "stretch",
  wrap = "nowrap",
  gap = "10px",
  padding = "0",
  margin = "0",
  width = "",
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const style = {
    display: isSmallScreen ? "block" : "flex",
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    gap: gap,
    padding: padding,
    margin: margin,
    width: width,
  };

  return <div style={style}>{children}</div>;
};

export default FlexContainer;
