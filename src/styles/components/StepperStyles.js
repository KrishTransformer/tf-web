import styled from "@emotion/styled/macro";
import { StepLabel, Box, Typography } from "@mui/material";

// Container for Stepper
export const StepperContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  maxWidth: 600,
  alignItems: "center",
});

// Custom Styled Step Label
export const StyledStepLabel = styled(StepLabel)({
  display: "flex",
  alignItems: "center",
  "& .MuiStepLabel-label": {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between time and radio icon
  },
});

// Time Typography Styling
export const TimeText = styled(Typography)({
  minWidth: "80px",
  textAlign: "right",
  color: "#757575",
});

// Control Buttons (if needed for next/previous actions)
export const ControlButtons = styled.div({
  display: "flex",
  width: "100%",
  justifyContent: "flex-end",
});
