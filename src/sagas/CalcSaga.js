import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  addCalcFullfiled,
  addCalcFailed,
  generate3DFullfiled,
  generate3DFailed,
} from "../actions/CalcActions";
import { addEntity } from "../actions/EntityActions";
import * as constants from "../constants/CalcConstants";
import { postApi, putApi, deleteApi, getApi } from "../api";
import { generateUniqueFiveDigitNumber } from "../utils/StringUtils";
import { CAD_SERVICE, STORAGE_SERVICE } from "../constants/CommonConstants";

function* addCalcData({ jsonBody, calcName, bodyType, id, metadata }) {
  try {
    let metadataDesignId = metadata?.designId;
    const response = bodyType
      ? yield call(postApi, `/calculate/` + calcName + bodyType, jsonBody, {
          "User-Calc": true,
        })
      : yield call(postApi, `/calculate/` + calcName, jsonBody);
    if (response && response.data) {
      if (calcName.includes("2windings")) {
        let twoWindingsDataPayload = response.data; 
        let entityDesignPayload = {};
        if (id && id != "") {
          console.log("overwrite");
          entityDesignPayload.id = id;
        } else {
          console.log("new");
          metadataDesignId =
          response.data.kVA + "k-" + generateUniqueFiveDigitNumber();
        }
        let twoWindingsMetadataPayload = {}
        twoWindingsMetadataPayload.designId = metadataDesignId;
        twoWindingsDataPayload.designId = metadataDesignId;
        yield put(addCalcFullfiled(calcName, twoWindingsDataPayload, twoWindingsMetadataPayload));
        entityDesignPayload.designId = metadataDesignId;
        entityDesignPayload.twoWindings = JSON.stringify(response.data);
        yield put(addEntity(entityDesignPayload, "design"));
      } else if (calcName.includes("core")) {
        let payload = response.data; 
        let dataPayload = {};        
        yield put(addCalcFullfiled(calcName, payload));
        dataPayload.core = JSON.stringify(response.data);
        yield put(addEntity(dataPayload, "design/" + id, true));
      } else if(calcName.includes("fabrication")){
        console.log("fab",id);
        let payload = response.data; 
        let dataPayload = {};        
        yield put(addCalcFullfiled(calcName, payload));
        dataPayload.fabrication = JSON.stringify(response.data);
        yield put(addEntity(dataPayload, "design/" + id, true));
      }
       else {
        yield put(addCalcFullfiled(calcName, response.data));
      }
    } else {
      yield put(addCalcFailed(calcName));
    }
  } catch (error) {
    console.error("Error adding calc data:", error);
    yield put(addCalcFailed(calcName));
  }
}

function* generate3DData({ payload, params, calcName }) {
  try {
    const response = yield call(
      postApi,
      `/cad/run-3d-generation`,
      payload,
      {},
      params,
      CAD_SERVICE
    );
    if (response && response.data) {
      yield put(generate3DFullfiled(calcName, response.data));
      if (response?.data?.message?.includes("fabrication")) {
        let dataPayload = {};
        dataPayload.designId = params.fileName;
        dataPayload.message = "Generate 3D Requested";
        dataPayload.status = "Success";
        yield put(addEntity(dataPayload, "drawingsStatus",true));
      } else {
        console.log("Fabarication not in cad serivice response");
      }
    } else {
      yield put(generate3DFailed(calcName));
    }
  } catch (error) {
    console.error("Error adding calc data:", error);
    yield put(generate3DFailed(calcName));
  }
}

function* load3DData({ designId }) {
  try {
    console.log(designId);
    const response = yield call(
      getApi,
      `/models/${designId}.glb`,
      STORAGE_SERVICE,
      {},
      {},
      { responseType: 'blob' }
    );
    if (response && response.data) {
      // console.log(response.data)
      if (response.status != 200) throw new Error("Model file not found");
      // let blob = response.data.blob();
      // let dataPayload = {};
      // dataPayload.designId = params.fileName;
      // dataPayload.status = "GENERATE_3D_REQUESTED";
      // Create an object URL for the 
      const blob = response.data;
      if (!(blob instanceof Blob)) {
        throw new Error('The response data is not a Blob');
      }
      console.log(blob)
      const objectURL = URL.createObjectURL(blob);
      console.log(objectURL);
      yield put(generate3DFullfiled(objectURL));
    } else {
      yield put(generate3DFailed());
    }
  } catch (error) {
    console.error("Error adding calc data:", error);
    yield put(generate3DFailed());
  }
}

export function* addCalcDataSaga() {
  yield takeLatest(constants.ADD_CALC, addCalcData);
}

export function* generate3DDataSaga() {
  yield takeLatest(constants.GENERATE_3D, generate3DData);
}

export function* load3DDataSaga() {
  yield takeLatest(constants.LOAD_3D, load3DData);
}
