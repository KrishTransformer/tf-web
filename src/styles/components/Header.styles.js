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
	paddingLeft: "1rem",
	backgroundColor: "white",
	borderShadow: "0px 8px 16px rgba(0, 39, 81, 0.15)",
	height: "40px",
});
