import styled from "@emotion/styled/macro";
import * as color from "../../variables/color.js";
export const SideDrawerContainer = styled.div({
	height: "100%",
	color: color.supportBase,
	backgroundColor: color.bgColor2,
	gridArea: "nav",
});

export const ContentView = styled.div({
	gridArea: "content",
	backgroundColor: color.bgColor,
});

export const Header = styled.div({
	height: "50px",
	backgroundColor: color.bgColor2,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
});

export const LogoIcon = styled.div({
	padding: "0px 20px 0px 25px",
	cursor: "pointer",
});

export const LogoText = styled.div({
	padding: "0px 0px 0px 0px",
	color: color.brandLighten30,
	fontSize: 25,
	fontWeight: "bold",
});

export const HeaderLeftPanel = styled.div({
	display: "flex",
});

export const HeaderRightPanel = styled.div({
	display: "flex",
	padding: "0px 25px",
});

export const UserCircle = styled.div({
	height: "30px",
	width: "30px",
	borderRadius: "50%",
	border: ".5px solid black",
	backgroundColor: "gray",
	color: "white",
	justifyContent: "center",
	cursor: "pointer",
});

export const Initial = styled.div({
	padding: "5px 0px 0px 3px",
});

export const AddTask = styled.div(
	{
		height: "50px",
		marginLeft: "20px",
		marginRight: "20px",
		border: "1px solid #afb5be",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: color.bgColor2,
	},
	({ marginTop, marginBottom }) => ({
		marginTop,
		marginBottom,
	})
);

export const AddTaskLeftPanel = styled.div({
	width: "100%",
	display : "flex",
});

export const AddTaskRightPanel = styled.div({
	marginLeft: "30px",
	display: "flex",
	alignItems: "center",
});

export const CenterAlign = styled.div({
	display : "flex",
	alignItems: "center",
});

export const TitlePanel = styled.div(
	{
		height: "30px",
		marginTop: "20px",
		marginLeft: "20px",
		marginRight: "20px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	({ marginTop, marginBottom }) => ({
		marginTop,
		marginBottom,
	})
);

export const TitleLeftPanel = styled.div({});

export const TitleRightPanel = styled.div({});

export const TitleBar = styled.div(
	{
		height: "40px",
		marginLeft: "20px",
		marginRight: "20px",
		border: "1px solid gray",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: color.greyLighten80,
	},
	({ marginTop, marginBottom }) => ({
		marginTop,
		marginBottom,
	})
);

export const TitleBarLeftPanel = styled.div({
	marginLeft: "10px",
});

export const TitleBarRightPanel = styled.div({
	marginRight: "10px",
});

export const Input = styled.input(
	{
		height: "35px",
		// width: "100%",
		width: "300px",
		marginLeft: "10px",
		border: ".1px solid #c3c8ce",
		":focus": {
			outline: "none",
		},
		paddingLeft: "5px",
	},
	({ height, width, margin, padding, placeholder }) => ({
		height,
		width,
		margin,
		padding,
		placeholder,
	})
);

export const Button = styled.button({
	height: "35px",
	width: "100px",
	backgroundColor: color.brandDarken15,
	color: "white",
	marginRight: "20px",
	borderColor: color.brandDarken15,
	cursor: "pointer",
});

export const TimerText = styled.div({
	border: "none",
	marginRight: "10px",
	marginLeft: "10px",
});

export const ProjectPanel = styled.div(
	{
		display: "flex",
		alignItems: "center",
		width: "100px",
		color: color.brandLighten30,
		cursor: "pointer",
		marginRight: "10px",
		marginLeft: "10px",
		"&:hover": {
			textDecoration: "underline",
		},
	},
	({ height, width, margin, padding }) => ({ height, width, margin, padding })
);

export const Project = styled.div(
	{
		paddingLeft: "8px",
		width: "100px",
		color: color.brandLighten30,
	},
	({ height, width, margin, padding }) => ({ height, width, margin, padding })
);

export const VerticalLine = styled.div({
	borderLeft: ".2px solid #d7dadf",
	height: "35px",
});

export const HorizontalLine = styled.div({
	borderBottom: "0.2px solid #d7dadf",
	width: "350px",
});

export const VerticalPanel = styled.div({
	paddingRight: "5px",
});

export const HorizontalPanel = styled.div({
	display: "flex",
	alignItems: "center",
});

export const CalenderPanel = styled.div({
	display: "flex",
	alignItems: "center",
});
