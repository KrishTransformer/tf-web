import styled from "@emotion/styled/macro";
import * as color from "../../variables/color";



export const RouterBreadCrumb = styled.div({
	display: "flex",
	alignItems: "center",
});

export const ThinHeaderContainer = styled.header({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	width: "100%",
	position: "sticky",
	top: 0,
	zIndex: 20,
	flexShrink: 0,
	paddingLeft: "1rem",
	backgroundColor: "var(--app-topbar-bg, white)",
	borderBottom: "1px solid var(--app-topbar-border, rgba(15, 23, 42, 0.08))",
	boxShadow: "0px 8px 16px rgba(0, 39, 81, 0.08)",
	height: "40px",
});
