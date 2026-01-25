import React, { useState, useEffect } from "react";
import CustomInput from "../customInput/CustomInput";
import CustomModal from "../customModal/CustomModal";
import TextTypo from "../textTypo/TextTypo";
import FlexContainer from "../flexbox/FlexContainer";

const Input2WithRadioModal = ({
  modalLabel,
  label,
  label1,
  label2,
  label3,
  value,
  value1,
  value2,
  value3,
  radio1,
  radio2,
  isConductorRound,
  attributeName1,
  attributeName2,
  attributeName3,
  attributeName4,
  onChange,
  description,
  showUnlockIcon,
  handleToggleLock,
  isLocked,
}) => {
  const [modalValue1, setModalValue1] = useState(value1);
  const [modalValue2, setModalValue2] = useState(value2);
  const [modalValue3, setModalValue3] = useState(value3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConductorRoundModal, setIsConductorRoundModal] = useState(isConductorRound);

  useEffect(() => {
    setModalValue1(value1);
    setModalValue2(value2);
    setModalValue3(value3);
    setIsConductorRoundModal(isConductorRound)
  }, [value1, value2, value3, isConductorRound]);

  const handleInputClick = () => {
    if (!isLocked) {
    setModalValue1(value1);
    setModalValue2(value2);
    setModalValue3(value3);
    setIsConductorRoundModal(isConductorRound);
    setIsModalOpen(true);
    }
  };

  const handleModalSubmit = () => {
    onChange(attributeName1, modalValue1);
    onChange(attributeName2, modalValue2);
    onChange(attributeName3, modalValue3);
    onChange(attributeName4, isConductorRoundModal == "Round" ? true : false);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRadioChange = (value) => {
    setIsConductorRoundModal(value)
  };

  return (
    <div style={{ width: "100%" }}>
      <CustomInput
        label={label}
        value={value}
        onClick={handleInputClick}
        bgColor="#D7F3FC"
        borderColor="0.5px solid #00000033"
        readOnly={isLocked} 
        showUnlockIcon={showUnlockIcon}
        handleToggleLock={() => handleToggleLock()}
        isLocked={isLocked}
      />

      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        onModalSubmit={handleModalSubmit}
        title={label ? label : modalLabel}
      >

        { isConductorRound == "Round" &&
        <CustomInput
          type="radio"
          value={isConductorRoundModal == "Round" ? "Round" : "Strip"}
          radio1={radio1}
          radio2={radio2}
          onChange={(e) => handleRadioChange( e.target.value)}
        />}
        {/* <TextTypo text={description} margin="20px 0px" fontColor="grey" /> */}


        {isConductorRoundModal == "Round" ? (        <FlexContainer>
          <CustomInput
            label={label3}
            value={modalValue3}
            onChange={(e) => setModalValue3(e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
        </FlexContainer>) : (        <FlexContainer>
          <CustomInput
            label={label1}
            value={modalValue1}
            onChange={(e) => setModalValue1(e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
          <CustomInput
            label={label2}
            value={modalValue2}
            onChange={(e) => setModalValue2(e.target.value)}
            bgColor="#D7F3FC"
            borderColor="0.5px solid #00000033"
          />
        </FlexContainer>)}


      </CustomModal>
    </div>
  );
};

export default Input2WithRadioModal;
