import styled from "@emotion/styled/macro";
import * as colors from "../../variables/color";
const TextButton = styled.button(
  {
    display: "flex",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    color: "white",
    padding: "7px 10px",
    backgroundColor: "#006395",
    outline: "none",
    borderRadius: "5px",
    border: "2px solid transparent",
  },
  ({
    color,
    isTab,
    backgroundColor,
    isTabBarButton,
    paddingBottom,
    isForPageNo,
    showBottomBorder,
    isForTab,
    isForTable,
    isForHeading,
    disabled,
    width,
  }) => {
    let styles = { color, backgroundColor, paddingBottom, width };

    if (isTabBarButton) {
      const borderBottom = `2px solid ${colors.brandBase}`;
      styles = { ...styles, borderBottom };
    }
    if (isTab) {
      styles = { ...styles, padding: "10px 0" };
    }
    if (isForTab) {
      styles = {
        ...styles,

        height: "100%",
        alignItems: "center",
      };
    }
    if (showBottomBorder) {
      styles = {
        ...styles,
        marginTop: "1px",
        color: colors.brandBase,
        borderBottom: `3px solid ${colors.brandBase}`,
      };
    }
    if (isForPageNo) {
      styles = {
        ...styles,
        height: "100%",
        display: "flex",
        alignItems: "center",
        borderRight: "1px solid #CCD5DF",
      };
    }
    if (isForTable) {
      styles = {
        ...styles,
        border: "2px solid #cbd5df",
        height: "31px",
        width: "70px",
        color: "#0071e9",
        // backgroundColor: '#ffffff',
        alignItems: "center",
        justifyContent: "center",
        margin: "0 0 0 .3rem",
      };
    }
    if (isForHeading) {
      styles = {
        ...styles,
        border: "2px solid #cbd5df",
        color: "#0071e9",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 0 0 .3rem",
      };
    }
    if (disabled) {
      styles = {
        ...styles,
        color: "grey",
        backgroundColor: "#f7f7f7",
        // cursor: "not-allowed",
        pointerEvents: "none",
        border: "2px solid #a9a9a9",
      };
    }
    return styles;
  }
);

const IconWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  padding: " 0 28px 0 0",
});

export { TextButton, IconWrapper };
