import { call, put, takeLatest } from "redux-saga/effects";
import {
	fetchConfigFailed,
	fetchConfigFullfiled,
} from "../actions/ConfigActions";
import * as constants from "../constants/ConfigConstants";
import { getApi } from "../api";

function* fetchConfig() {
	try {
		const response = yield call(getApi, `/config`);
		if (response && response.data) {
			yield put(
				fetchConfigFullfiled({
					data: response.data,
				})
			);
		} else {
			yield put(fetchConfigFailed());
		}
	} catch (e) {
		yield put(fetchConfigFailed());
	}
}

export function* fetchConfigData() {
	yield takeLatest(constants.FETCH_CONFIG, fetchConfig);
}