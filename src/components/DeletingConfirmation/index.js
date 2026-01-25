/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import * as React from "react";
import {
	CircularProgress,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import WarningIcon from "../../assets/WarningIcon.svg";
import { StyledDialog } from "./StyledDialog.styles";
import {
	ModalContent,
	ModalTitle,
	ModalButton,
} from "../../components/CustomDialog/styles";

const ConfirmationDialog = (props) => {
	const { open, handleClose, handleAgree, message, isLoading, isDelete } =
		props;
	return (
		<StyledDialog
			open={open}
			onClose={handleClose}
			disableBackdropClick={true}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				<img src={WarningIcon} alt="warningIcon" />
			</DialogTitle>
			<DialogContent>
				<ModalTitle>
					{isDelete ? "Delete Confirmation" : "Confirmation"}
				</ModalTitle>
				<ModalContent>{message}</ModalContent>
			</DialogContent>
			<DialogActions>
				<ModalButton isCancel={true} onClick={handleClose}>
					Cancel
				</ModalButton>
				<ModalButton
					onClick={() => handleAgree()}
					autoFocus
					isLoading={isLoading}
				>
					{isLoading ? (
						<CircularProgress
							size={16}
							style={{
								color: "#ffffff",
							}}
						/>
					) : isDelete ? (
						"Confirm"
					) : (
						"Proceed"
					)}
				</ModalButton>
			</DialogActions>
		</StyledDialog>
	);
};

export default ConfirmationDialog;
