import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useActions } from "../../app/use-Actions";
import Home from "./Home";

jest.mock("react-redux", () => ({ useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }));
jest.mock("../../app/use-Actions", () => ({ useActions: jest.fn() }));
jest.mock("../../api/authToken", () => ({
  clearAuthTokens: jest.fn(),
  getIdToken: jest.fn(() => null),
}));
jest.mock("../../api", () => ({ postApi: jest.fn() }));
jest.mock("../../components", () => ({
  CheckedTable: ({ rows }) => <div data-testid="row-count">{rows.length}</div>,
  CustomModal: () => null,
  Layout: ({ children }) => <div>{children}</div>,
  SearchInput: () => <input aria-label="design search" />,
}));
jest.mock("../../components/DeletingConfirmation", () => () => null);

describe("Home pagination", () => {
  const actions = {
    fetchEntity: jest.fn(),
    fetchSearchEntity: jest.fn(),
    clearCalc: jest.fn(),
    generate3DCleared: jest.fn(),
    resetCustomerData: jest.fn(),
    deleteEntity: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useActions.mockReturnValue(actions);
    let selectorCall = 0;
    const selectorValues = [
      {
        twoDesigns: { data: { data: [], total: 41 } },
        multiDesigns: { data: { data: [], total: 41 } },
      },
      { name: "Tester" },
      { generate3d: {} },
    ];
    useSelector.mockImplementation(
      () => selectorValues[selectorCall++ % selectorValues.length]
    );
  });

  test("requests and paginates only the active design tab", async () => {
    render(<Home />);

    await waitFor(() =>
      expect(actions.fetchEntity).toHaveBeenCalledWith(
        "design",
        "offset=0&size=20&sortAttribute=updatedAt&sortOrder=DESC",
        { twoWindings: { exists: true } },
        "twoDesigns"
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    await waitFor(() =>
      expect(actions.fetchEntity).toHaveBeenLastCalledWith(
        "design",
        "offset=1&size=20&sortAttribute=updatedAt&sortOrder=DESC",
        { twoWindings: { exists: true } },
        "twoDesigns"
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "MWdg" }));

    await waitFor(() =>
      expect(actions.fetchEntity).toHaveBeenLastCalledWith(
        "design",
        "offset=0&size=20&sortAttribute=updatedAt&sortOrder=DESC",
        { multiWindings: { exists: true } },
        "multiDesigns"
      )
    );

    fireEvent.click(screen.getByRole("button", { name: "2Wdg" }));

    await waitFor(() =>
      expect(actions.fetchEntity).toHaveBeenLastCalledWith(
        "design",
        "offset=1&size=20&sortAttribute=updatedAt&sortOrder=DESC",
        { twoWindings: { exists: true } },
        "twoDesigns"
      )
    );
  });
});
