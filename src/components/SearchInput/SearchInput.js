import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSlidersVertical } from "react-icons/lu";
import { BsSortAlphaDown } from "react-icons/bs";

import { IconButton } from "@mui/material";
import "./SearchInput.css";

const SearchInput = ({ placeholder, onChange, onKeyDown, onSortChange, width, margin }) => {
  const [showFilter, setShowFilter] = useState(false);
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

      {/* Filter By Field */}
      <div className="search-container" style={{ width, margin }}>
        <LuSlidersVertical className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Filter By"
          onChange={onChange}
        />
        {/* <IconButton
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: "white",
            backgroundColor: "#000000ff",
            padding: "7px 30px",
            borderRadius: "10px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#000000ff",
            },
          }}
          onClick={() => setShowFilter(!showFilter)}
        >
          <LuSlidersVertical className="search-icon" />
          filter by
        </IconButton>
        {showFilter && (
          <div className="filter-options">
            
          </div>
        )} */}
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
