import CustomCookies from "../api/Cookies";
import * as constants from "../constants/AuthConstants";
import { parseJwt } from "../utils/AuthUtil";

export const signIn = (username, password) => ({
	type: constants.SIGNIN_REQUESTED,
	username,
	password,
});

export const signInFullfiled = (response) => {
	const jsonPayload = parseJwt(response?.idToken);
	CustomCookies.setToken(response);
	let phoneNum = response?.email?.split('@')[0];
	phoneNum = phoneNum?.replace('__at__', '@');

	return {
		type: constants.SIGNIN_FULLFILLED,
		roles: response?.roles,
		entityId: response?.entityId,
		name: jsonPayload?.name,
		phoneNumber : phoneNum,
	};
};

export const signInFailed = (response) => {
	return {
		type: constants.SIGNIN_FAILED,
		response,
	};
};

export const signUp = (username, password) => ({
	type: constants.SIGNUP_REQUESTED,
	username,
	password,
});

export const signUpFullfiled = (response) => ({
	type: constants.SIGNUP_FULLFILLED,
	response,
});

export const signUpFailed = (response) => ({
	type: constants.SIGNUP_FAILED,
	response,
});

export const signOut = () => ({
	type: constants.SIGNOUT,
});

export const sendOTP = (phoneNumber, captchaToken) => ({
	type: constants.SENDOTP_REQUESTED,
	phoneNumber,
	captchaToken,
});

export const sendOTPFullfiled = (response) => ({
	type: constants.SENDOTP_FULLFILLED,
	response,
});

export const sendOTPFailed = (response) => ({
	type: constants.SENDOTP_FAILED,
	response,
});

export const resetPassword = (phoneNumber, sessionInfo, otpCode, password) => ({
	type: constants.RESETPASSWORD_REQUESTED,
	phoneNumber,
	sessionInfo,
	otpCode,
	password,
});

export const resetPasswordFullfiled = (response) => ({
	type: constants.RESETPASSWORD_FULLFILLED,
	response,
});

export const resetPasswordFailed = (response) => ({
	type: constants.RESETPASSWORD_FAILED,
	response,
});

export const clearErrorMessage = () => ({
	type: constants.CLEAR_ERROR_MESSAGE,
});