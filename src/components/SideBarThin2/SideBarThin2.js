import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBarThin2.css";

const SideBarThin2 = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-icons-wrapper">
        <div className="sidebar-icons">
          <NavLink to="/profile">
            {({ isActive }) => (
              <div className={`tab-item ${isActive ? "active" : "inactive"}`}>
                Profile
              </div>
            )}
          </NavLink>

          <NavLink to="/users">
            {({ isActive }) => (
              <div className={`tab-item ${isActive ? "active" : "inactive"}`}>
                Users
              </div>
            )}
          </NavLink>

          <NavLink to="/lomCost">
            {({ isActive }) => (
              <div className={`tab-item ${isActive ? "active" : "inactive"}`}>
                LOM Material Rate
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SideBarThin2;
