import styled from "@emotion/styled/macro";
import * as colors from "../../variables/color.js";

export const TabBarContainer = styled.div(
	{
		display: "flex",
		height: "48px",
		padding: "0 36px",
		alignItems: "center",
		boxShadow:
			"inset 0px 1px 0px #FFFFFF, inset 0px -3px 0px rgba(0, 113, 233, 0.2)",
		backgroundColor: colors.bgColor,
	},
	({ syntheticFlag }) => {
		let styles = {};
		if (syntheticFlag) {
			styles = { ...styles, borderTop: "none" };
		}
		return styles;
	}
);

export const TabBarButton = styled.div(
	{
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		padding: "0 12px",
		fontSize: "16px",
		lineHeight: "18px",
		fontWeight: "normal",
		fontStyle: "normal",
		height: "48px",
		"&:hover": {
			backgroundColor: colors.greyLighten100,
			boxShadow: "inset 0px -3px 0px rgb(0 113 233 / 20%)",
			color: colors.brandBase,
		},
	},
	({ isSelected, inEditMode }) => {
		if (isSelected) {
			return {
				color: colors.brandBase,
				boxShadow: "inset 0px -3px 0px #0071E9",
				"&:hover": {
					backgroundColor: colors.greyLighten100,
					boxShadow: "inset 0px -3px 0px #0071E9",
				},
			};
		}
		if (inEditMode) {
			return {
				color: "#cbd5df",
				pointerEvents: "none",
			};
		}
	}
);
