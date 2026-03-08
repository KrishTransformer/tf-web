import { Card } from "@mui/material";
import { Tooltip, TextField } from "@mui/material";
import styled from "@emotion/styled/macro";

export const InputContainer = styled.div(
	{
		// display: "flex",
		justifyContent: "space-between",
		marginBottom: "24px",
		alignItems: "baseline",
	},
	({ marginBottom, alignItems, display }) => ({
		marginBottom,
		alignItems,
		display,
	})
);

export const StyledInput = styled(TextField)(
	({ width, error, disabled, inheritProperties }) => ({
		"&.MuiTextField-root": {
			width: width ? width : "100%",
			pointerEvents: inheritProperties ? "none" : "auto",
			"& .MuiInputBase-root": {
				color: disabled ? "#a4abb4" : "#38475D",
				background: error ? "#FAEDE7" : "#ffffff",
				"& .MuiOutlinedInput-notchedOutline": {
					borderColor: error ? "#D35318" : disabled ? "#CCD5DF" : "#A2B3BE",
				},
			},
		},
	})
);

export const Label = styled.span(
	{
		color: "#1A4B66",
		fontSize: "14px",
		lineHeight: "20px",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: 1,
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	({
		isValue,
		textAlign,
		width,
		WebkitLineClamp,
		hasInfo,
		marginLeft,
		overflow,
		marginTop,
		display,
		justifyContent,
	}) => {
		let styles = {
			textAlign,
			WebkitLineClamp,
			marginLeft,
			overflow,
			display,
			justifyContent,
		};
		if (isValue) {
			styles = {
				...styles,
				textAlign: textAlign ? textAlign : "end",
				width: width ? width : "70%",
				fontSize: "16px",
				lineHeight: "24px",
				cursor: "pointer",
			};
		}
		if (hasInfo) {
			styles = {
				...styles,
				display: "flex",
				alignItems: "center",
			};
		}

		if (marginTop) {
			styles = {
				...styles,
				marginTop: marginTop,
			};
		}
		return styles;
	}
);

export const ModalButton = styled.button(
	{
		border: "none",
		padding: "10px 14px",
		borderRadius: "10px",
		fontSize: "15px",
		lineHeight: "20px",
		textTransform: "none",
		cursor: "pointer",
		width: "100%",
		height: "42px",
		fontWeight: "700",
		letterSpacing: "0.01em",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	({ isCancel, isLoading, type }) => ({
		color: isCancel ? "#0067A0" : "#ffffff",
		type,
		background: isCancel ? "#0f172a" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
		pointerEvents: isLoading ? "none" : "auto",
		transition: "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
		boxShadow: "0 10px 18px rgba(15, 23, 42, 0.18)",
		"&:hover": {
			backgroundColor: "#0b1220",
			color: "#ffffff",
			transform: "translateY(-1px)",
		},
		"&:active": {
			background: "#0b1220",
			color: "#ffffff",
			transform: "translateY(0)",
		},
	})
);
