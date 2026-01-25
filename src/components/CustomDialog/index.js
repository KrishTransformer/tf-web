import * as React from "react";
import {
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	List,
} from "@mui/material";
import WarningIcon from "../../assets/WarningIcon.svg";
import { StyledDialog } from "./StyledDialog.styles";
import { ModalContent, ModalTitle, ModalButton } from "./styles";
import {
	ContentWrapper,
	InputContainer,
	InputWrapper,
	Label,
} from "components/Crud/Exception.styles";
import {
	StyledInput,
	StyledSelect,
} from "components/Crud/ExceptionInformation.styles";
import { alpha, styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	TextField,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	InputBase,
} from "@mui/material";
import { CustomStyledSelect } from "components/CustomSelect/CustomStyledSelect.styles";

import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DATE_FORMATS } from "constants/constants";
import moment from "moment";
import { Alert } from "@mui/material";
// import { DatePicker } from "antd";
import dayjs from "dayjs";
import { DATE } from "@amcharts/amcharts4/core";
const CustomDialog = (props) => {
	const dateFormatList = [
		DATE_FORMATS.FULL_DISPLAY_FORMAT_IND,
		DATE_FORMATS.INDIAN_FORMAT,
	];
	const {
		title,
		openDialog,
		handleClose,
		handleAgree,
		index,
		data,
		isLoading,
		onInformationChange,
		errorMessage,
	} = props;

	return (
		<StyledDialog
			open={openDialog}
			onClose={handleClose}
			disableBackdropClick={true}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			data={data}
		>
			<DialogTitle id="alert-dialog-title">{`Generate ${title}`}</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": { m: 1, width: "32ch" },
					}}
					noValidate
					autoComplete="off"
				>
					<div>
						{data?.filter((item) => item?.label == "InvoiceWarning")[0]?.value >
							0 && (
							<Alert
								severity="error"
								style={{ marginTop: "0px", marginBottom: "20px" }}
							>
								{errorMessage}
							</Alert>
						)}
						{data
							?.filter((item) => item?.label == "Invoice Date")[0]
							?.value.format(DATE_FORMATS.INPUT_FIELD_INTEGER) <
							dayjs().format(DATE_FORMATS.INPUT_FIELD_INTEGER) && (
							<Alert
								severity="error"
								style={{ marginTop: "0px", marginBottom: "20px" }}
							>
								You are generating invoice for previous date
							</Alert>
						)}
						{data
							?.filter((item) => item?.hide != true)
							.map((item) => {
								switch (item?.type) {
									case "select":
										return (
											<FormControl sx={{ m: 1, minWidth: 255 }}>
												<InputLabel id="demo-simple-select-helper-label">
													{item.label}
												</InputLabel>
												<CustomStyledSelect
													labelId="demo-simple-select-helper-label"
													id="demo-simple-select"
													value={item.value == undefined ? "" : item.value}
													name={item.label}
													label={item.label}
													onChange={onInformationChange}
												>
													<MenuItem value="">
														<em>None</em>
													</MenuItem>
													{item.lookupData?.map((menuList, idx) => (
														<MenuItem value={menuList.name} key={idx}>
															{menuList.name}
														</MenuItem>
													))}
												</CustomStyledSelect>
											</FormControl>
										);

									case "number":
										return (
											<TextField
												disabled={item.disabled}
												fullWidth
												variant="outlined"
												label={item.label}
												name={item.label}
												// defaultValue={item.defaultValue}
												onChange={onInformationChange}
												// InputProps={{
												// 	readOnly: true,
												// }}
												value={item.value}
												size="normal"
												type={item.type}
											/>
										);
									case "text":
										return (
											<TextField
												disabled={item.disabled}
												fullWidth
												variant="outlined"
												label={item.label}
												name={item.label}
												// defaultValue={item.defaultValue}
												onChange={onInformationChange}
												// InputProps={{
												// 	readOnly: true,
												// }}
												value={item.value}
												size="normal"
												type={item.type}
											/>
										);
									case "date":
										return (
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DatePicker
													startText={`From`}
													endText={`To`}
													format="DD-MM-YYYY"
													disabled={item.disabled}
													rows={1}
													name={item.label}
													label={item.label}
													value={item.value}
													views={["year", "month", "day"]}
													onChange={(e) => {
														let event = {};
														let target = {};
														target.name = item.label;
														target.value = e;
														event.target = target;
														onInformationChange(event);
													}}
													renderInput={(startProps, endProps) => (
														<React.Fragment>
															<TextField {...startProps} />
															<TextField {...endProps} />
														</React.Fragment>
													)}
												/>
											</LocalizationProvider>
										);
									case "datetime":
										return (
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DatePicker
													startText={`From`}
													endText={`To`}
													format={DATE_FORMATS.FULL_DISPLAY_FORMAT_IND}
													disabled={item.disabled}
													rows={1}
													name={item.label}
													label={item.label}
													value={item.value}
													views={["year", "month", "day"]}
													onChange={(e) => {
														let event = {};
														let target = {};
														target.name = item.label;
														target.value = e;
														event.target = target;
														onInformationChange(event);
													}}
													renderInput={(startProps, endProps) => (
														<React.Fragment>
															<TextField {...startProps} />
															<TextField {...endProps} />
														</React.Fragment>
													)}
												/>
											</LocalizationProvider>
										);
								}
							})}
					</div>
				</Box>
			</DialogContent>
			<DialogActions>
				<ModalButton
					isCancel={true}
					onClick={handleClose}
					isDisabled={isLoading}
				>
					Cancel
				</ModalButton>
				<ModalButton
					onClick={() => handleAgree(index)}
					autoFocus
					isLoading={isLoading}
					disabled={
						data?.filter((item) => item?.label == "InvoiceWarning")[0]?.value >
							0 ||
						(title == "Payment" &&
							(data?.filter((item) => item?.label == "Paid Amount")[0]?.value ==
								undefined ||
								data?.filter((item) => item?.label == "Paid Amount")[0]
									?.value <= 0))
					}
				>
					{isLoading ? (
						<CircularProgress
							size={16}
							style={{
								color: "#ffffff",
							}}
						/>
					) : (
						"Generate"
					)}
				</ModalButton>
			</DialogActions>
		</StyledDialog>
	);
};

export default CustomDialog;
