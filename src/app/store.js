import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import sagas from "../sagas";
import entityReducer from "../reducers/EntityReducer";
import authReducer from "../reducers/AuthReducer";
import configReducer from "../reducers/ConfigReducer";
import calcReducer from "../reducers/CalcReducer";
import FileReducer from "../reducers/FileReducer";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        entity: entityReducer,
        auth: authReducer,
        config: configReducer,
        calc: calcReducer,
        lom: FileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(sagas);
