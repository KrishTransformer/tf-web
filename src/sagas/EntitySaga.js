import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  fetchEntity,
  fetchEntityFailed,
  fetchEntityFullfiled,
  addEntityFullfiled,
  addEntityFailed,
  deleteEntityFailed,
  deleteEntityFullfiled,
  updateEntityFailed,
  fetchSearchEntityFullfiled,
  fetchSearchEntityFailed,
} from "../actions/EntityActions";
import * as constants from "../constants/EntityConstants";
import { entityApi } from "../api";

function* fetchEntityData(payload) {
  try {
    let queryParam = "";
    let payloadBody = {};
    if (payload?.payload !== undefined) {
      payloadBody = payload.payload;
    }
    if (payload?.queryParam === undefined) {
      queryParam = `offset=0&size=1000`;
    } else {
      queryParam = payload.queryParam;
    }
    const response = yield call(
      entityApi.list,
      payload.entityName,
      queryParam,
      payloadBody
    );
    if (payload.overWriteEntityName) {
      payload.entityName = payload.overWriteEntityName;
    }
    if (response && response.data) {
      yield put(
        fetchEntityFullfiled({
          data: response.data,
          entityName: payload.entityName,
        })
      );
    } else {
      yield put(fetchEntityFailed(payload.entityName));
    }
  } catch (e) {
    yield put(fetchEntityFailed(payload.entityName));
  }
}

function* fetchSearchEntityData(payload) {
  try {
    let queryParam = "";
    let payloadBody = payload.payload;
    if (payload?.queryParam === undefined) {
      queryParam = `offset=0&size=1000`;
    } else {
      queryParam = payload.queryParam;
    }
    const response = yield call(
      entityApi.search,
      payload.entityName,
      queryParam,
      payloadBody
    );
    if (payload.overWriteEntityName) {
      payload.entityName = payload.overWriteEntityName;
    }
    if (response && response.data) {
      yield put(
        fetchSearchEntityFullfiled({
          data: response.data,
          entityName: payload.entityName,
        })
      );
    } else {
      yield put(fetchSearchEntityFailed(payload.entityName));
    }
  } catch (e) {
    yield put(fetchSearchEntityFailed(payload.entityName));
  }
}

function* addEntityData(payload) {
  try {
    let response = {};
    if (payload.entityName === "member") {
      response = yield call(
        entityApi.create,
        payload.entityName,
        payload.jsonBody,
        { headers: { "User-Entity": true } }
      );
    } else {
      response = yield call(
        entityApi.create,
        payload.entityName,
        payload.jsonBody
      );
    }
    if (response && response.data) {
      yield put(addEntityFullfiled(payload.entityName));
      if (!payload.skipFetch) {
        yield put(fetchEntity(payload.entityName, "offset=0&size=100"));
      }
    } else {
      yield put(addEntityFailed(payload.entityName));
    }
  } catch (e) {
    yield put(addEntityFailed(payload.entityName));
  }
}

function* deleteEntityData(payload) {
  try {
    const response = yield call(
      entityApi.remove,
      payload.entityName,
      payload.entityId
    );
    if (payload.skipFetch === "undefined") {
      payload.skipFetch = false;
    }
    if (response && response.data) {
      yield put(deleteEntityFullfiled(payload.entityName));
      if (payload.entityName == "lomMaterial" || payload.entityName == "users") {
        yield put(fetchEntity(payload.entityName, `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`));
      }
      else {
        if (!payload.skipFetch) {
          yield put(fetchEntity(payload.entityName, `offset=0&size=10&sortAttribute=updatedAt&sortOrder=DESC`));
        }
      }
    } else {
      yield put(deleteEntityFailed(payload.entityName));
    }
  } catch (e) {
    yield put(deleteEntityFailed(payload.entityName));
  }
}

function* updateEntityData(payload) {
  try {
    const response = yield call(
      entityApi.update,
      payload.entityName,
      payload.entityId,
      payload.jsonBody,
    );
    if (response && response.data) {
      if (payload.entityName == "lomMaterial") {
        yield put(fetchEntity(payload.entityName, `offset=0&size=100&sortAttribute=createdAt&sortOrder=ASC`));
      }
      else {
        yield put(fetchEntity(payload.entityName, `offset=0&size=10&sortAttribute=createdAt&sortOrder=ASC`));
      }
    } else {
      yield put(updateEntityFailed(payload.entityName));
    }
  } catch (e) {
    yield put(updateEntityFailed(payload.entityName));
  }
}


export function* fetchEntityDataSaga() {
  yield takeEvery(constants.FETCH_ENTITY, fetchEntityData);
}

export function* fetchSearchEntityDataSaga() {
  yield takeLatest(constants.FETCH_SEARCH_ENTITY, fetchSearchEntityData);
}

export function* addEntityDataSaga() {
  yield takeLatest(constants.ADD_ENTITY, addEntityData);
}

export function* deleteEntityDataSaga() {
  yield takeLatest(constants.DELETE_ENTITY, deleteEntityData);
}

export function* updateEntityDataSaga() {
  yield takeLatest(constants.UPDATE_ENTITY, updateEntityData);
}
