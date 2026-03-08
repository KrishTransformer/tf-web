import * as constants from "../constants/AuthConstants";
import { processErrorMessage } from "../constants/errors.js";

const extractAuthErrorText = (response) => {
	if (!response) return "Something went wrong. Please try again.";
	if (typeof response === "string") return response;

	if (Array.isArray(response?.errors) && response.errors.length > 0) {
		const firstError = response.errors[0];
		if (typeof firstError === "string") return firstError;
		return firstError?.message || firstError?.error || firstError?.code || String(firstError);
	}

	return (
		response?.error?.message ||
		response?.message ||
		response?.error ||
		response?.code ||
		response?.data?.error ||
		response?.data?.message ||
		"Something went wrong. Please try again."
	);
};

const getSignInErrorMessage = (response) => {
	const rawError = extractAuthErrorText(response);
	const normalized = String(rawError || "").toUpperCase();
	const status = response?.status;

	if (
		normalized.includes("EMAIL_NOT_FOUND") ||
		normalized.includes("USER_NOT_FOUND")
	) {
		return "Please register";
	}

	if (
		status === 401 ||
		normalized.includes("INVALID_PASSWORD") ||
		normalized.includes("INVALID_CREDENTIAL") ||
		normalized.includes("BAD_CREDENTIAL") ||
		normalized.includes("UNAUTHORIZED")
	) {
		return "Username or Password is incorrect";
	}

	return processErrorMessage(rawError);
};

const getSignUpErrorMessage = (response) => {
	const rawError = extractAuthErrorText(response);
	const normalized = String(rawError || "").toUpperCase();

	if (
		normalized.includes("EMAIL_EXISTS") ||
		normalized.includes("EMAIL_ALREADY_EXISTS") ||
		normalized.includes("USER_ALREADY_EXISTS")
	) {
		return "Email is already registered. Please sign in.";
	}

	if (normalized.includes("USERNAME_EXISTS") || normalized.includes("USERNAME_ALREADY_EXISTS")) {
		return "Username is already taken.";
	}

	if (normalized.includes("INVALID_OTP")) {
		return "Invalid OTP. Please try again.";
	}

	if (normalized.includes("OTP_EXPIRED")) {
		return "OTP expired. Please request a new OTP.";
	}

	if (normalized.includes("INVALID_EMAIL")) {
		return "Please enter a valid email address.";
	}

	return processErrorMessage(rawError);
};

const initialState = {
	auth: {
		isLoading: false,
		isAuthenticated: false,
		errorMessage: "",
		sessionInfo: "",
		phoneNumber: "",
		name: "",
		entityId : "",
		passwordResetSucceeded: false,
		signUpSucceeded: false,
		roles: "",
	},
};

const authReducer = (state, action) => {
	const authState = state ? state : initialState;
	switch (action.type) {
		case constants.SIGNIN_REQUESTED:
			return {
				auth: {
					...authState.auth,
					isLoading: true,
					isAuthenticated: false,
					errorMessage: "",
				},
			};
		case constants.SIGNIN_FULLFILLED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					isAuthenticated: true,
					errorMessage: "",
					roles: action.roles,
					entityId : action.entityId,
					name: action.phoneNumber,
					phoneNumber : action.phoneNumber,
				},
			};
		case constants.SIGNIN_FAILED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					isAuthenticated: false,
					errorMessage: getSignInErrorMessage(action.response),
				},
			};
		case constants.SIGNUP_REQUESTED:
			return {
				auth: {
					...authState.auth,
					isLoading: true,
					signUpSucceeded: false,
					errorMessage: "",
				},
			};
		case constants.SIGNUP_FULLFILLED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					signUpSucceeded: true,
					errorMessage: "",
				},
			};
		case constants.SIGNUP_FAILED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					signUpSucceeded: false,
					errorMessage: getSignUpErrorMessage(action.response),
				},
			};
		case constants.SENDOTP_REQUESTED:
			return {
				auth: {
					...authState.auth,
					isLoading: true,
					sessionInfo: "",
					errorMessage: "",
				},
			};
		case constants.SENDOTP_FULLFILLED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					sessionInfo: action.response,
					errorMessage: "",
				},
			};
		case constants.SENDOTP_FAILED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					sessionInfo: "",
					errorMessage: processErrorMessage(action.response),
				},
			};
		case constants.RESETPASSWORD_REQUESTED:
			return {
				auth: {
					...authState.auth,
					isLoading: true,
					passwordResetSucceeded: false,
					errorMessage: "",
				},
			};
		case constants.RESETPASSWORD_FULLFILLED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					passwordResetSucceeded: true,
					errorMessage: "",
				},
			};
		case constants.RESETPASSWORD_FAILED:
			return {
				auth: {
					...authState.auth,
					isLoading: false,
					passwordResetSucceeded: false,
					errorMessage: processErrorMessage(action.response),
				},
			};
		case constants.SIGNOUT:
			return {
				auth: {
					...authState.auth,
					isAuthenticated: false,
				},
			};
		case constants.CLEAR_ERROR_MESSAGE:
			return {
				auth: {
					...authState.auth,
					errorMessage: "",
				},
			}; 

		default:
			return authState;
	}
};

export default authReducer;
