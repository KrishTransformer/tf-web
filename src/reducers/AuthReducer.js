import * as constants from "../constants/AuthConstants";
import { processErrorMessage } from "../constants/errors.js";

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
					errorMessage: processErrorMessage(action.response.message),
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
					errorMessage: processErrorMessage(action.response),
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