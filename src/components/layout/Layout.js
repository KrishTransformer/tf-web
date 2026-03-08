import React from "react";
import TopNav from "../topNav/TopNav.js";
import SideBarThin from "../SideBarThin/SideBarThin.js";
import { useNavigate } from "react-router-dom";
import ThinHeader from "../ThinHeader/index.js";
const Layout = (props) => {
  const navigate = useNavigate();
  const { id, children, headProps, isThinHeader, hideSidebar = false } = props;
  const childrenContainerClass = hideSidebar
    ? "children-container children-container-full"
    : "children-container";

  return (
    <div className="d-flex">
      {/* <TopNav /> */}
      {!hideSidebar && <SideBarThin id={id} />}
      <div style={hideSidebar ? { width: "100%" } : {}}>
        {isThinHeader && (
          <ThinHeader
            onRefresh={() => {
              headProps?.onRefresh
                ? headProps?.onRefresh()
                : window.location.reload();
            }}
            otherPaths={headProps?.otherPaths}
            currentPath={headProps?.currentPath}
            navigate={navigate}
          />
        )}
        <div className={childrenContainerClass}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
