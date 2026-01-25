import * as constants from "../constants/ConfigConstants";
const initialState = {
	config: {
		isLoading: false,
		isFullfilled: false,
		isFailed: false,
		data: {},
	},
};

const configReducer = (state, action) => {
	const configState = state ? state : initialState;
	switch (action.type) {
		case constants.FETCH_CONFIG:
			return {
				config: {
					...configState.config,
					isLoading: true,
					isFullfilled: false,
					isFailed: false,
				},
			};
		case constants.FETCH_CONFIG_FULFILLED:
			return {
				config: {
					...configState.config,
					isLoading: false,
					isFullfilled: true,
					isFailed: false,
					data: action.response.data,
				},
			};
		case constants.FETCH_CONFIG_FAILED:
			return {
				config: {
					...configState.config,
					isFailed: true,
					isFullfilled: false,
				},
			};

		default:
			return configState;
	}
};

export default configReducer;