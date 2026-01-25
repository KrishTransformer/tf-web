import { createSelector } from "reselect";
import TwoWinding from "../page/twoWinding/TwoWinding";

const getCalc = (state) => state.calc;
const getLom = (state) => state.lom;

export const selectCalc = createSelector(
  getCalc,
  (twoWindings) => twoWindings
);

export const selectFabrication = createSelector(
  getCalc,
  (fabrication) => fabrication
);

export const selectGenerate3D = createSelector(
  getCalc,
  (generate3d) => generate3d
);


export const selectCore = createSelector(
  getCalc,
  (core) => core
);

export const selectFile = createSelector(
  getLom,
  (lom) => lom
);