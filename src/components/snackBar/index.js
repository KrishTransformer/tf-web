import React from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackBar = ({ open, message }) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
		>
			<Alert severity="success" sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default SnackBar;