const errorMessages = [
	{
		code: "EMAIL_NOT_FOUND",
		value: "Email is not registered, Please contact admin",
	},
	{
		code: "INVALID_EMAIL",
		value: "Email is Invalid",
	},
	{
		code: "INVALID_PASSWORD",
		value: "Password is Invalid",
	},
];

export const processErrorMessage = (inputErrorMessage) => {
	console.log(inputErrorMessage);
	let output = inputErrorMessage;
	for (let i = 0; i < errorMessages.length; i++) {
		if (errorMessages[i].code === inputErrorMessage) {
			output = errorMessages[i].value;
			break;
		}
	}
	return output;
};