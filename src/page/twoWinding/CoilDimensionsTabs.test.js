import React from "react";
import { render, screen } from "@testing-library/react";
import CoilDimensionsTabs from "./CoilDimensionsTabs";
jest.mock("../../components", () => ({
  Container: ({ children }) => <div>{children}</div>,
  FlexContainer: ({ children }) => <div>{children}</div>,
  TextTypo: ({ text }) => <span>{text}</span>,
  CustomInput: () => null,
  CustomModal: () => null,
  NavTabs: ({ tabs }) => <div>{tabs.map((tab) => <div key={tab.key}>{tab.content}</div>)}</div>,
}));
const state = { core: {}, innerWindings: {}, outerWindings: {}, cost: {}, tank: {},
  lvFormulas: {}, hvFormulas: {}, commonFormulas: {}, tankAndOilFormulas: {},
  coilDimensions: { coreDia: 150, lvid: 170, lvod: 190, hvid: 210, hvod: 230 },
  rectCoilDimensions: { coreWidth: 90, coreDepth: 183, lvIdWidth: 100, lvIdDepth: 193,
    lvOdWidth: 120, lvOdDepth: 213, hvIdWidth: 140, hvIdDepth: 233,
    hvOdWidth: 160, hvOdDepth: 253, hvRadial: 10 },
};
test("rectangular tab shows width and depth for core, IDs and ODs", () => {
  render(<CoilDimensionsTabs formState={{ ...state, eTransBodyType: "RECTANGULAR" }} handleInputChange={jest.fn()} />);
  for (const value of ["90 X 183", "100 X 193", "120 X 213", "140 X 233", "160 X 253"]) {
    expect(screen.getByText(value)).toBeTruthy();
  }
  expect(screen.getByText("Core Dim =")).toBeTruthy();
});
test("circular tab keeps diameter values", () => {
  render(<CoilDimensionsTabs formState={{ ...state, eTransBodyType: "CIRCULAR" }} handleInputChange={jest.fn()} />);
  expect(screen.getByText("Core Dia:")).toBeTruthy();
  expect(screen.getByText("150")).toBeTruthy();
  expect(screen.queryByText("90 X 183")).toBeNull();
});
