import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CoreDimensionsInput from "./CoreDimensionsInput";
jest.mock("../../components", () => ({
  FlexContainer: ({ children }) => <div>{children}</div>,
  CustomInput: ({ label, ...props }) => <label>{label}<input aria-label={label} {...props} /></label>,
  CustomModal: ({ open, children, onClose, onModalSubmit }) => open ? <div>{children}<button onClick={onClose}>Cancel</button><button onClick={onModalSubmit}>OK</button></div> : null,
}));
const data = { core: { coreWidth: 80, coreDepth: 160 } };
function open(onSave = jest.fn(), formState = data) {
  render(<CoreDimensionsInput formState={formState} onSave={onSave} />);
  fireEvent.click(screen.getByLabelText("Core Dimensions"));
  return onSave;
}
test("prefills without creating overrides", () => {
  const save = open();
  expect(screen.getByLabelText("Core Width (mm)").value).toBe("80");
  expect(screen.getByLabelText("Core Depth (mm)").value).toBe("160");
  fireEvent.click(screen.getByText("OK"));
  expect(save).toHaveBeenCalledWith({});
});
test("editing width only leaves depth automatic", () => {
  const save = open();
  fireEvent.change(screen.getByLabelText("Core Width (mm)"), { target: { value: "90" } });
  fireEvent.click(screen.getByText("OK"));
  expect(save).toHaveBeenCalledWith({ coreWidth: 90 });
});
test("cancel discards draft", () => {
  const save = open();
  fireEvent.change(screen.getByLabelText("Core Depth (mm)"), { target: { value: "183" } });
  fireEvent.click(screen.getByText("Cancel"));
  expect(save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByLabelText("Core Dimensions"));
  expect(screen.getByLabelText("Core Depth (mm)").value).toBe("160");
});
test("reset removes overrides on confirmation", () => {
  const save = open(jest.fn(), { ...data, coreDimensionOverrides: { coreWidth: 90, coreDepth: 183 } });
  fireEvent.click(screen.getByText("Reset to calculated defaults"));
  fireEvent.click(screen.getByText("OK"));
  expect(save).toHaveBeenCalledWith({});
});
test("rejects invalid dimensions", () => {
  const save = open();
  fireEvent.change(screen.getByLabelText("Core Width (mm)"), { target: { value: "0" } });
  fireEvent.click(screen.getByText("OK"));
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(save).not.toHaveBeenCalled();
});
