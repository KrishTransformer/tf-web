import styled from "@emotion/styled/macro";

export const CancelButton = styled.button({
	border: "1px solid #606C7D",
	padding: " 6px 12px",
	textTransform: "none",
	borderRadius: "0px",
	cursor: "pointer",
});
export const ModalButton = styled.button(
	{
		border: "2px solid var(--app-modal-btn-primary-border, #007CB0)",
		// padding: '8px 28px',
		borderRadius: "4px",
		fontSize: "16px",
		lineHeight: "24px",
		textTransform: "none",
		cursor: "pointer",
		width: "112px",
		height: "40px",
		fontWeight: "400",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginRight: "20px",
	},
	({ isCancel, isLoading, width, justifyContent, height, disabled }) => ({
		width,
		height,
		justifyContent,
		disabled,
		color:
			isCancel || disabled
				? "var(--app-modal-btn-secondary-text, #0067A0)"
				: "var(--app-modal-btn-primary-text, #ffffff)",
		background:
			isCancel || disabled
				? "var(--app-modal-btn-secondary-bg, #F1F4F6)"
				: "var(--app-modal-btn-primary-bg, #0067A0)",
		borderColor:
			isCancel || disabled
				? "var(--app-modal-btn-secondary-border, #606C7D)"
				: "var(--app-modal-btn-primary-border, #007CB0)",
		pointerEvents: isLoading ? "none" : "auto",
		cursor: isLoading ? "not-allowed" : "auto",
		"&:hover": {
			color:
				isCancel || disabled
					? "var(--app-modal-btn-secondary-text, #0067A0)"
					: "var(--app-modal-btn-primary-text, #ffffff)",
			background:
				isCancel || disabled
					? "var(--app-modal-btn-secondary-bg, #F1F4F6)"
					: "var(--app-modal-btn-primary-border, #007CB0)",
		},
		"&:active": {
			background: "var(--app-modal-btn-primary-border, #024B71)",
			color: "var(--app-modal-btn-primary-text, #ffffff)",
		},
	})
);
export const ModalTitle = styled.span({
	color: "var(--app-modal-text, #142B3C)",
	fontSize: "20px",
	lineHeight: "24px",
	fontWeight: 500,
});
export const ModalContent = styled.span({
	color: "var(--app-modal-muted, #024B71)",
	fontSize: "16px",
	lineHeight: "24px",
	marginTop: "4px",
});
