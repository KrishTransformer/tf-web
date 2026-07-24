import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  addCalcFullfiled,
  addCalcFailed,
  generate3DFullfiled,
  generate3DFailed,
} from "../actions/CalcActions";
import { addEntity, addEntityFailed, fetchEntity } from "../actions/EntityActions";
import * as constants from "../constants/CalcConstants";
import { postApi, putApi, deleteApi, getApi, entityApi } from "../api";
import { generateUniqueFiveDigitNumber } from "../utils/StringUtils";
import {
  CAD_SERVICE,
  STORAGE_SERVICE,
  MULTI_WDG_SERVICE,
  MULTI_WDG_CALCULATOR_PATH,
} from "../constants/CommonConstants";
import { mapMultiWindingResponseToFormState } from "../utils/multiWindingResponse";

export function* addCalcData({ jsonBody, calcName, bodyType, id, metadata }) {
  try {
    const response = calcName.includes("multiwindings")
      ? yield call(
          postApi,
          MULTI_WDG_CALCULATOR_PATH,
          jsonBody,
          { "X-Skip-Auth": "true" },
          {},
          MULTI_WDG_SERVICE
        )
      : bodyType
        ? yield call(postApi, `/calculate/` + calcName + bodyType, jsonBody, {
            "User-Calc": true,
          })
        : yield call(postApi, `/calculate/` + calcName, jsonBody);
    if (response && response.data) {
      if (calcName.includes("2windings")) {
        let twoWindingsDataPayload = response.data; 
        const metadataDesignId =
          response.data.kVA + "k-" + generateUniqueFiveDigitNumber();

        let twoWindingsMetadataPayload = {}
        twoWindingsMetadataPayload.designId = metadataDesignId;
        twoWindingsMetadataPayload.entityId = "";
        twoWindingsDataPayload.designId = metadataDesignId;

        let entityDesignPayload = {
          designId: metadataDesignId,
          twoWindings: JSON.stringify(twoWindingsDataPayload),
        };
        yield put(addCalcFullfiled(calcName, twoWindingsDataPayload, twoWindingsMetadataPayload));

        try {
          const entityResponse = yield call(
            entityApi.create,
            "design",
            entityDesignPayload
          );

          if (entityResponse && entityResponse.data) {
            let persistedEntityId =
              entityResponse?.data?.id ||
              entityResponse?.data?.data?.id ||
              twoWindingsMetadataPayload.entityId;

            if (!persistedEntityId && metadataDesignId) {
              const lookupResponse = yield call(
                entityApi.list,
                "design",
                "offset=0&size=1",
                { designId: [metadataDesignId] }
              );

              persistedEntityId = lookupResponse?.data?.data?.[0]?.id || "";
            }

            if (persistedEntityId && persistedEntityId !== twoWindingsMetadataPayload.entityId) {
              twoWindingsMetadataPayload = {
                ...twoWindingsMetadataPayload,
                entityId: persistedEntityId,
              };
              yield put(addCalcFullfiled(calcName, twoWindingsDataPayload, twoWindingsMetadataPayload));
            }

            yield put(fetchEntity("design", "offset=0&size=100"));
          } else {
            yield put(addEntityFailed("design"));
          }
        } catch (entityError) {
          console.error("Error saving design entity:", entityError);
          yield put(addEntityFailed("design"));
        }
      } else if (calcName.includes("multiwindings")) {
        yield put(
          addCalcFullfiled(
            calcName,
            mapMultiWindingResponseToFormState(response.data),
            metadata
          )
        );
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
      { "X-Skip-Auth": "true" },
      { responseType: 'blob' }
    );
    if (response && response.data) {
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Model file not found");
      }
      const blob = response.data;
      if (!(blob instanceof Blob)) {
        throw new Error('The response data is not a Blob');
      }

      const contentType = response.headers?.["content-type"] || "";
      if (
        blob.size === 0 ||
        contentType.includes("text/html") ||
        contentType.includes("application/json")
      ) {
        let errorDetails = "";
        try {
          errorDetails = yield call([blob, blob.text]);
        } catch (readError) {
          errorDetails = "";
        }

        throw new Error(
          `Unexpected model response for ${designId}.glb (${contentType || "unknown content type"})${errorDetails ? `: ${errorDetails.slice(0, 200)}` : ""}`
        );
      }

      console.log(blob);
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
