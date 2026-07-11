import React, { useEffect } from "react";
import "./SideBarThin.css";
import { CiLogin } from "react-icons/ci";
import { IoArrowBack, IoCalculatorOutline, IoHomeOutline } from "react-icons/io5";
import { IoMdPerson, IoIosInformationCircleOutline } from "react-icons/io";
import { LuFileText } from "react-icons/lu";
import { TbLayoutNavbar } from "react-icons/tb";
import { HiOutlineCube } from "react-icons/hi2";
import { NavLink, useHistory, useLocation } from "react-router-dom";

const SideBarThin = ({ id }) => {
  const location = useLocation();
  const isTwoWindingRoute = location.pathname.startsWith("/2windings");
  const isMultiWindingRoute = location.pathname.startsWith("/multiwindings");
  const isNewDesign = id === "new";
  const selectedNewDesignType = sessionStorage.getItem("newDesignType");

  useEffect(() => {
    if (isTwoWindingRoute) {
      sessionStorage.setItem("newDesignType", "two");
    } else if (isMultiWindingRoute) {
      sessionStorage.setItem("newDesignType", "multi");
    }
  }, [isMultiWindingRoute, isTwoWindingRoute]);

  const currentDesignType = isMultiWindingRoute
    ? "multi"
    : isTwoWindingRoute
      ? "two"
      : selectedNewDesignType === "multi"
        ? "multi"
        : "two";

  const showTwoWindingLink = currentDesignType === "two";
  const showMultiWindingLink =
    currentDesignType === "multi" && (isMultiWindingRoute || isNewDesign);

  const rememberDesignType = (designType) => {
    sessionStorage.setItem("newDesignType", designType);
  };

  return (
    <div className="sideBar-thin-main">
      <div className="sideBar-thin-icons">
        <div>
          <NavLink to="/home">
            <div className="logo-container">
              <IoHomeOutline className="logo-container-icon" />
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
              {showTwoWindingLink && (
                <NavLink
                  to={`/2windings/${id}`}
                  onClick={() => rememberDesignType("two")}
                  className={({ isActive }) => (isActive ? "active" : "inactive")}
                >
                  <div className="icon-container">
                    <IoCalculatorOutline />
                    <span>2Wdg</span>
                  </div>
                </NavLink>
              )}
              {showMultiWindingLink && (
                <NavLink
                  to={`/multiwindings/${id}`}
                  onClick={() => rememberDesignType("multi")}
                  className={({ isActive }) => (isActive ? "active" : "inactive")}
                >
                  <div className="icon-container">
                    <IoCalculatorOutline />
                    <span>MWdg</span>
                  </div>
                </NavLink>
              )}
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

      </div>
    </div>
  );
};

export default SideBarThin;
