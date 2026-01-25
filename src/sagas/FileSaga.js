import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { CORE_SERVICE } from "../constants/CommonConstants";
import * as constants from "../constants/FileConstants";
import { postApi } from "../api";
import {
    fetchFileFullfiled,
    fetchFileFailed,
} from "../actions/FileActions";


function* fetchFileData({ payload }) {
    try {
        const path = "/files/lom";
        const response = yield call(postApi, path, payload, {}, {}, CORE_SERVICE);
        console.log("response fileSaga:", response);
        if (response.data) {
            yield put(fetchFileFullfiled({ data: response.data }));
        }
    } catch (error) {
        console.log("Error fileSaga", error);
        yield put(fetchFileFailed(error.message));
    }
}

export function* fetchFileSaga() {
    yield takeLatest(constants.FETCH_FILE, fetchFileData);
}