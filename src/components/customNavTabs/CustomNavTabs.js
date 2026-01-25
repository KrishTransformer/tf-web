import React, { useState } from "react";
import "./CustomNavTabs.css";

const CustomNavTabs = ({ tabs, activeTabFromProps }) => {
  const [activeTab, setActiveTab] = useState(
    activeTabFromProps ? activeTabFromProps : tabs[0].key
  );

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div>
        <div className="nav-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleTabClick(tab.key)}
              style={{ order: index }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="nav-tab-content">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`tab-panel ${activeTab === tab.key ? "active" : ""}`}
            >
              {activeTab === tab.key && tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomNavTabs;
