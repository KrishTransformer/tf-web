import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useActions } from "../../app/use-Actions";
import { mapMultiWindingResponseToFormState } from "../../utils/multiWindingResponse";
import MultiWinding from "./MultiWinding";

jest.mock("react-redux", () => ({ useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useParams: () => ({ id: "new" }) }));
jest.mock("../../app/use-Actions", () => ({ useActions: jest.fn() }));
jest.mock("./Part1", () => () => null);
jest.mock("./Part3", () => () => null);
jest.mock("../../components", () => ({
  Container: ({ children }) => <div>{children}</div>,
  Layout: ({ children }) => <div>{children}</div>,
  FlexContainer: ({ children }) => <div>{children}</div>,
  TextTypo: ({ text }) => <span>{text}</span>,
  CustomInput: require("../../components/customInput/CustomInput").default,
}));

const cell = (label, column = 0) => {
  let element = screen.getByText(label, { selector: ".multi-winding-part2-label-text" }).parentElement;
  for (let i = 0; i <= column; i += 1) element = element.nextElementSibling;
  return element;
};
const popup = () => within(screen.getByRole("button", { name: "OK" }).closest(".custom-modal-shell"));

const openDesign = (response) => {
  const data = mapMultiWindingResponseToFormState(response);
  useSelector.mockReturnValue({ multiWindings: { data, isLoading: false } });
  const actions = { addCalc: jest.fn(), clearCalc: jest.fn() };
  useActions.mockReturnValue(actions);
  window.scrollTo = jest.fn();
  render(<MultiWinding />);
  fireEvent.click(screen.getByRole("button", { name: "Windings" }));
  return actions;
};

test("unlocking conductor sizes preserves the current values in the popup and permits saving", () => {
  const actions = openDesign({
    selectedCode: "3_WDG",
    lockedAttributes: { lvWindings: { conductorSizes: true } },
    inputs: { windingModels: { lv: { condBreadth: 9.1, condHeight: 3.6, isConductorRound: false } } },
  });
  fireEvent.click(cell("Conductor Sizes (mm)").querySelector("svg"));
  fireEvent.click(cell("Conductor Sizes (mm)").querySelector("input"));
  expect(popup().getByDisplayValue("9.1")).toBeInTheDocument();
  expect(popup().getByDisplayValue("3.6")).toBeInTheDocument();
  fireEvent.change(popup().getByDisplayValue("9.1"), { target: { value: "10.2" } });
  fireEvent.click(popup().getByRole("button", { name: "OK" }));
  fireEvent.click(cell("Conductor Sizes (mm)").querySelector("svg"));
  fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
  expect(actions.addCalc.mock.calls[0][0].lvWindings).toMatchObject({ condBreadth: 10.2, condHeight: 3.6 });
});

test("duct popup restores calculated zero and width, discards Cancel, and reopens with saved values", () => {
  openDesign({ selectedCode: "3_WDG", inputs: { windingModels: { lv: { ducts: 0, ductSize: 4 } } } });
  const open = () => fireEvent.click(cell("No. of Ducts / Width").querySelector("input"));
  open();
  expect(popup().getByDisplayValue("0")).toBeInTheDocument();
  fireEvent.change(popup().getByDisplayValue("4"), { target: { value: "7" } });
  fireEvent.click(popup().getByRole("button", { name: "Cancel" }));
  open();
  expect(popup().getByDisplayValue("4")).toBeInTheDocument();
  fireEvent.change(popup().getByDisplayValue("4"), { target: { value: "6" } });
  fireEvent.click(popup().getByRole("button", { name: "OK" }));
  open();
  expect(popup().getByDisplayValue("6")).toBeInTheDocument();
});

test("round conductor and parallel popups restore calculated result values", () => {
  openDesign({ selectedCode: "3_WDG", results: { hvWinding: { hvIsConductorRound: true, hvBreadth: 1.2, hvRadialParallelConductors: 2, hvAxialParallelConductors: 3 } } });
  fireEvent.click(cell("Conductor Sizes (mm)", 1).querySelector("input"));
  expect(popup().getByDisplayValue("1.2")).toBeInTheDocument();
  fireEvent.click(popup().getByRole("button", { name: "Cancel" }));
  fireEvent.click(cell("No. in Parallel", 1).querySelector("input"));
  expect(popup().getByDisplayValue("2")).toBeInTheDocument();
  expect(popup().getByDisplayValue("3")).toBeInTheDocument();
});

test("all five disc duct fields are editable and DISC and LAYER_DISC edits reach the request", () => {
  const actions = openDesign({
    selectedCode: "5_WDG",
    results: {
      windingTypes: { lv: "LAYER_DISC", hv: "DISC", corse: "HELICAL", fine: "HELICAL", outer: "DISC" },
      lvWinding: { lvDiscDuctsSize: 3 },
      hvWinding: { hvDiscDuctsSize: 4 },
      outerWinding: { discDuctSize: 5 },
    },
  });
  for (let column = 0; column < 5; column += 1) {
    const input = cell("Disc Duct Size (mm)", column).querySelector("input");
    expect(input).not.toHaveAttribute("readonly");
    fireEvent.change(input, { target: { value: "7" } });
    expect(input).toHaveValue("7");
  }
  fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
  const payload = actions.addCalc.mock.calls[0][0];
  expect(payload.lvWindings.ductSize).toBe(7);
  expect(payload.hvWindings.ductSize).toBe(7);
  expect(payload.outerWindings.ductSize).toBe(7);
});
