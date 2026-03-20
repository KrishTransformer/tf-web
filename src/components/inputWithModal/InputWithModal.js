import React, { useState, useEffect } from "react";
import CustomInput from "../customInput/CustomInput";
import CustomModal from "../customModal/CustomModal";
import TextTypo from "../textTypo/TextTypo";


const InputWithModal = ({
  modalLabel,
  label,
  value,
  attributeName,
  onChange,
  description,
  showUnlockIcon,
  handleToggleLock,
  isLocked,
}) => {
  const [modalValue, setModalValue] = useState(value);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setModalValue(value);
  }, [value]);

  const handleInputClick = () => {
    if (!isLocked) {
      setModalValue(value);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = () => {
    onChange(attributeName, modalValue);
    // if (attributeName === "core.coreDia") {
    //   onChange("core.limbHt", 0);
    //   onChange("innerWindings.turnsPerPhase", "");
    //   onChange("outerWindings.turnsPerPhase", "");
    // }
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* CustomInput with conditional lock/unlock icon */}
     
        <CustomInput
          label={label}
          value={value}
          onClick={handleInputClick}
          bgColor="var(--app-input-accent-bg, #D7F3FC)"
          borderColor="var(--app-input-border, #00000033)"
          readOnly={isLocked} // Input is read-only when locked
          showUnlockIcon={showUnlockIcon}
          handleToggleLock={handleToggleLock}
          isLocked={isLocked}
        />
        {/* Conditionally render the unlock or lock icon */} 
      {/* Modal for input */}
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        onModalSubmit={handleModalSubmit}
        title={label ? label : modalLabel}
      >
        <TextTypo text={description} margin="20px 0px" fontColor="grey" />
        <CustomInput
          label={label ? label : modalLabel}
          value={modalValue}
          onChange={(e) => setModalValue(e.target.value)}
          bgColor="var(--app-input-accent-bg, #D7F3FC)"
          borderColor="var(--app-input-border, #00000033)"
        />
      </CustomModal>
    </div>
  );
};

export default InputWithModal;
