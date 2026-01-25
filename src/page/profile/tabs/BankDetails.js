import React from "react";
import {
  Container,
  FlexContainer,
  CustomInput,
} from "../../../components";

const BankDetails = ({ onChange, initialData }) => {
  const { pan, Accountnumber, IFSC, SWIFTCode, BankName , Branch, GSTIN} = initialData;

//   const currencyOptions = [
//     { value: "inr", label: "INR - Indian Rupees" },
//     { value: "usd", label: "USD - US Dollars" },
//   ];

//   const paymentTermsOptions = [
//     { value: "due_on_receipt", label: "Due on Receipt" },
//     { value: "net_30", label: "Net 30" },
//     { value: "net_60", label: "Net 60" },
//   ];

//   const portalLanguageOptions = [
//     { value: "english", label: "English" },
//     { value: "hindi", label: "Hindi" },
//   ];

  return (
    <Container>
      <FlexContainer>
        <CustomInput
          type="text"
          label="PAN"
          name="pan"
          value={pan}
          placeholder="Enter PAN number"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
        <CustomInput
          type="text"
          name="GSTIN"
          label="GSTIN"
          value={GSTIN}
          placeholder="Enter GSTIN number"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
      </FlexContainer>
      <FlexContainer>
        <CustomInput
          type="text"
          label="Account Number"
          name="Accountnumber"
          value={Accountnumber}
          placeholder="Enter Account number"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
        <CustomInput
          type="text"
          label="IFSC"
          name="IFSC"
          value={IFSC}
          placeholder="Enter IFSC Code"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
      </FlexContainer>
      <FlexContainer>
        <CustomInput
          type="text"
          label="SWIFT Code"
          name="SWIFTCode"
          value={SWIFTCode}
          placeholder="Enter SWIFT Code"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
        <CustomInput
          type="text"
          label="Bank Name"
          name="BankName"
          value={BankName}
          placeholder="Enter Bank Name"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
      </FlexContainer>
      <FlexContainer>
      <CustomInput
          type="text"
          name="Branch"
          label="Branch"
          value={Branch}
          placeholder="Enter Branch"
          onChange={(e) => onChange(e,"otherDetails")}
          width="50%"
          required={true}
        />
      </FlexContainer>
      
    </Container>
  );
};

export default BankDetails;
