import React, { useState, useEffect } from "react";
import CustomInput from "../customInput/CustomInput";
import CustomModal from "../customModal/CustomModal";
import TextTypo from "../textTypo/TextTypo";
import FlexContainer from "../flexbox/FlexContainer";

const Input2WithModal = ({
  modalLabel,
  label,
  label1,
  label2,
  value,
  value1,
  value2,
  attributeName1,
  attributeName2,
  onChange,
  description,
  showUnlockIcon,
  handleToggleLock,
  isLocked,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) => {
  const [modalValue1, setModalValue1] = useState(value);
  const [modalValue2, setModalValue2] = useState(value);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setModalValue1(value1);
    setModalValue2(value2);
  }, [value1, value2]);

  const handleInputClick = () => {
    if (!isLocked) {
      setModalValue1(value1);
      setModalValue2(value2);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = () => {
    onChange(attributeName1, modalValue1);
    onChange(attributeName2, modalValue2);
    // if (attributeName1.includes("radialParallelCond")) {
    //   onChange("innerWindings.condBreadth", "");
    //   onChange("innerWindings.condHeight", "");
    //   onChange("innerWindings.conductorDiameter", "");
    // }
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <CustomInput
        label={label}
        value={value}
        onClick={handleInputClick}
        bgColor="var(--app-input-accent-bg, #D7F3FC)"
        borderColor="var(--app-input-border, #00000033)"
        readOnly={isLocked}
        showUnlockIcon={showUnlockIcon}
        handleToggleLock={() => handleToggleLock()}
        isLocked={isLocked}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        onModalSubmit={handleModalSubmit}
        title={label ? label : modalLabel}
      >
        <TextTypo text={description} margin="20px 0px" fontColor="grey" />
        <FlexContainer>
          <CustomInput
            label={label1}
            value={modalValue1}
            onChange={(e) => setModalValue1(e.target.value)}
            bgColor="var(--app-input-accent-bg, #D7F3FC)"
            borderColor="var(--app-input-border, #00000033)"
          />
          <CustomInput
            label={label2}
            value={modalValue2}
            onChange={(e) => setModalValue2(e.target.value)}
            bgColor="var(--app-input-accent-bg, #D7F3FC)"
            borderColor="var(--app-input-border, #00000033)"
          />
        </FlexContainer>
      </CustomModal>
    </div>
  );
};

export default Input2WithModal;
