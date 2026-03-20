import styled from "@emotion/styled/macro";
import * as color from "../../variables/color";

export const PathBreadCrumbText = styled.label(
	{
		fontSize: "14px",
		lineHeight: "18px",
		fontStyle: "normal",
		fontWeight: "400",
		color: "var(--app-topbar-text, #4C596D)",
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
			textDecorationColor: "var(--app-topbar-text, #4C596D)",
		},
	},
	({ isCurrentPage, isLarge }) => {
		let styles = {};
		if (isCurrentPage) {
			styles = {
				color: "var(--app-topbar-current, #6f8eb3)",
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
