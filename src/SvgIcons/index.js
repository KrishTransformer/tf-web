import ClockSvg from "./Clock.svg";
import CalenderSvg from "./Calender.svg";
import ChartSvg from "./Chart.svg";
import ClientSvg from "./Client.svg";
import DashboardSvg from "./Dashboard.svg";
import ProjectsSvg from "./Projects.svg";
import SettingsSvg from "./Settings.svg";
import TagSvg from "./Tag.svg";
import TeamSvg from "./Team.svg";

import React from "react";
import {
	CALENDER,
	CLIENT,
	CLOCK,
	DASHBOARD,
	DEFAULT_ICON_HEIGHT,
	DEFAULT_ICON_WIDTH,
	PROJECTS,
	SETTINGS,
	TAGS,
	TEAM,
	CHART,
} from "../constants/CommonConstants";

const SvgIcons = ({ icon, className, size, selected }) => {
	switch (icon) {
		case CLOCK:
			return (
				<div className={className}>
					<img
						src={ClockSvg}
						alt={CLOCK}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case CALENDER:
			return (
				<div className={className}>
					<img
						src={CalenderSvg}
						alt={CALENDER}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case CHART:
			return (
				<div className={className}>
					<img
						src={ChartSvg}
						alt={CHART}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case CLIENT:
			return (
				<div className={className}>
					<img
						src={ClientSvg}
						alt={CLIENT}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case DASHBOARD:
			return (
				<div className={className}>
					<img
						src={DashboardSvg}
						alt={DASHBOARD}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case PROJECTS:
			return (
				<div className={className}>
					<img
						src={ProjectsSvg}
						alt={PROJECTS}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case SETTINGS:
			return (
				<div className={className}>
					<img
						src={SettingsSvg}
						alt={SETTINGS}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case TEAM:
			return (
				<div className={className}>
					<img
						src={TeamSvg}
						alt={TEAM}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		case TAGS:
			return (
				<div className={className}>
					<img
						src={TagSvg}
						alt={TAGS}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
		default:
			return (
				<div className={className}>
					<img
						src={CalenderSvg}
						alt={TAGS}
						height={size || DEFAULT_ICON_HEIGHT}
						width={size || DEFAULT_ICON_WIDTH}
					/>
				</div>
			);
	}
};

export default SvgIcons;
