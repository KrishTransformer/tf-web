import styled from "@emotion/styled/macro";
import * as color from "../../variables/color";
export const SectionTitle = styled.div({
	fontSize: "24px",
	lineHeight: "28px",
	fontWeight: "500",
	fontStyle: "normal",
	display: "flex",
	justifyContent: "space-between",
});

export const Button = styled.button({
	height: "35px",
	width: "100px",
	backgroundColor: color.brandDarken15,
	color: "white",
	marginRight: "20px",
	borderColor: color.brandDarken15,
	cursor: "pointer",
});
