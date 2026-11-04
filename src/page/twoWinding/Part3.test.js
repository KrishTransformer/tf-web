import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Part3 from "./Part3";
jest.mock("../../components", () => ({
  CustomInput: ({ label, value, onChange }) => <input aria-label={label} value={value} onChange={onChange} />,
  Container: ({ children }) => <div>{children}</div>,
  FlexContainer: ({ children }) => <div>{children}</div>,
}));
jest.mock("./CoilDimensionsTabs", () => () => null);
test.each([["RECTANGULAR", "rectCoilDimensions", "4", "12", "20"], ["CIRCULAR", "coilDimensions", "2", "7", "8"]])(
  "%s clearance edits use their own dimension object", (body, key, coreGap, lvHvGap, hvHvGap) => {
    const onChange = jest.fn();
    render(<Part3 formState={{ eTransBodyType: body,
      rectCoilDimensions: { coreGap: "4", lvhvgap: "12", hvhvgap: "20" },
      coilDimensions: { coreGap: "2", lvhvgap: "7", hvhvgap: "8" } }}
      handleInputChange={onChange} handleHover={jest.fn()} handleMouseLeave={jest.fn()} />);
    for (const [label, field, value] of [["Core-LV Clr", "coreGap", coreGap], ["LV-HV Clr", "lvhvgap", lvHvGap], ["HV-HV Gap", "hvhvgap", hvHvGap]]) {
      expect(screen.getByLabelText(label).value).toBe(value);
      fireEvent.change(screen.getByLabelText(label), { target: { value: "15" } });
      expect(onChange).toHaveBeenLastCalledWith(`${key}.${field}`, "15");
    }
  }
);
