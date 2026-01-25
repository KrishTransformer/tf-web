import React from "react";
import "./SideBarThin.css";
import { CiLogin } from "react-icons/ci";
import { IoArrowBack, IoCalculatorOutline } from "react-icons/io5";
import { IoMdPerson, IoIosInformationCircleOutline } from "react-icons/io";
import { LuFileText } from "react-icons/lu";
import { TbLayoutNavbar } from "react-icons/tb";
import { HiOutlineCube } from "react-icons/hi2";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import logo from "./../../assets/dstar-electric-logo.png";

const SideBarThin = ({ id }) => {
  const location = useLocation();
  return (
    <div className="sideBar-thin-main">
      <div className="sideBar-thin-icons">
        <div>
          <NavLink to="/home">
            <div className="logo-container">
              <img src={logo} />
            </div>
          </NavLink>

          {location.pathname != '/home' && location.pathname!='/profile' 
          && location.pathname!='/users' 
          && location.pathname!='/lomCost' 
          && (
            <div className="sideBar-Icons">
              {/* <NavLink to="/home">
                <div className="icon-container">
                  <IoArrowBack />
                </div>
              </NavLink> */}
              <NavLink
                to={`/2windings/${id}`}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <div className="icon-container">
                  <IoCalculatorOutline />
                  <span>2Wdg</span>
                </div>
              </NavLink>
              <NavLink
                to={`/core/${id}`}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <div className="icon-container">
                  <HiOutlineCube />
                  <span>Core</span>
                </div>
              </NavLink>
              <NavLink
                to={`/fabrication/${id}`}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <div className="icon-container">
                  <TbLayoutNavbar />
                  <span>Fab</span>
                </div>
              </NavLink>
              <NavLink
                to={`/files/${id}`}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <div className="icon-container">
                  <LuFileText />
                  <span>Files</span>
                </div>
              </NavLink>
            </div>
          )}

        </div>
        <div className="sideBar-Icons">
          <div className="icon-container">
            <IoIosInformationCircleOutline />
          </div>

          <NavLink to="/profile">
            <div className="icon-container">
              <IoMdPerson />
            </div>
          </NavLink>

          <div className="icon-container">
            <CiLogin className="text-danger" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarThin;
