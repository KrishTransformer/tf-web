import { call, put, takeLatest } from "redux-saga/effects";
import {
	signInFullfiled,
	signInFailed,
	sendOTPFullfiled,
	sendOTPFailed,
	resetPasswordFullfiled,
	resetPasswordFailed,
	signUpFullfiled,
	signUpFailed,
} from "../actions/AuthActions";
import { fetchEntity } from "../actions/EntityActions";
import * as constants from "../constants/AuthConstants";
import { postApi } from "../api";
import { COMMON_SERVICE } from "../constants/CommonConstants";
function* triggerSignIn(payload) {
	try {
		const loginId = payload.username?.trim();
		let auth = btoa(`${loginId}:${payload.password}`);
		const headers = { Authorization: "Basic " + auth };
		const body = {
			usernameOrEmail: loginId,
			password: payload.password,
		};
		if (loginId?.includes("@")) {
			body.email = loginId;
		} else {
			body.username = loginId;
		}
		//const response = yield call(postApi, "/auth/signin", null, headers);
		const response = yield call(
			  postApi,
			 "/auth/signin" ,
			  body,headers,{},
			  COMMON_SERVICE
			);
		if (response && response.status >= 200 && response.status < 300 && !response?.data?.error) {
			yield put(signInFullfiled(response.data));
			yield put(fetchEntity("lomMaterial", `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`));
		} else {
			yield put(signInFailed(response?.data));
		}
	} catch (e) {
		console.log("from catch");
		yield put(signInFailed({
			message: e.response?.data?.error || e.message,
			code: e.code,
			status: e.response?.status,
			error: e.response?.data?.error || 'Unexpected error occurred',
		}));
	}
}

function* triggerSignUp(payload) {
	try {
		const response = yield call(
			postApi,
			`/auth/signup`,
			{
				username: payload.username,
				password: payload.password,
				email: payload.email,
				otp: payload.otp,
			},
			{},
			{},
			COMMON_SERVICE
		);
		if (response && response.status >= 200 && response.status < 300 && !response?.data?.error) {
			console.log(response.data);
			yield put(signUpFullfiled(response?.data));
		} else {
			console.log(response.data);
			yield put(signUpFailed(response?.data));
		}
	} catch (e) {
		console.log(e);
		console.log(JSON.stringify(e));
		yield put(
			signUpFailed({
				message: e?.response?.data?.message || e?.response?.data?.error || e?.message,
				error: e?.response?.data?.error,
				code: e?.response?.data?.code || e?.response?.data?.error,
				status: e?.response?.status,
			})
		);
	}
}

function* triggerSendOTP(payload) {
	try {
		const endpoint =
			payload.purpose === "forgotPassword"
				? `/auth/sendForgotPasswordOtp`
				: `/auth/sendEmailOtp`;
		const response = yield call(
			postApi,
			endpoint,
			{ email: payload.email },
			{},
			{},
			COMMON_SERVICE
		);
		if (response && response.status >= 200 && response.status < 300 && !response?.data?.error) {
			const responseToken = response?.data?.sessionInfo || true;
			yield put(sendOTPFullfiled(responseToken));
		} else {
			yield put(sendOTPFailed(response?.data));
		}
	} catch (e) {
		yield put(sendOTPFailed());
	}
}

function* triggerResetPassword(payload) {
	try {
		if (payload.purpose === "forgotPasswordEmail") {
			const response = yield call(
				postApi,
				`/auth/passwordResetByEmail`,
				{
					email: payload.phoneNumber,
					otp: payload.otpCode,
					newPassword: payload.password,
				},
				{},
				{},
				COMMON_SERVICE
			);
			if (response && response.status >= 200 && response.status < 300 && !response?.data?.error) {
				yield put(resetPasswordFullfiled(true));
			} else {
				yield put(resetPasswordFailed(response?.data));
			}
			return;
		}

		let auth = btoa(
			`${payload.phoneNumber}:${payload.sessionInfo}:${payload.otpCode}:${payload.password}`
		);
		const headers = { Authorization: "Basic " + auth };
		console.log(headers);
		const response = yield call(
			postApi,
			`/auth/passwordResetByOtp`,
			null,
			headers
		);
		if (response && response?.data && response?.data?.email) {
			console.log(response.data);
			yield put(
				resetPasswordFullfiled(response.data.email === payload.phoneNumber)
			);
		} else {
			console.log(response?.data);
			yield put(resetPasswordFailed(response?.data));
		}
	} catch (e) {
		console.log(e);
		console.log(JSON.stringify(e));
		yield put(resetPasswordFailed());
	}
}

export function* signInSaga() {
	yield takeLatest(constants.SIGNIN_REQUESTED, triggerSignIn);
}

export function* signUpSaga() {
	yield takeLatest(constants.SIGNUP_REQUESTED, triggerSignUp);
}

export function* sendOTPSaga() {
	yield takeLatest(constants.SENDOTP_REQUESTED, triggerSendOTP);
}

export function* resetPasswordSaga() {
	yield takeLatest(constants.RESETPASSWORD_REQUESTED, triggerResetPassword);
}
