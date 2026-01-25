import { all } from "redux-saga/effects";

import {
  fetchEntityDataSaga,
  fetchSearchEntityDataSaga,
  addEntityDataSaga,
  deleteEntityDataSaga,
  updateEntityDataSaga
} from "./EntitySaga";

import { addCalcDataSaga, generate3DDataSaga, load3DDataSaga } from "./CalcSaga";
import {fetchFileSaga} from "./FileSaga";

import {
  signInSaga,
  sendOTPSaga,
  resetPasswordSaga,
  signUpSaga,
} from "./AuthSaga";

import { fetchConfigData } from "./ConfigSaga";

export default function* rootSaga() {
  yield all([
    fetchEntityDataSaga(),
    fetchSearchEntityDataSaga(),
    addEntityDataSaga(),
    deleteEntityDataSaga(),
    updateEntityDataSaga(),
    addCalcDataSaga(),
    generate3DDataSaga(),
    load3DDataSaga(),
    signInSaga(),
    sendOTPSaga(),
    resetPasswordSaga(),
    signUpSaga(),
    fetchConfigData(),
    fetchFileSaga()
  ]);
}
