import styled from "@emotion/styled/macro";
import * as color from "../../variables/color";
export const COLOR_CODE = {
	RED: color.P1,
	YELLOW: color.P4,
	GREEN: color.data02,
	Active: color.data18,
	Inactive: color.data19,
	Paused: color.greyLighten90,
};

// ************  start of using code

export const Table = styled.div(
	{
		display: "flex",
		flexDirection: "column",
		width: "100%",
		padding: "20px 0",
	},
	({ width, border, overflow, height, padding }) => ({
		width,
		height,
		border,
		overflow,
		padding,
	})
);

export const TableRow = styled.div(
	{
		display: "flex",
		width: "100%",
		height: "40px",
		borderBottom: `0.5px solid ${color.greyLighten90}`,
		"&:hover": {
			backgroundColor: color.brandLighten90,
		},
		justifyContent: "space-between",
		alignItems: "center",
	},
	({ height, padding, lastRow, isEvent }) => {
		let styles = { height, padding };
		if (lastRow) {
			styles = { ...styles, border: "none" };
		}
		if (isEvent) {
			styles = {
				...styles,
				alignItems: "center",
				height: "50px",
			};
		}

		// if (!disableRowHover) {
		//     styles = {
		//         ...styles,
		//         borderBottom: `0.5px solid ${color.greyLighten90}`,
		//         '&:hover': {
		//             backgroundColor: color.greyLighten90,
		//         },
		//     };
		// }
		return styles;
	}
);

export const TableLeftPanel = styled.div({
	cursor: "pointer",
});

export const TableRightPanel = styled.div({
	display: "flex",
});

export const ProjectTextCircle = styled.div(
	{
		paddingRight: "10px",
		paddingLeft: "10px",
	},
	({ color }) => ({ color })
);

export const ProjectText = styled.div(
	{
		paddingRight: "10px",
		paddingLeft: "10px",
	},
	({ color, paddingLeft }) => ({ color, paddingLeft })
);

export const ProjectRightPanelText = styled.div({
	paddingRight: "5px",
	paddingLeft: "5px",
});

export const ProjectButtonWrapper = styled.div({
	cursor: "pointer",
});

// ************  end of using code

// import { Tooltip, withStyles } from "@material-ui/core";
export const Section = styled.div({
	paddingTop: "30px",
});
// export const StyledTooltip = withStyles({
// 	tooltip: {
// 		color: "#001B29",
// 		width: "250px",
// 		backgroundColor: "#ffffff",
// 		fontSize: "12px",
// 		boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
// 		transition: "0.3s",
// 		paddingTop: 30,
// 	},
// })(Tooltip);
export const LookerIframe = styled.iframe({
	width: "100%",
	height: "100%",
});

export const SectionContainer = styled.div(
	{
		display: "flex",
		flexDirection: "column",
		height: "500px",
	},
	({ height, marginBottom }) => ({ height, marginBottom })
);

export const SectionHeader = styled.div({
	display: "flex",
	paddingBottom: "16px",
	justifyContent: "space-between",
});

export const SectionTitle = styled.div({
	fontSize: "24px",
	lineHeight: "28px",
	fontWeight: "500",
	fontStyle: "normal",
	display: "flex",
	justifyContent: "space-between",
});

export const ShowMore = styled.button(
	{
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		color: color.brandBase,
		fontWeight: 500,
		fontSize: "14px",
		lineHeight: "24px",
		border: "none",
		outline: "none",
		backgroundColor: "inherit",
		cursor: "pointer",
	},
	({ disabled, justifyContent }) => {
		let styles = { justifyContent };
		if (disabled) {
			return {
				...styles,
				disabled: true,
				color: color.greyLighten40,
				cursor: "default",
			};
		}
		return styles;
	}
);

export const Clubs = styled.div({
	display: "flex",
	flex: 1,
	overflow: "scroll",
});

export const ContentContainer = styled.div(
	{
		margin: "20px",
		display: "flex",
		height: "100%",
		// overflowX: "scroll",
		// overflowY: "hidden",
		backgroundColor: color.greyLighten100,
		boxShadow: "0px 0px 24px rgba(0, 39, 81, 0.05)",
		borderRadius: "8px",
	},
	({ minWidth, overflow, height, padding }) => ({
		minWidth,
		overflow,
		height,
		padding,
	})
);

export const ContentOverview = styled.div(
	{
		display: "flex",
		flexDirection: "column",
		minWidth: "500px",
		height: "90%",
		margin: "25px",
		borderRight: `0.5px ${color.sectionDivider} solid`,
	},
	({ minWidth }) => ({ minWidth })
);

export const TitleContainer = styled.div({
	display: "flex",
	justifyContent: "space-between",
	width: "100%",
});

export const Title = styled.div(
	{
		fontSize: "18px",
		fontWeight: "500",
		lineHeight: "28px",
		fontStyle: "normal",
	},
	({ fontWeight }) => ({ fontWeight })
);

export const SubTitle = styled.div({
	fontSize: "14px",
	fontWeight: "400",
	lineHeight: "18px",
	fontStyle: "normal",
	color: color.supportLighten20,
});

export const Map = styled.div({
	marginTop: "14px",
	height: "300px",
	width: "100%",
});

export const CircularProgressContainer = styled.div(
	{
		display: "flex",
		height: "100px",
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		alignItems: "center",
		width: "inherit",
	},
	({ padding }) => ({ padding })
);

export const HighlightsContainer = styled.div({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	minWidth: "660px",
	// height: "80%",
	margin: "25px",
});

export const Highlights = styled.div({
	display: "flex",
});

export const TableHeader = styled.div({
	display: "flex",
	width: "100%",
});

export const ColumnName = styled.div(
	{
		width: "100%",
		color: color.supportLighten20,
		fontSize: "14px",
		lineHeight: "32px",
		fontStyle: "normal",
		fontWeight: "400",
		textAlign: "start",
		display: "flex",
		alignItems: "end",
		justifyContent: "flex-start",
		// padding: '0px 10px 0px 10px',
	},
	({ width, minWidth, justifyContent }) => ({
		width: width,
		minWidth,
		justifyContent,
		// justifyContent: isCenter ? 'center' : isEnd ? 'flex-end' : 'start',
	})
);

export const ColumnValue = styled.div(
	{
		width: "100%",
		color: color.brandDarken80,
		fontSize: "16px",
		lineHeight: "32px",
		height: "100% !important",
		fontStyle: "normal",
		fontWeight: "500",
		textAlign: "start",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		overflow: "hidden",
		justifyContent: "flex-start",
		display: "flex",
		alignItems: "center",
		// padding: '0px 10px 0px 10px',
	},
	({
		isHyperlink,
		colorCode,
		width,
		minWidth,
		isFlex,
		textAlign,
		height,
		margin,
		padding,
		isTotal,
		isStatus,
		justifyContent,
		fontSize,
	}) => {
		let styles = {
			width,
			minWidth,
			textAlign,
			height,
			margin,
			padding,
			justifyContent,
			fontSize,
		};
		if (isHyperlink) {
			styles = {
				...styles,
				color: color.brandBase,
				textAlign: "start",
				cursor: "pointer",
			};
		}
		if (colorCode) {
			styles = {
				...styles,
				backgroundColor: COLOR_CODE[colorCode],
			};
		}
		if (isFlex) {
			styles = { ...styles, display: "flex", alignItems: "center" };
		}
		if (isTotal) {
			styles = { ...styles, fontWeight: "bold", fontSize: "16px" };
		}
		if (isStatus) {
			styles = { ...styles, width: "50%" };
		}
		return styles;
	}
);

export const TabBar = styled.div(
	{
		display: "flex",
		justifyContent: "space-between",
		// margin: '10px 0',
		width: "100%",
	},
	({ showLine, width }) => {
		let styles = { width };
		if (showLine) {
			styles = {
				...styles,
				borderRight: "1px solid black",
				paddingRight: "20px",
				marginRight: "20px",
			};
		}
		return styles;
	}
);

export const StatusColor = styled.div(
	{
		height: "20px",
		width: "20px",
	},
	({ colorCode, redAllowed }) => ({
		backgroundColor:
			redAllowed && colorCode === "RED" ? color.data17 : COLOR_CODE[colorCode],
	})
);

export const ColourCode = styled.div(
	{
		height: "20px",
		width: "20px",
	},
	({ colour }) => ({
		backgroundColor: colour,
	})
);

export const HardwareTitle = styled.div({
	fontSize: "18px",
	fontWeight: "500",
	lineHeight: "28px",
	fontStyle: "normal",
	display: "flex",
	justifyContent: "space-between",
});
export const HardwareLegendWrapper = styled.div({
	fontSize: "14px",
	lineHeight: "21px",
	fontWeight: 400,
	paddingTop: "10px",
});
export const HardwareLegendColorDot = styled.span(
	{
		height: "8px",
		width: "8px",
		borderRadius: "50%",
		display: "inline-block",
		marginRight: "8px",
		border: "none",
	},
	({ border, background }) => {
		let styles = {
			backgroundColor: background,
		};
		if (border) {
			styles = {
				...styles,
				border: "1px solid #88919E",
			};
		}
		return styles;
	}
);

export const HardwareLegendName = styled.span(
	{
		marginRight: "15px",
		color: "rgba(0, 0, 0, 0.7)",
	},
	({ fontSize }) => {
		let styles = {};
		if (fontSize) {
			styles = {
				...styles,
				fontSize: fontSize,
			};
		}
		return styles;
	}
);

export const HardwareInnerValue = styled.div(
	{
		height: "40px",
		display: "flex",
		alignItems: "center",
		paddingLeft: "16px",
	},
	({
		isValues,
		UpperColumn,
		isClickable,
		background,
		paddingLeft,
		textDecoration,
		textDecorationStyle,
		textColor,
	}) => {
		let styles = {};
		if (isValues) {
			styles = {
				...styles,
				justifyContent: "end",
				paddingRight: "16px",
			};
		}
		if (UpperColumn) {
			styles = {
				...styles,
				borderBottom: "1px solid #cae0f9",
			};
		}
		if (isClickable) {
			styles = {
				...styles,
				cursor: "pointer",
			};
			if (background) {
				styles = {
					...styles,
					"&:hover": { backgroundColor: background.hoverColor },
					"&:active": { backgroundColor: background.activeColor },
				};
			}
			if (textDecoration) {
				styles = {
					...styles,
					textDecoration: textDecoration,
				};
				if (textDecorationStyle) {
					styles = {
						...styles,
						textDecorationStyle: textDecorationStyle,
					};
				}
			}
		}
		if (paddingLeft) {
			styles = {
				...styles,
				paddingLeft: paddingLeft,
			};
		}
		if (textColor) {
			styles = {
				...styles,
				"&:hover": { color: textColor.hoverColor },
				color: textColor.activeColor,
			};
		}
		return styles;
	}
);
export const LowerColumn = styled.div({
	height: "40px",
	display: "flex",
	alignItems: "center",
	paddingLeft: "16px",
});

export const HardwareTableRow = styled.div(
	{
		display: "flex",
		width: "fit-content",
		height: "80px",
		borderColor: "#cae0f9",
		borderStyle: "solid",
		borderWidth: "0px 1px 1px 1px",
	},
	({ isStart }) => {
		let styles = {};
		if (isStart) {
			styles = {
				...styles,
				borderWidth: "1px 1px 1px 1px",
			};
		}
		return styles;
	}
);

export const PopOverValues = styled.span(
	{
		fontSize: "12px",
		lineHeight: "20px",
		color: "#38475D",
		display: "flex",
		alignItems: "center",
		width: "200px",
		justifyContent: "space-between",
	},
	({ fontSize, lineHeight, color, marginTop }) => {
		let styles = {};
		if (fontSize) {
			styles = {
				...styles,
				fontSize: fontSize,
			};
		}
		if (color) {
			styles = {
				...styles,
				color: color,
			};
		}
		if (lineHeight) {
			styles = {
				...styles,
				lineHeight: lineHeight,
			};
		}
		if (marginTop) {
			styles = {
				...styles,
				marginTop: "8px",
			};
		}
		return styles;
	},
	({ fontWeight }) => ({
		fontWeight,
	})
);

export const PopOverInnerWrapper = styled.div({});

export const PopOverValuesWrapper = styled.div({
	padding: "0px 16px 22px",
	display: "flex",
	flexDirection: "column",
	fontWeight: 500,
});

export const IconWrapper = styled.div({
	display: "flex",
	justifyContent: "end",
	padding: "10px 10px 0 0",
});

export const HardwareColumn = styled.div(
	{
		display: "flex",
		flexDirection: "column",
		position: "static",
		width: "160px",
		background: "#FFFFFF",
		flex: "none",
		flexGrow: "0",
		fontStyle: "normal",
		fontWeight: "normal",
		fontSize: "14px",
		lineHeight: "18px",
		borderColor: "#cae0f9",
		borderStyle: "solid",
		borderWidth: "0px 1px 2px 0px",
		padding: "6px 16px 0px 34px",
	},
	({ isLast, isChild, background, isHeading, isValues }) => {
		let styles = {};
		if (isChild) {
			styles = {
				...styles,
				width: "97px",
				padding: "0px",
			};
		}
		if (isValues) {
			styles = {
				...styles,
				width: "125px",
				padding: "0px",
			};
		}
		if (isLast) {
			styles = {
				...styles,
				borderWidth: "0px 0px 2px 0px",
			};
		}
		if (background) {
			styles = {
				...styles,
				background: background.displayColor,
			};
		}
		if (isHeading) {
			styles = {
				...styles,
				cursor: "auto",
				fontWeight: 500,
			};
		}
		return styles;
	}
);

export const FirmwareVersionModel = styled.span(
	{
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		width: "60px",
		height: "34px",
		flex: "none",
		position: "static",
		flexGrow: "0",
	},
	({ showBoxShadow, marginLeft, width }) => {
		let styles = {};
		if (showBoxShadow) {
			styles = {
				...styles,
				boxShadow: "1px 0px 0px #CAE0F9",
			};
		}
		if (marginLeft) {
			styles = {
				...styles,
				marginLeft: "5px",
			};
		}
		if (width) {
			styles = {
				...styles,
				width: width,
			};
		}
		return styles;
	}
);

export const HardwareHeader = styled.div({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	padding: "12px 36px",
	background: "#F1F5FB",
	boxShadow: "inset 0px 1px 0px #FFFFFF, inset 0px -1px 0px #B7D8EB",
	justifyContent: "space-between",
});

export const CollapseBar = styled.div({
	display: "flex",
	cursor: "pointer",
});

export const Card = styled.div({
	display: "flex",
	width: "100%",
	// minWidth: 'fit-content',
	overflow: "scroll hidden",
	height: "auto",
	backgroundColor: "#ffffff",
	boxShadow: "0px 0px 24px rgb(0 39 81 / 5%)",
	borderRadius: "8px",
	marginBottom: "36px",
	padding: "20px 25px",
	flexDirection: "column",
});
export const CardTitleWrap = styled.div({
	margin: "0 0 23px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
});
export const CardTitle = styled.p({
	margin: "0px",
	fontSize: "18px",
	lineHeight: "28px",
	fontWeight: 500,
});
export const CardSubTitle = styled.p({
	margin: "0px",
	color: "#597796",
	fontSize: "12px",
});

export const RseDataBar = styled.div(
	{
		display: "flex",
		justifyContent: "space-between",
		paddingLeft: "50px",
		paddingRight: "50px",
	},
	({ paddingTop, paddingBottom }) => ({ paddingTop, paddingBottom })
);

export const RseDataLabel = styled.label(
	{},
	({ fontSize, lineHeight, color, display }) => ({
		fontSize,
		lineHeight,
		color,
		display,
	})
);

export const HardwareControllerLabel = styled.div({
	color: "#33577D",
	padding: "8px 5px",
});

export const HardwareControllerValue = styled.div({
	color: "#606C7D",
	padding: "8px 10px",
	border: "1px solid #B7D8EB",
	boxSizing: "border-box",
	borderRadius: "4px",
});

export const HardwareControllerContainer = styled.div({
	flexDirection: "row",
	justifyContent: "space-between",
	fontSize: "16px",
	lineHeight: "24px",
	display: "flex",
	alignItems: "flex-start",
	padding: "8px 36px",
});

export const HardwareSeeAllWrapper = styled.div({
	border: "2px solid #CCD5DF",
	boxSizing: "border-box",
	borderRadius: "2px",
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	padding: "12px 24px",
	height: "40px",
	fontSize: "14px",
	lineHeight: "16px",
	color: "#0071E9",
	cursor: "pointer",
});
