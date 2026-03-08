import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSlidersVertical } from "react-icons/lu";
import { BsSortAlphaDown } from "react-icons/bs";
import "./SearchInput.css";

const SearchInput = ({ placeholder, onChange, onKeyDown, onSortChange, width, margin, }) => {
  return (
    <>
      {/* Search Field */}
      <div className="search-container" style={{ width, margin }}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Sort By Dropdown */}
      <div className="search-container" style={{ width, margin }}>
        <BsSortAlphaDown className="search-icon" />
        <select className="search-input" onChange={onSortChange}>
          <option value="" disabled selected hidden>Sort By</option>
          <option value="updatedAt-ASC">updatedAt - ASC</option>
          <option value="updatedAt-DESC">updatedAt - DESC</option>
          <option value="designId-ASC">designId - ASC</option>
          <option value="designId-DESC">designId - DESC</option>
        </select>
      </div>
    </>
  );
};

export default SearchInput;
