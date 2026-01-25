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
		padding: "10px",
		borderRadius: "4px",
		fontSize: "16px",
		lineHeight: "24px",
		textTransform: "none",
		cursor: "pointer",
		width: "100%",
		height: "40px",
		fontWeight: "400",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	({ isCancel, isLoading, type }) => ({
		color: isCancel ? "#0067A0" : "#ffffff",
		type,
		background: isCancel ? "#26221f" : "#26221f",
		pointerEvents: isLoading ? "none" : "auto",
		"&:hover": {
			backgroundColor: "#26221f",
			color: "#ffffff",
		},
		"&:active": {
			background: "#26221f",
			color: "#ffffff",
		},
	})
);