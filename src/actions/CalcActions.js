import * as constants from "../constants/CalcConstants";

export const generate3DRequest = (payload, params, calcName) => {
  return {
    type: constants.GENERATE_3D,
    payload,
    params,
    calcName,
  };
};

export const load3DRequest = (designId, calcName) => {
  return {
    type: constants.LOAD_3D,
    designId,
    calcName
  };
};

export const generate3DFullfiled = (response) => {
  let output = {
    blob: response,
  };
  return {
    type: constants.GENERATE_3D_FULFILLED,
    calcName: "generate3d",
    response: output,
  };
};

export const generate3DFailed = (calcName) => ({
  type: constants.GENERATE_3D_FAILED,
  calcName: "generate3d",
});

export const generate3DCleared = () => ({
  type: constants.GENERATE_3D_CLEARED,
  calcName: "generate3d",
});

export const addCalc = (jsonBody, calcName, bodyType, id, metadata) => ({
  type: constants.ADD_CALC,
  jsonBody,
  calcName,
  bodyType,
  id,
  metadata
});

export const addCalcFullfiled = (calcName, response, metadata) => ({
  type: constants.ADD_CALC_FULFILLED,
  calcName: calcName == "2windings" ? "twoWindings" : calcName,
  response,
  metadata,
});

export const addCalcFailed = (calcName) => ({
  type: constants.ADD_CALC_FAILED,
  calcName: calcName == "2windings" ? "twoWindings" : calcName,
});

export const clearCalc = () => ({
  type: constants.CLEAR_CALC_FULFILLED,
});
