import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiTable,
  FiCommand,
  FiSettings,
  FiHome,
  FiHelpCircle,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";
import { LuFiles } from "react-icons/lu";
import "./TopNav.css";

const TopNav = () => {
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navItems = [
    { name: "Home", icon: <FiHome />, url: "/home" },
    { name: "2 Windings", icon: <FiCommand />, url: "/2windings" },
    { name: "Core", icon: <LuFiles />, url: "/core" },
    { name: "Fabrication", icon: <FiTable />, url: "/fabrication" },
    { name: "Files", icon: <FiSettings />, url: "/files" },
    { name: "Help", icon: <FiHelpCircle />, url: "/help" },
  ];

  const [activeNav, setActiveNav] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FiMenu />
        </div>
        <div className="logo">Logo1</div>
        <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <NavLink to={item.url} key={item.name}>
              <li
                className={`nav-item ${activeNav === item.url ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.url);
                  setIsMenuOpen(false);
                }}
              >
                <span
                  className={`icon ${
                    activeNav === item.url ? "active-icon" : ""
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </li>
            </NavLink>
          ))}
        </div>
        <div>
          <span
            type="button"
            className="avatar dropdown"
            onClick={toggleDropdown}
            ref={dropdownRef}
            style={{ cursor: "pointer", position: "relative" }}
          >
            JH
          </span>
          {dropdownVisible && (
            <div className="dropdownMenu">
              <div className="dropdownItem">
                <span className="dropdownHeading">Account</span>
                <div className="d-flex align-items-center">
                  <span className="avatar">JH</span>
                  <div className="ms-2 d-block">
                    <p className="m-0">Jhon Henry</p>
                    <p className="m-0">henry.jhon@gmail.com</p>
                  </div>
                </div>
              </div>
              <hr />
              <div className="dropdownItem">Edit Profile</div>
              <div className="dropdownItem">
                Logout <FiLogOut />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
