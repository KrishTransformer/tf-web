import React, { useState } from "react";
import { Typography, CardContent, Grid } from "@mui/material";

import { StyledCard } from "./StyledCard.styles.js";

const CustomCard = ({ title, children, companyName }) => {
	return (
		<StyledCard>
			<CardContent>
				{companyName && (
					<h5 style={{ color: "#26221f" }} className="text-center">
						{companyName}
					</h5>
				)}
				{title && (
					<h6 mt={2} className="text-center">
						{title}
					</h6>
				)}
				{children}
			</CardContent>
		</StyledCard>
	);
};

export default CustomCard;