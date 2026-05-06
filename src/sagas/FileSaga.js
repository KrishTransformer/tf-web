import { call, put, takeLatest } from "redux-saga/effects";
import { CORE_SERVICE } from "../constants/CommonConstants";
import * as constants from "../constants/FileConstants";
import { postApi } from "../api";
import {
    fetchFileFullfiled,
    fetchFileFailed,
} from "../actions/FileActions";

const LOM_BOOLEAN_KEYS = [
    "hvCableBox",
    "lvCableBox",
    "hvBushing",
    "lvBushing",
    "permaWood",
    "drainValve",
    "filterValve",
    "samplingValve",
    "relayShutOffValve",
    "thermometerPocket",
    "airReleasePlug",
    "oltc",
    "octc",
    "oti",
    "wti",
    "buchholzRelay",
    "marshallingBox",
    "oilLevelGauge",
    "mog",
    "pressureReliefValve",
    "oilCirculatingPump",
    "avrrtcc",
    "rollers",
    "pumpControlCubicle",
    "biMetallicConnector",
    "fasteners",
];

const LOM_QUANTITY_KEYS = [
    "lamination",
    "hvConductor",
    "lvConductor",
    "hvConnectionLeads",
    "lvConnectionLeads",
    "insulationMaterial",
    "transformerOil",
    "tankLidEtc",
    "hvCableBox",
    "lvCableBox",
    "hvBushing",
    "lvBushing",
    "radiatorsAndHeatExc",
    "permaWood",
    "drainValve",
    "filterValve",
    "samplingValve",
    "relayShutOffValve",
    "breatherSilicaGel",
    "ratingPlate",
    "thermometerPocket",
    "airReleasePlug",
    "coreBoltsAndTieRods",
    "oltc",
    "octc",
    "oti",
    "wti",
    "buchholzRelay",
    "marshallingBox",
    "oilLevelGauge",
    "mog",
    "pressureReliefValve",
    "oilCirculatingPump",
    "avrrtcc",
    "rollers",
    "pumpControlCubicle",
    "biMetallicConnector",
    "fasteners",
    "otherMaterials",
];

const LOM_RATE_KEYS = [
    "lamination",
    "hvConductor",
    "lvConductor",
    "hvConnectionLeads",
    "lvConnectionLeads",
    "insulationMaterial",
    "transformerOil",
    "tankLidEtc",
    "hvCableBox",
    "lvCableBox",
    "hvBushing",
    "lvBushing",
    "radiatorsAndHeatExc",
    "permaWood",
    "drainValve",
    "filterValve",
    "samplingValve",
    "relayShutOffValve",
    "breatherSilicaGel",
    "ratingPlate",
    "thermometerPocket",
    "airReleasePlug",
    "coreBoltsAndTieRods",
    "oltc",
    "octc",
    "oti",
    "wti",
    "buchholzRelay",
    "marshallingBox",
    "oilLevelGauge",
    "mog",
    "pressureReliefValve",
    "oilCirculatingPump",
    "avrrtcc",
    "rollers",
    "pumpControlCubicle",
    "biMetallicConnector",
    "fasteners",
    "otherMaterials",
];

const CONDITIONAL_RATE_KEYS = {
    hvCableBox: "hvCableBox",
    lvCableBox: "lvCableBox",
    hvBushing: "hvBushing",
    lvBushing: "lvBushing",
    drainValve: "drainValve",
    filterValve: "filterValve",
    samplingValve: "samplingValve",
    oltc: "oltc",
    octc: "octc",
    oilLevelGauge: "oilLevelGauge",
    mog: "mog",
    pressureReliefValve: "pressureReliefValve",
    rollers: "rollers",
};

const pickKnownKeys = (source = {}, keys = []) =>
    keys.reduce((acc, key) => {
        if (source[key] !== undefined) {
            acc[key] = source[key];
        }
        return acc;
    }, {});

const normalizeLomPayload = (payload = {}) => {
    const incomingBooleans = payload.lomBooleans || {};
    const normalizedBooleans = {
        ...incomingBooleans,
        ...(incomingBooleans.biMetallicConn !== undefined &&
        incomingBooleans.biMetallicConnector === undefined
            ? { biMetallicConnector: incomingBooleans.biMetallicConn }
            : {}),
    };

    const lomBooleans = pickKnownKeys(normalizedBooleans, LOM_BOOLEAN_KEYS);
    const lomQuantity = pickKnownKeys(payload.lomQuantity, LOM_QUANTITY_KEYS);
    const lomRate = pickKnownKeys(payload.lomRate, LOM_RATE_KEYS);

    Object.entries(CONDITIONAL_RATE_KEYS).forEach(([booleanKey, rateKey]) => {
        if (lomBooleans[booleanKey] === false) {
            delete lomRate[rateKey];
        }
    });

    return {
        isTrue: payload.isTrue === undefined ? true : payload.isTrue,
        lomBooleans,
        lomQuantity,
        lomRate,
    };
};


function* fetchFileData({ payload }) {
    try {
        const path = "/files/lom";
        const normalizedPayload = normalizeLomPayload(payload);
        const response = yield call(postApi, path, normalizedPayload, {}, {}, CORE_SERVICE);
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
