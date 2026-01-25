import * as constants from "../constants/ConfigConstants";

export const fetchConfig = () => ({
	type: constants.FETCH_CONFIG,
});

export const fetchConfigFullfiled = (response) => ({
	type: constants.FETCH_CONFIG_FULFILLED,
	response,
});

export const fetchConfigFailed = () => ({
	type: constants.FETCH_CONFIG_FAILED,
});