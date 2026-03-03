import React, { useState } from "react";
import { Typography, CardContent, Grid } from "@mui/material";

import { StyledCard } from "./StyledCard.styles.js";

const CustomCard = ({ title, children, companyName, companyNameExt, titleStyle }) => {
	return (
		<StyledCard>
			<CardContent>
				{companyName && (
					<h5 
					style={{ color: "#26221f", margin: "5px", fontWeight: 600, fontSize: "2rem", fontFamily: "Philosopher" }} 
					className="text-center">
						{companyName}
					</h5>
				)}
				{(companyNameExt) && (
					<h6 
					style={{ color: "#26221f", marginBottom: "15px", fontWeight: 400, fontSize: "1.2rem", fontFamily: "Philosopher", imageOrientation: "initial" }}
					className="text-center">
						{companyNameExt}
					</h6>
				)}
				{title && (
					<h6 mt={2} className="text-center" style={titleStyle}>
						{title}
					</h6>
				)}
				{children}
			</CardContent>
		</StyledCard>
	);
};

export default CustomCard;
