import styled from "@emotion/styled/macro";
import * as color from "../../variables/color";

export const PathBreadCrumbText = styled.label(
	{
		fontSize: "14px",
		lineHeight: "18px",
		fontStyle: "normal",
		fontWeight: "400",
		color: color.pathColor,
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
			textDecorationColor: "#4C596D",
		},
	},
	({ isCurrentPage, isLarge }) => {
		let styles = {};
		if (isCurrentPage) {
			styles = {
				color: color.supportLighten35,
				textDecoration: "none",
			};
		}
		if (isLarge) {
			styles = {
				...styles,
				fontSize: "16px",
				lineHeight: "24px",
			};
		}
		return styles;
	}
);
