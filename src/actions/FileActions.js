import * as constants from "../constants/FileConstants";
export const fetchFile = (data) => ({
  type: constants.FETCH_FILE,
  payload: data,
});

export const fetchFileFullfiled = (data) => ({
  type: constants.FETCH_FILE_FULFILLED,
  response: data.data,
});

export const fetchFileFailed = (error) => ({
  type: constants.FETCH_FILE_FAILED,
  response: error,
});

export const addDataToLom = (item) => ({
  type: constants.ADD_DATA_TO_LOM,
  payload: item,
});

export const deleteDataFromLom = (index) => ({
  type: constants.DELETE_DATA_FROM_LOM,
  payload: index,
});

export const addCustomer = (customer) => ({
  type: constants.ADD_CUSTOMER,
  payload: customer,
});

export const resetCustomerData = () => ({
  type: constants.RESET_CUSTOMER_DATA,
});