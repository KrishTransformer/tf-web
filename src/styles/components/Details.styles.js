import styled from "@emotion/styled/macro";
// import { Tooltip, withStyles } from '@material-ui/core';
import { Input } from "@mui/material";
export const ContentWrapper = styled.div(
	{
		height: "auto",
		padding: "36px",
	},
	({ height, width }) => ({
		height,
		width,
	})
);
// export const StyledTooltip = withStyles({
//     tooltip: {
//         color: '#004368',
//         width: 'auto',
//         backgroundColor: '#F5F6F7',
//         fontSize: '12px',
//         lineHeight: '18px',
//         padding: '4px 10px',
//         transition: '0.3s',
//         borderRadius: '2px',
//         border: '1px solid #CCD5DF',
//         boxShadow: '0px 8px 24px rgba(0, 39, 81, 0.15)',
//     },
// })(Tooltip);

export const DetailsWrapper = styled.div({
	display: "flex",
	height: "calc(100vh - 184px)",
});
export const SectionWrapper = styled.div({
	width: "50%",
});
export const Title = styled.span({
	color: "#002D5D",
	fontSize: "20px",
	lineHeight: "24px",
	fontWeight: 500,
});
export const InputWrapper = styled.div({
	// marginTop: "24px",
});
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
	}) => {
		let styles = { textAlign, WebkitLineClamp, marginLeft, overflow };
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
		return styles;
	}
);
export const InputContainer = styled.div(
	{
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "24px",
		alignItems: "baseline",
	},
	({ marginBottom, alignItems }) => ({
		marginBottom,
		alignItems,
	})
);

export const StyledInput = styled.input(
	{
		width: "60%",
	},
	({ marginBottom, alignItems }) => ({
		marginBottom,
		alignItems,
	})
);

// export const StyledInput = styled(Input)(
// 	({ width, error, disabled, inheritProperties }) => ({
// "&.MuiTextField-root": {
// 	width: width ? width : "60%",
// 	pointerEvents: inheritProperties ? "none" : "auto",
// 	"& .MuiInputBase-root": {
// 		color: disabled ? "#a4abb4" : "#38475D",
// 		background: error ? "#FAEDE7" : "#ffffff",
// 		"& .MuiOutlinedInput-notchedOutline": {
// 			borderColor: error ? "#D35318" : disabled ? "#CCD5DF" : "#A2B3BE",
// 		},
// 	},
// },
// 	})
// );

export const CronButton = styled.button(
	{
		border: "1px solid #99ABBE",
		background: "#ffffff",
		color: "#a9a9a9",
		textTransform: "none",
		width: "60%",
		height: "40px",
		borderRadius: "4px",
		fontWeight: "400",
		textAlign: "start",
		paddingLeft: "12px",
		fontSize: "16px",
	},
	({ error, hasValue, inheritProperties }) => {
		let styles = {};
		if (hasValue) {
			styles = {
				...styles,
				color: "#38475D",
			};
		}
		if (error) {
			styles = {
				...styles,
				border: "1px solid #D35318",
				background: "#FAEDE7",
			};
		}
		if (inheritProperties) {
			styles = {
				...styles,
				pointerEvents: "none",
			};
		}
		return styles;
	}
);
