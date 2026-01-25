import React from "react";
import TopNav from "../topNav/TopNav.js";
import SideBarThin from "../SideBarThin/SideBarThin.js";
import { useNavigate } from "react-router-dom";
import ThinHeader from "../ThinHeader/index.js";
const Layout = (props) => {
  const navigate = useNavigate();
  const { id, children, headProps, isThinHeader } = props;
  return (
    <div className="d-flex">
      {/* <TopNav /> */}
      <SideBarThin id={id} />
      <div>
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
        <div className="children-container">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
