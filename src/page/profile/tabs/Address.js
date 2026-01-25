import React, { useEffect, useState } from "react";
import { FlexContainer, CustomInput, TextTypo } from "../../../components";

// const countryStates = {
//   India: [
//     "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//     "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
//     "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
//     "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
//     "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
//     "West Bengal", "Delhi", "Ladakh", "Jammu and Kashmir"
//   ],
//   USA: [
//     "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
//     "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
//     "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
//     "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
//     "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
//     "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
//     "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
//     "Wisconsin", "Wyoming"
//   ]
// };


// const countryStateMap = Object.fromEntries(
//   Object.entries(countryStates).map(([country, states]) => [
//     country,
//     states.map((state) => ({ value: state, label: state })),
//   ])
// );

const Address = ({
  initialData,
  onChange}) => {
  const{state, city, address, pincode}=initialData;

  // const [billingStates, setBillingStates] = useState([]);

  // useEffect(() => {
  //   onChange(initialData);

  //   if (country) {
  //     setBillingStates(countryStateMap[country] || []);
  //   }
  // }, [initialData, onChange]);


  // const handleBillingChange = (field, value) => {
  //   AddressChange({ ...Address, [field]: value });
  //   if (field === "country") {
  //     setBillingStates(countryStateMap[value] || []);
  //     onChange({ ...Address, state: "", city: "" });
  //   }
  // };

  
  return (
    <FlexContainer>
      <FlexContainer direction="column" width="100%" margin="0px 50px 0px 0px">
        {/* <TextTypo text="Billing Address" fontSize="18px" fontWeight="600" /> */}
       
        <CustomInput
          type="text"
          label="State"
          name="state"
          required={true}
          value={state}
          defaultOption="Select state"
          onChange={(e) =>  onChange(e,"Address")}
          // options={billingStates}
          margin="0px"
        />
          <CustomInput
            type="text"
            label="City"
            name="city"
            required={true}
            value={city}
            defaultOption="Select city"
            onChange={(e) =>  onChange(e,"Address")}
            margin="0px"
          />
        <CustomInput
          type="textarea"
          label="Address"
          required={true}
          name="address"
          value={address}
          margin="0px"
          placeholder="Street 1"
          onChange={(e) =>  onChange(e,"Address")}
        />

        {/* <CustomInput
          type="text"
          label="District"
          value={Address.district}
          defaultOption="Select district"
          onChange={(e) => onChange("district", e.target.value)}
          margin="0px"
        /> */}
        <CustomInput
          type="text"
          margin="0px"
          name="pincode"
          required={true}
          label="Pin Code"
          value={pincode}
          onChange={(e) =>  onChange(e,"Address")}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default Address;
