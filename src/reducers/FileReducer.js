import * as constants from "../constants/FileConstants";

export const initialState = {
    lom: {
        data: [],
        isLoading: false,
        isFullfilled: false,
        isFailed: false,
        error: null,
    },
    customer: {
        data: { customerName: "", customerPlace: "" },
        isLoading: false,
        isFullfilled: false,
        isFailed: false,
        error: null,
    }
};

const FileReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.FETCH_FILE:
            return {
                ...state,
                lom: {
                    ...state.lom,
                    isLoading: true,
                    isFullfilled: false,
                    isFailed: false,
                    error: null
                }
            };

        case constants.FETCH_FILE_FULFILLED:
            return {
                ...state,
                lom: {
                    ...state.lom,
                    isLoading: false,
                    isFullfilled: true,
                    isFailed: false,
                    data: action.response,
                    error: null
                }
            };

        case constants.FETCH_FILE_FAILED:
            return {
                ...state,
                lom: {
                    ...state.lom,
                    isLoading: false,
                    isFullfilled: false,
                    isFailed: true,
                    error: action.response
                }
            };

        case constants.ADD_DATA_TO_LOM:
            return {
                ...state,
                lom: {
                    ...state.lom,
                    data: [...state.lom.data, action.payload],
                }
            };

        case constants.DELETE_DATA_FROM_LOM:
            return {
                ...state,
                lom: {
                    ...state.lom,
                    data: state.lom.data.filter((_, index) => index !== action.payload),
                }
            };

        case constants.ADD_CUSTOMER:
            return {
                ...state,
                customer: {
                    ...state.customer,
                    data: action.payload,
                    isLoading: false,
                    isFullfilled: true,
                    isFailed: false,
                    error: null
                }
            };
        case constants.RESET_CUSTOMER_DATA:
            return {
                ...state,
                customer: {
                    ...state.customer,
                    data: { customerName: "", customerPlace: "" },
                }
            };
        default:
            return state;
    }
};

export default FileReducer;