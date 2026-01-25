import { createSelector } from "reselect";

const getEntity = (state) => state.entity;

export const selectEntity  = createSelector(
	getEntity,
	({ entity }) => entity
);
