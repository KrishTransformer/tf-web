import React from "react";
import sprite from "./sprite.svg";
import * as color from "../../variables/color";
import PropTypes from "prop-types";
const Icons = ({ name, themeSize = "medium", fill = "brandBase" }) => {
	const sizes = {
		small: "12px",
		medium: "14px",
		large: "16px",
		huge: "20px",
		big: "24px",
		xlarge: "30px",
		"full-width": "100%",
	};
	const size = sizes[themeSize];
	const options = {
		fill: color[fill],
		width: size,
		height: size,
	};
	return (
		<svg {...options}>
			<use xlinkHref={`${sprite}#${name}_icon_24`} />
		</svg>
	);
};

export default Icons;

Icons.propTypes = {
	name: PropTypes.oneOf([
		"add_alt",
		"add",
		"admin",
		"menu",
		"arrow_down",
		"arrow_left",
		"arrow_up",
		"arrow_right",
	]),
	themeSize: PropTypes.oneOf([
		"small",
		"medium",
		"huge",
		"large",
		"xlarge",
		"full-width",
		"big",
	]),
	fill: PropTypes.string,
};
