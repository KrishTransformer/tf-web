import React from "react";
import { CardContent } from "@mui/material";

import { StyledCard } from "./StyledCard.styles.js";

const CustomCard = ({ title, children, companyName, companyNameExt, titleStyle }) => {
	return (
		<StyledCard>
			<CardContent className="auth-card-content">
				{companyName && (
					<h5 className="auth-card-company text-center">
						{companyName}
					</h5>
				)}
				{(companyNameExt) && (
					<h6 className="auth-card-company-ext text-center">
						{companyNameExt}
					</h6>
				)}
				{title && (
					<h6 mt={2} className="text-center auth-card-title" style={titleStyle}>
						{title}
					</h6>
				)}
				{children}
			</CardContent>
		</StyledCard>
	);
};

export default CustomCard;
