import React, { useState } from 'react';
import "./CustomTabs.css";

const CustomTabs = ({ tabs, activeTabFromProps }) => {
  const [activeTab, setActiveTab] = useState(activeTabFromProps ? activeTabFromProps : tabs[0].key);

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div className="text-nav-tabs mt-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`text-nav-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="nav-tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`tab-panel ${activeTab === tab.key ? 'active' : ''}`}
          >
            {activeTab === tab.key && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTabs;
