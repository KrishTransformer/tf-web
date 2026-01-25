import React from "react";
import {
  Container,
  CustomFlexInput,
  CustomInput,
  FlexContainer,
  TextTypo,
  NavTabs,
  LabeledInputWithUnit,
} from "../../components";


const Part2 = ({ formState, handleInputChange }) => {
  //console.log("formState.bot_Chnl.isRoller", formState.bot_Chnl.isRoller);
  return (
    <Container>
      <Container bgColor="white" padding="20px" borderRadius="5px">
        <TextTypo
          text="Lid and Conservator Details:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 10px 0px"
        />
        <FlexContainer>
          <CustomInput
            label="Lid Cover Thickness:"
            type="text"
            value={formState.lid.lid_Thick}
            onChange={(e) => handleInputChange("lidCoverThickness", e.target.value)}
          />
          <CustomInput
            label="Bolt Hole Diameter:"
            type="text"
            value={formState.lid.lid_Bolt_Hole_Dia}
            onChange={(e) => handleInputChange("boltHoleDiameter", e.target.value)}
          />
          <CustomInput
            label="Lid Slope:"
            type="text"
            value={formState.lid.lid_Slope_Ang}
            onChange={(e) => handleInputChange("lidSlope", e.target.value)}
          />
        </FlexContainer>
        <CustomInput
          type="checkbox"
          label="Conservator"
          value={formState.cons.conseravator}
          onChange={(e) => handleInputChange("cons.conseravator", e.target.checked)}
        />
        <FlexContainer>
          <CustomInput
            label="Volume:"
            type="text"
            value={formState.cons.cons_Vol}
            onChange={(e) => handleInputChange("cons.cons_Vol", e.target.value)}
          />
          <CustomInput
            label="Diameter:"
            type="text"
            value={formState.cons.cons_Dia}
            onChange={(e) => handleInputChange("cons.cons_Dia", e.target.value)}
          />
          <CustomInput
            label="Length:"
            type="text"
            value={formState.cons.cons_L}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </FlexContainer>
        <FlexContainer align="center">
          <CustomInput
            label="Sheet Thickness:"
            type="text"
            value={formState.cons.cons_Thick}
            onChange={(e) => handleInputChange("cons.cons_Thick", e.target.value)}
          />
          <CustomInput
            label="Mounting Position:"
            type="dropdown"
            options={[
              { label: "Left", value: "left" },
              { label: "LV Side", value: "lv side" },
            ]}
            value={formState.cons.cons_Pos}
            onChange={(e) => handleInputChange("cons.cons_Pos", e.target.value)}
          />
          <CustomInput
            label="Mounting Type:"
            type="dropdown"
            options={[
              { label: "Lid Mounted", value: "lid mounted" },
            ]}
            value={formState.cons.cons_Mounting}
            onChange={(e) => handleInputChange("cons.cons_Mounting", e.target.value)}
          />
        </FlexContainer>
      </Container>

      {/* Active Part - Core Frame Details: */}
      {/* <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        <TextTypo
          text="Active Part - Core Frame Details:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 10px 0px"
        />
        <FlexContainer direction="column">
          <CustomInput
            label="Type:"
            type="dropdown"
            options={[{ label: "C-Channel", value: "c-Channel" }]}
            value={formState.coreType || "C-Channel"}
            onChange={(e) => handleInputChange("coreType", e.target.value)}
            width="70%"
          />
          <TextTypo text="Size:" fontSize="16px" fontWeight="600" />
          <FlexContainer>
            <CustomFlexInput
              label="Height:"
              type="text"
              value={formState.restOfVariables.active_Height}
              onChange={(e) => handleInputChange("restOfVariables.active_Height", e.target.value)}
            />
            <CustomFlexInput
              label="Width:"
              type="text"
              value={formState.restOfVariables.activePart_L}
              onChange={(e) => handleInputChange("restOfVariables.activePart_L", e.target.value)}
            />
            <CustomFlexInput
              label="Thickness:"
              type="text"
              value={formState.coreThickness}
              onChange={(e) => handleInputChange("coreThickness", e.target.value)}
            />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <CustomFlexInput
            label="Core Bolt Diameter:"
            type="text"
            value={formState.coreBoltDiameter || 0}
            onChange={(e) => handleInputChange("coreBoltDiameter", e.target.value)}
          />
          <CustomFlexInput
            label="Tia Rod Diameter:"
            type="text"
            value={formState.restOfVariables.tieRod_Dia || 0}
            onChange={(e) => handleInputChange("restOfVariables.tieRod_Dia", e.target.value)}
          />
        </FlexContainer>
        <CustomInput
          type="checkbox"
          label="Yoke Hole in Core"
          value={formState.restOfVariables.yoke_Holes || false}
          onChange={(e) => handleInputChange("restOfVariables.yoke_Holes", e.target.checked)}
        />
      </Container> */}

      {/* Tank - Foundation Details: */}
      {/* <Container
        bgColor="white"
        padding="20px"
        borderRadius="5px"
        margin="20px 0px"
      >
        <TextTypo
          text="Tank - Foundation Details:"
          fontSize="18px"
          fontWeight="600"
          margin="0px 0px 10px 0px"
        />
        <FlexContainer direction="column">
          <CustomInput
            label="Foundation Type:"
            type="dropdown"
            options={[{ label: "Type -1", value: "type-1" },
              { label: "Type -2", value: "type-2" },
              { label: "Type -3", value: "type-3" },
              { label: "Type -4", value: "type-4" }
            ]}
            value={formState.roller.foundation_Type}
            onChange={(e) => handleInputChange("roller.foundation_Type", e.target.value)}
          />
          <CustomInput
            label="Bottom Channel Data:"
            type="dropdown"
            options={[{ label: "C-Channel", value: "c-channel" }]}
            value={formState.fabricationCore.core_Fixture_Type }
            onChange={(e) => handleInputChange("fabricationCore.core_Fixture_Type", e.target.value)}
          />
          <CustomInput
            label="Dimensions:"
            type="dropdown"
            options={[{ label: "75 x 45 x 5.3-C", value: "75x45x5.3-C" },
              { label: "125 x 65 x 5.3-C", value: "125x65x5.3-C" },
              { label: "150 x 75 x 5.7-C", value: "150x75x5.7-C" },
              { label: "200 x 75 x 6.2-C", value: "200x75x6.2-C" },
              { label: "250 x 80 x 8.8-C", value: "250x80x8.8-C" }
            ]}
            value={formState.bot_Chnl?.bot_Chnl_Sec_Data }
            onChange={(e) => handleInputChange("bot_Chnl.bot_Chnl_Sec_Data", e.target.value)}
            margin="0px"
          />
        </FlexContainer>
      </Container> */}

      <Container bgColor="white" padding="20px" borderRadius="5px" margin="20px 0px">
        <NavTabs
          tabs={[
            {
              key: "active-part",
              label: "Active Part",
              content: (
                <Container
                  bgColor="white"
                  padding="5px"
                  borderRadius="5px"
                  margin="20px 0px"
                >
                  <TextTypo
                    text="Core Frame Details:"
                    fontSize="18px"
                    fontWeight="600"
                    margin="0px 0px 10px 0px"
                  />
                  <FlexContainer direction="column">
                    <CustomInput
                      label="Type:"
                      type="dropdown"
                      options={[{ label: "C-Channel", value: "c-Channel" }]}
                      value={formState.coreType || "C-Channel"}
                      onChange={(e) => handleInputChange("coreType", e.target.value)}
                      width="70%"
                    />
                    <TextTypo text="Size:" fontSize="16px" fontWeight="600" />
                    <FlexContainer>
                      <CustomFlexInput
                        label="Height:"
                        type="text"
                        value={formState.restOfVariables.active_Height}
                        onChange={(e) => handleInputChange("restOfVariables.active_Height", e.target.value)}
                      />
                      <CustomFlexInput
                        label="Width:"
                        type="text"
                        value={formState.restOfVariables.activePart_L}
                        onChange={(e) => handleInputChange("restOfVariables.activePart_L", e.target.value)}
                      />
                      <CustomFlexInput
                        label="Thickness:"
                        type="text"
                        value={formState.coreThickness}
                        onChange={(e) => handleInputChange("coreThickness", e.target.value)}
                      />
                    </FlexContainer>
                  </FlexContainer>
                  <FlexContainer>
                    <CustomFlexInput
                      label="Core Bolt Diameter:"
                      type="text"
                      value={formState.coreBoltDiameter || 0}
                      onChange={(e) => handleInputChange("coreBoltDiameter", e.target.value)}
                    />
                    <CustomFlexInput
                      label="Tie Rod Diameter:"
                      type="text"
                      value={formState.restOfVariables.tieRod_Dia || 0}
                      onChange={(e) => handleInputChange("restOfVariables.tieRod_Dia", e.target.value)}
                    />
                  </FlexContainer>
                  <CustomInput
                    type="checkbox"
                    label="Yoke Hole in Core"
                    value={formState.restOfVariables.yoke_Holes || false}
                    onChange={(e) => handleInputChange("restOfVariables.yoke_Holes", e.target.checked)}
                  />
                </Container>
              ),
            },
            {
              key: "tank-foundation",
              label: "Tank",
              content: (
                <Container
                  bgColor="white"
                  padding="5px"
                  borderRadius="5px"
                  margin="20px 0px"
                >
                  <TextTypo
                    text="Foundation Details:"
                    fontSize="18px"
                    fontWeight="600"
                    margin="0px 0px 10px 0px"
                  />

                  <FlexContainer direction="column">

                    <FlexContainer direction="row" align="center" justify="space-between">
                      <CustomInput
                        label="Foundation Type:"
                        width="50%"
                        type="dropdown"
                        options={[
                          { label: "Without Roller", value: "false" },
                          { label: "With Roller", value: "true" },
                        ]}
                        value={formState.bot_Chnl.isRoller}
                        onChange={(e) => handleInputChange("bot_Chnl.isRoller", e.target.value)}
                      />

                      {(formState.bot_Chnl.isRoller === "true" || formState.bot_Chnl.isRoller === true) && (
                        <CustomInput
                          label="Roller Type:"
                          type="dropdown"
                          width="50%"
                          options={[
                            { label: "Plain Roller", value: "plain_roller" },
                            { label: "Flange Roller", value: "flanged_roller" },
                          ]}
                          //style={{ marginTop: "50px" }}
                          value={formState.roller.roller_Type || "Flange Roller"}
                          onChange={(e) => handleInputChange("roller.roller_Type", e.target.value)}
                          margin="15px 0"
                        />
                      )}
                    </FlexContainer>

                    <FlexContainer>
                      <TextTypo
                        text={`Roller Diameter: ${formState.bot_Chnl.bot_Chnl_Roller_Dia}`}
                      />
                    </FlexContainer>

                    <FlexContainer direction="row" align="center" justify="space-between">
                    <CustomInput
                      label="Bottom Channel Data:"
                      type="dropdown"
                      options={[{ label: "C-Channel", value: "c-channel" }]}
                      value={formState.fabricationCore.core_Fixture_Type}
                      onChange={(e) => handleInputChange("fabricationCore.core_Fixture_Type", e.target.value)}
                    />
                    <CustomInput
                      label="Dimensions:"
                      type="dropdown"
                      options={[
                        { label: "75 x 45 x 5.3-C", value: "75x45x5.3-C" },
                        { label: "125 x 65 x 5.3-C", value: "125x65x5.3-C" },
                        { label: "150 x 75 x 5.7-C", value: "150x75x5.7-C" },
                        { label: "200 x 75 x 6.2-C", value: "200x75x6.2-C" },
                        { label: "250 x 80 x 8.8-C", value: "250x80x8.8-C" },
                      ]}
                      value={formState.bot_Chnl?.bot_Chnl_Sec_Data}
                      onChange={(e) => handleInputChange("bot_Chnl.bot_Chnl_Sec_Data", e.target.value)}
                      margin="0px"
                    />
                    </FlexContainer>
                  </FlexContainer>
                </Container>
              ),
            },
          ]}
        />
      </Container>
    </Container>
  );
};

export default Part2;
