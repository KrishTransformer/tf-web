import React from "react";
import { FaSearch } from "react-icons/fa";
import { BsSortAlphaDown } from "react-icons/bs";
import "./SearchInput.css";

const SearchInput = ({
  placeholder,
  value,
  sortValue,
  onChange,
  onKeyDown,
  onSortChange,
  inputWidth,
  selectWidth,
  margin,
}) => {
  return (
    <>
      <div className="search-container search-container-field" style={{ width: inputWidth, margin }}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="search-container search-container-sort" style={{ width: selectWidth, margin }}>
        <BsSortAlphaDown className="search-icon" />
        <select className="search-input" onChange={onSortChange} value={sortValue}>
          <option value="updatedAt-DESC">Recently Updated</option>
          <option value="updatedAt-ASC">Oldest Updated</option>
          <option value="designId-ASC">Design Ref A-Z</option>
          <option value="designId-DESC">Design Ref Z-A</option>
        </select>
      </div>
    </>
  );
};

export default SearchInput;
