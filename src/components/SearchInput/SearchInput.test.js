import React from "react";
import { render, screen } from "@testing-library/react";
import SearchInput from "./SearchInput";

describe("SearchInput modes", () => {
  test("can render the search field and sort filter independently", () => {
    const { rerender } = render(
      <SearchInput value="" onChange={jest.fn()} showSort={false} />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    rerender(
      <SearchInput
        sortValue="updatedAt-DESC"
        onSortChange={jest.fn()}
        showField={false}
      />
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Sort designs" })).toBeInTheDocument();
  });
});
