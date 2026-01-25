import { Card } from "@mui/material";
import styled from "@emotion/styled/macro";

export const StyledCard = styled(Card)({
	"&.MuiCard-root": {
		minWidth: "350px",
		maxWidth: "450px",
		background: "#f9f9f9",
		border:"1px solid #ccc",
		margin: "auto",
		flexDirection: "column",
		"& .MuiCardContent-root": {
			justifyContent: "center",
			fontSize: "1.5rem",
			"& .MuiTypography-root": {
				display: "flex",
				justifyContent: "center",
				// fontSize: "2.0rem",
			},
		},
	},
});