import { Card } from "@mui/material";
import styled from "@emotion/styled/macro";

export const StyledCard = styled(Card)({
	"&.MuiCard-root": {
		width: "min(470px, 92vw)",
		background: "linear-gradient(170deg, rgba(255,255,255,0.95), rgba(249,251,255,0.92))",
		backdropFilter: "blur(10px)",
		border: "1px solid rgba(255,255,255,0.45)",
		borderRadius: "20px",
		boxShadow: "0 24px 46px rgba(15, 23, 42, 0.3)",
		margin: "auto",
		flexDirection: "column",
		"& .MuiCardContent-root": {
			padding: "24px 24px 20px",
			"& .MuiTypography-root": {
				display: "flex",
				justifyContent: "center",
			},
		},
	},
});
