import { createSelector } from "reselect";

const getConfig = (state) => state.config;

export const selectConfig = createSelector(getConfig, ({ config }) => config);