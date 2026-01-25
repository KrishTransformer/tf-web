import { createSelector } from "reselect";

const getAuth = (state) => state.auth;

export const selectAuth = createSelector(getAuth, ({ auth }) => auth);
