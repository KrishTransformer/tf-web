import React, { useState } from "react";
import {
  Container,
  CustomInput,
  CustomFlexInput,
  CustomModal,
  FlexContainer,
  CustomTabs,
  ImagePreview,
  TextTypo,
} from "../../../components";

const Bushings = ({ formState, handleInputChange }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const BushingTabs = [
    {
      key: "HV Bushing Preview",
      label: "HV Bushing Preview",
  /*HV*/    content: (
        <FlexContainer direction="column">

          <Container bgColor="white" padding="10px" borderRadius="20px">
            <ImagePreview btnText="Maximize" btnOnClick={handleOpen} />
          </Container>
          <CustomModal
            title="Bushings"
            open={open}
            onClose={handleClose}
          >
            <img
              src="https://c8.alamy.com/comp/D95B7C/electrical-station-in-portland-D95B7C.jpg"
              alt="Transformer Diagram"
              style={{ backgroundColor: "#333", width: "50vw" }}
            />
          </CustomModal>

        </FlexContainer>
      ),
    },
    {
      key: "lV Bushing Preview",
      label: "LV Bushing Preview",
/*LV*/ content: (
        <FlexContainer direction="column">

          <Container bgColor="white" padding="10px" borderRadius="20px">
            <ImagePreview btnText="Maximize" />
          </Container>

        </FlexContainer>
      ),
    },
  ];
  return (
    <FlexContainer margin="20px 0px" direction="column">
      <Container margin="10px 0px 0px 0px">
        <TextTypo text="Clearance:" fontSize="16px" fontWeight="600" />
        <Container
          margin="15px 0px"
          border="1px solid #00000033"
          borderRadius="15px"
          padding="10px"
        >
          <FlexContainer align="end">
            <TextTypo text="HV:" margin="0px 0px 20px 0px" />
            <CustomInput
              type="text"
              label="Ph-Er"
              name="hvPhEr"
              value={formState.hv.hv_Ph_Erth}
              onChange={(e) => handleInputChange("hv.hv_Ph_Erth", e.target.value)}
            />
            <CustomInput
              type="text"
              label="Ph-Ph"
              name="hvPhPh"
              value={formState.hv.hv_Ph_Ph}
              onChange={(e) => handleInputChange("hv.hv_Ph_Ph", e.target.value)}
            />
            <TextTypo text="LV:" margin="0px 0px 20px 0px" />
            <CustomInput
              type="text"
              label="Ph-Er"
              name="lvPhEr"
              value={formState.lv.lv_Ph_Erth}
              onChange={(e) => handleInputChange("lv.lv_Ph_Erth", e.target.value)}
            />
            <CustomInput
              type="text"
              label="Ph-Ph"
              name="lvPhPh"
              value={formState.lv.lv_Ph_Ph}
              onChange={(e) => handleInputChange("lv.lv_Ph_Ph", e.target.value)}
            />
          </FlexContainer>
        </Container>
      </Container>

      <TextTypo
        text="Bushing / Support Details:"
        fontSize="16px"
        fontWeight="600"
        textAlign="center"
      />


      <FlexContainer margin="0px 0px" direction="column">
        <FlexContainer direction="row" justify="space-between" gap="35px">

          {/* HV Bushing: */}
          <Container width="50%" direction="column" >
            <TextTypo text="HV :" textAlign="center" fontSize="16px" fontWeight="600" />
            <CustomInput
              label="Bushing Type:"
              type="dropdown"
              options={[{ label: "Air Bushing", value: "airBushing" }]}
              value={formState.hvBushingType}
              onChange={(e) => handleInputChange("hvBushingType", e.target.value)}
            />
            <CustomInput
              label="Mounting Pos.:"
              type="dropdown"
              options={[{ label: "Lid", value: "lid" }, { label: "Tank", value: "tank" }]}
              value={formState.hvb.hvb_Pos}
              onChange={(e) => handleInputChange("hvb.hvb_Pos", e.target.value)}
            />
            <CustomInput
              label="Support Type:"
              type="dropdown"
              options={[{ label: "Turret", value: "turret" }]}
              value={formState.hvSupportType}
              onChange={(e) => handleInputChange("hvSupportType", e.target.value)}
            />
            <FlexContainer direction="row" gap="10px">

              <Container direction="column" gap="10px">
                <CustomInput
                  label="ID:"
                  type="text"
                  value={formState.hvId}
                  onChange={(e) => handleInputChange("hvId", e.target.value)}
                />
                <CustomInput
                  label="Thick:"
                  type="text"
                  value={formState.hvThick}
                  onChange={(e) => handleInputChange("hvThick", e.target.value)}
                />
              </Container>

              <Container direction="column" gap="10px">
                <CustomInput
                  label="Height:"
                  type="text"
                  value={formState.hvHeight}
                  onChange={(e) => handleInputChange("hvHeight", e.target.value)}
                />
                <CustomInput
                  label="Tilt:"
                  type="text"
                  value={formState.hvTilt}
                  onChange={(e) => handleInputChange("hvTilt", e.target.value)}
                  width="100%"
                  unit="deg"
                />
              </Container>

            </FlexContainer>
          </Container>

          {/* LV Bushing: */}
          <Container width="50%" direction="column" >
            <TextTypo text="LV :" textAlign="center" fontSize="16px" fontWeight="600" />

            <CustomInput
              label="Bushing Type:"
              type="dropdown"
              options={[{ label: "Air Bushing", value: "airBushing" }]}
              value={formState.lvBushingType}
              onChange={(e) => handleInputChange("lvBushingType", e.target.value)}
            />
            <CustomInput
              label="Mounting Pos.:"
              type="dropdown"
              options={[{ label: "Lid", value: "lid" }, { label: "Tank", value: "tank" }]}
              value={formState.lvb.lvb_Pos}
              onChange={(e) => handleInputChange("lvb.lvb_Pos", e.target.value)}

            />
            <CustomInput
              label="Support Type:"
              type="dropdown"
              options={[{ label: "Turret", value: "turret" }]}
              value={formState.lvSupportType}
              onChange={(e) => handleInputChange("lvSupportType", e.target.value)}
            />
            <FlexContainer direction="row" gap="10px">

              <Container direction="column" gap="10px">
                <CustomInput
                  label="ID:"
                  type="text"
                  value={formState.lvId}
                  onChange={(e) => handleInputChange("lvId", e.target.value)}
                />
                <CustomInput
                  label="Thick:"
                  type="text"
                  value={formState.lvThick}
                  onChange={(e) => handleInputChange("lvThick", e.target.value)}
                />
              </Container>

              <Container direction="column" gap="10px">
                <CustomInput
                  label="Height:"
                  type="text"
                  value={formState.lvHeight}
                  onChange={(e) => handleInputChange("lvHeight", e.target.value)}
                />
                <CustomInput
                  label="Tilt:"
                  type="text"
                  value={formState.lvTilt}
                  onChange={(e) => handleInputChange("lvTilt", e.target.value)}
                  width="100%"
                  unit="deg"
                />
              </Container>
            </FlexContainer>



          </Container>

        </FlexContainer>
      </FlexContainer>

      {/* <CustomTabs tabs={BushingTabs} /> */}
    </FlexContainer>
  );
};

export default Bushings;
