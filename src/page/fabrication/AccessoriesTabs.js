import React from "react";
import { CustomNavTabs } from "../../components";
import Accessories1 from "./tabsContent/Accessories1";
import Accessories2 from "./tabsContent/Accessories2";
import Bushings from "./tabsContent/Bushings";
import CableBox from "./tabsContent/CableBox";
import Stiffners from "./tabsContent/Stiffners";
import Misc from "./tabsContent/Misc";
import Terminal from "./tabsContent/Terminal";

const AccessoriesTabs = ({ formState, handleInputChange }) => {
  const tabs = [
    {
      key: "accessories-1",
      label: "Accessories (1)",
      content: (
        <Accessories1
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      key: "accessories-2",
      label: "Accessories (2)",
      content: (
        <Accessories2
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
    // {
    //   key: "bushings",
    //   label: "Bushings",
    //   content: (
    //     <Bushings formState={formState} handleInputChange={handleInputChange} />
    //   ),
    // },
    // {
    //   key: "cableBoxes",
    //   label: "Cable Boxes",
    //   content: (
    //     <CableBox formState={formState} handleInputChange={handleInputChange} />
    //   ),
    // },
    {
      key: "terminals",
      label: "Terminals",
      content: (
        <Terminal formState={formState} handleInputChange={handleInputChange} />
      ),
    },
    {
      key: "stiffeners",
      label: "Stiffeners",
      content: (
        <Stiffners
          formState={formState}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      key: "misc",
      label: "Misc",
      content: (
        <Misc formState={formState} handleInputChange={handleInputChange} />
      ),
    },
    
  ];

  return (
    <div>
      <CustomNavTabs tabs={tabs} />
    </div>
  );
};

export default AccessoriesTabs;
