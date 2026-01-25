import React from "react";
import SideBarThin from "../SideBarThin/SideBarThin.js";
import SideBarThin2 from "../SideBarThin2/SideBarThin2.js";
const ProfileLayout = (props) => {
  const { children } = props;
  return (
    <>
      <div className="d-flex">
        <SideBarThin />
        <SideBarThin2 />
      <div className="children-container">{children}</div>
      </div>
    </>
  );
};

export default ProfileLayout;
