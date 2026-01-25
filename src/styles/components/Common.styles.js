import styled from "@emotion/styled/macro";

export const TabularSection = styled.div({
  width: "100%",
  minWidth: "950px",
  // height: "max-content",
});

export const DisableIcon = styled.div(
  {
    cursor: "pointer",
    color: "black",
  },
  ({ disabled }) => {
    let styles = {};
    if (disabled) {
      styles = { ...styles, color: "grey", pointerEvents: "none" };
    }
    return styles;
  }
);
