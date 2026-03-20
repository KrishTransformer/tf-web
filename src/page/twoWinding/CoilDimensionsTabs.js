import React, { useState } from "react";
import {
  Container,
  CustomModal,
  CustomInput,
  FlexContainer,
  NavTabs,
  TextTypo,
} from "../../components";

const CoilDimensionsTabs = ({ formState, handleInputChange }) => {
  const [isRadiatorWidthModalOpen, setIsRadiatorWidthModalOpen] = useState(false);
  const [customRadiatorWidth, setCustomRadiatorWidth] = useState(
    String(formState?.tankAndOilFormulas?.radiatorWidth || "226")
  );
  const formulaRadiatorWidthValue =
    formState?.tankAndOilFormulas?.radiatorWidth?.toString?.() || "";
  const selectedRadiatorWidthValue =
    formState?.radiatorWidth?.toString?.() || formulaRadiatorWidthValue || "226";
  const openRadiatorWidthModal = () => {
    setCustomRadiatorWidth(selectedRadiatorWidthValue);
    setIsRadiatorWidthModalOpen(true);
  };

  const handleRadiatorWidthSubmit = () => {
    const parsedWidth = parseInt(customRadiatorWidth, 10);

    if (Number.isNaN(parsedWidth)) {
      return;
    }

    handleInputChange("radiatorWidth", parsedWidth);
    setIsRadiatorWidthModalOpen(false);
  };

  const tabs = [
    // {
    //   key: "general-info",
    //   label: "General Info",
    //   content: (
    //     <div>
    //       <table class="tableTabsGeneral">
    //         <tr>
    //           <td>Overall Dimensions:</td>
    //           <td>{formState.coilDimensionsGeneralInfoCostings} 0.83 x 0.83 B x 1.38 H M</td>
    //         </tr>
    //         <tr>
    //           <td>Tank (L x B x H) :</td>
    //           <td>{formState.coilWindingDimensionsInM} 640 x 275 x 910 mm</td>
    //         </tr>
    //         <tr>
    //           <td>Cost Estimations :</td>
    //           <td></td>
    //         </tr>
    //       </table>
    //       <table class="tableTabs">
    //         <tr>
    //           <td>Conductor:</td>
    //           <td>125</td>
    //           <td>125</td>
    //         </tr>
    //         <tr>
    //           <td>Core:</td>
    //           <td>3</td>
    //           <td>125</td>
    //         </tr>
    //         <tr>
    //           <td>Steel:</td>
    //           <td>128</td>
    //           <td>125</td>
    //         </tr>
    //         <tr>
    //           <td>Net oil:</td>
    //           <td>20</td>
    //           <td>125</td>
    //         </tr>
    //         <tr>
    //           <td>Insulation:</td>
    //           <td>148</td>
    //           <td>125</td>
    //         </tr>
    //       </table>
    //     </div>
    //   ),
    // },
    {
      key: "tank-Cooling",
      label: "Tank & Cooling",
      content: (
        <div>
          <table class="tableTabsGeneral">
            <tr>
              <td>Overall Dimensions:</td>
              <td>{formState.tank?.overallDimension}</td>
            </tr>
            <tr>
              <td>Tank (L x B x H):</td>
              <td>{formState.tank?.tankDimension} </td>
            </tr>
          </table>
          <FlexContainer>
            <CustomInput
              label="Winding Temp"
              type="text"
              value={formState?.windingTemp}
              onChange={(e) => handleInputChange("windingTemp", e.target.value)}
              bgColor="#D7F3FC"
              borderColor="0.5px solid #00000033"
            />

            <CustomInput
              label="Oil Temp"
              type="text"
              value={formState?.topOilTemp}
              onChange={(e) => handleInputChange("topOilTemp", e.target.value)}
              bgColor="#D7F3FC"
              borderColor="0.5px solid #00000033"
            />

            <CustomInput
              label="Amb. Temp"
              type="text"
              value={formState?.ambientTemp}
              onChange={(e) => handleInputChange("ambientTemp", e.target.value)}
              bgColor="#D7F3FC"
              borderColor="0.5px solid #00000033"
            />
          </FlexContainer>
          <FlexContainer>
            <CustomInput
              type="dropdown"
              label="Cooling method"
              options={[
                { label: "Radiator", value: "RADIATOR" },
                { label: "Pipes", value: "PIPES" },
                { label: "Corrugation", value: "CORRUGATION" },
              ]}
              value={formState?.eRadiatorType || "Radiator"}
              onChange={(e) =>
                handleInputChange("eRadiatorType", e.target.value)
              }
            />
            {formState?.eRadiatorType === "RADIATOR" && (
              <CustomInput
                label="Radiator Width"
                type="text"
                value={selectedRadiatorWidthValue}
                readOnly
                onClick={openRadiatorWidthModal}
                style={{ cursor: "pointer" }}
              />
            )}
            <CustomInput
              type="checkbox"
              value={formState?.isCSP}
              label="CSP"
              onChange={(e) => handleInputChange("isCSP", e.target.value)}
            />
            {/* <CustomInput
              type="dropdown"
              options={[
                { label: "Rectangular Core", value: "RECTANGULAR" },
                { label: "Circular Core", value: "CIRCULAR" },
              ]}
              value={formState.eTransType || "Rectangular Core"}
              onChange={(e) => handleInputChange("eTransType", e.target.value)}
            /> */}
          </FlexContainer>
          <Container
            border="0.5px solid #00000080"
            padding="10px"
            margin="10px 0px 15px 0px"
          >
            <TextTypo
              text={formState?.tankAndOilFormulas?.coolingStatement}
              fontColor="black"
            />
          </Container>
          {/* <table class="tableTabsGeneral">
            <tr>
              <td>Conservator Dia:</td>
              <td>{formState.tankAndOilFormulas?.conservatorDia} </td>
     
              <td>Conservator Length:</td>
              <td>{formState.tankAndOilFormulas?.conservatorLength} </td>
            </tr>
            </table> */}
          {formState?.isCSP == false ? (
            <FlexContainer align="center" margin="20px 0px">
              <TextTypo
                text={`Conservator Dia :  ${formState.tankAndOilFormulas?.conservatorDia}`}
                fontWeight="600"
              />
              <TextTypo
                text={`Conservator Length :  ${formState.tankAndOilFormulas?.conservatorLength}`}
                fontWeight="600"
              />
            </FlexContainer>
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      key: "coil-dimensions",
      label: "Coil Dimensions",
      content: (
        <div>
          <TextTypo
            text="Coil Winding: Dimensions in mm"
            textAlign="center"
            fontSize="16px"
            fontWeight="600"
          />
          <FlexContainer margin="20px 0px 0px 0px">
            <table class="tableTabs">
              <tr>
                <td>Core Dia:</td>
                <td>{formState.coilDimensions?.coreDia}</td>
              </tr>
              <tr>
                <td>CoreGap x 2:</td>
                <td>{formState.coilDimensions?.coreGap}</td>
              </tr>
              <tr>
                <td>LV - ID:</td>
                <td>{formState.coilDimensions?.lvid}</td>
              </tr>
              <tr>
                <td>LV- Radial x 2:</td>
                <td>{formState.coilDimensions?.lvradial}</td>
              </tr>
              <tr>
                <td>LV - OD:</td>
                <td>{formState.coilDimensions?.lvod}</td>
              </tr>
            </table>
            <table class="tableTabs">
              <tr>
                <td>LV-HV Gap x 2:</td>
                <td>{formState.coilDimensions?.lvhvgap}</td>
              </tr>
              <tr>
                <td>HV -ID:</td>
                <td>{formState.coilDimensions?.hvid}</td>
              </tr>
              <tr>
                <td>HV -Radial x 2:</td>
                <td>{formState.coilDimensions?.hvradial}</td>
              </tr>
              <tr>
                <td>HV - OD:</td>
                <td>{formState.coilDimensions?.hvod}</td>
              </tr>
              <tr>
                <td>HV - HV Gap:</td>
                <td>{formState.coilDimensions?.hvhvgap}</td>
              </tr>
            </table>
          </FlexContainer>
          <FlexContainer>
            <table class="tableTabsGeneral">
              <tr>
                <td>Active Part Size:</td>
                <td>{formState.coilDimensions?.activePartSize}</td>
              </tr>
            </table>
          </FlexContainer>
        </div>
      ),
    },
    {
      key: "costings",
      label: "Costings",
      content: (
        <div>
          {/* <CustomInput type="checkbox" label="Cost Iteration" margin="10px" /> */}
          <table class="tableTabsGeneral" style={{ width: "65%" }}>
            <tr>
              <td> Major material cost:</td>
              <td>{formState?.cost?.capitalCost}</td>
            </tr>
            {/* <tr>
              <td>Rad. Width:</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Winding Temp:</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Oil Temp:</td>
              <td>-</td>
            </tr> */}
            <tr>
              <td>Cost Estimations:</td>
              <td></td>
            </tr>
          </table>
          <table class="tableTabs">
            <tr>
              <td></td>
              <td>Weight</td>
              <td>Cost per KG</td>
              <td>Total Cost</td>
            </tr>

            {formState?.lVConductorMaterial ==
            formState?.hVConductorMaterial ? (
              <tr>
                <td>{`Conductor (${formState?.lVConductorMaterial}`}):</td>
                <td>
                  <CustomInput
                    type="text"
                    value={formState?.tankAndOilFormulas?.totalConductorWeight}
                    onChange={(e) => handleInputChange("ez", e.target.value)}
                  />
                </td>
                <td>
                  {formState?.lVConductorMaterial == "Cu" ? (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.copperCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.copperCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  ) : (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.aluminiumCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.aluminiumCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  )}
                </td>
                <td>
                  <CustomInput
                    type="text"
                    value={formState?.cost?.totalCondCost}
                    onChange={(e) => handleInputChange("ez", e.target.value)}
                  />
                </td>
              </tr>
            ) : (
              <>
                <tr>
                  <td>{`Conductor (${formState?.lVConductorMaterial}`}):</td>
                  <td>
                    <CustomInput
                      type="text"
                      value={
                        formState?.tankAndOilFormulas?.totalConductorWeight
                      }
                      onChange={(e) => handleInputChange("ez", e.target.value)}
                    />
                  </td>
                  <td>
                  {formState?.lVConductorMaterial == "Cu" ? (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.copperCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.copperCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  ) : (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.aluminiumCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.aluminiumCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  )}
                  </td>
                  <td>
                    <CustomInput
                      type="text"
                      value={formState?.cost?.totalCondCost}
                      onChange={(e) => handleInputChange("ez", e.target.value)}
                    />
                  </td>
                </tr>{" "}
                <tr>
                  <td>{`Conductor (${formState?.hVConductorMaterial}`}):</td>
                  <td>
                    <CustomInput
                      type="text"
                      value={
                        formState?.tankAndOilFormulas?.totalConductorWeight
                      }
                      onChange={(e) => handleInputChange("ez", e.target.value)}
                    />
                  </td>
                  <td>
                  {formState?.hVConductorMaterial == "Cu" ? (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.copperCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.copperCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  ) : (
                    <CustomInput
                      type="text"
                      value={formState?.cost?.aluminiumCostPerKg}
                      onChange={(e) =>
                        handleInputChange(
                          "cost.aluminiumCostPerKg",
                          e.target.value
                        )
                      }
                      bgColor="#D7F3FC"
                      borderColor="0.5px solid #00000033"
                    />
                  )}
                  </td>
                  <td>
                    <CustomInput
                      type="text"
                      value={formState?.cost?.totalCondCost}
                      onChange={(e) => handleInputChange("ez", e.target.value)}
                    />
                  </td>
                </tr>
              </>
            )}

            <tr>
              <td>Core:</td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.core?.coreWeight}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.coreCostPerKg}
                  onChange={(e) =>
                    handleInputChange("cost.coreCostPerKg", e.target.value)
                  }
                  bgColor="#D7F3FC"
                  borderColor="0.5px solid #00000033"
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.totalCoreCost}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Steel:</td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.tankAndOilFormulas?.totalSteelWeight}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.steelCostPerKg}
                  onChange={(e) =>
                    handleInputChange("cost.steelCostPerKg", e.target.value)
                  }
                  bgColor="#D7F3FC"
                  borderColor="0.5px solid #00000033"
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.totalSteelCost}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Net oil:</td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.tankAndOilFormulas?.totalOil}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.oilCostPerKg}
                  onChange={(e) =>
                    handleInputChange("cost.oilCostPerKg", e.target.value)
                  }
                  bgColor="#D7F3FC"
                  borderColor="0.5px solid #00000033"
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.totalOilCost}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Insulation:</td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.tankAndOilFormulas?.insulationWeight}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.insulationCostPerKg}
                  onChange={(e) =>
                    handleInputChange(
                      "cost.insulationCostPerKg",
                      e.target.value
                    )
                  }
                  bgColor="#D7F3FC"
                  borderColor="0.5px solid #00000033"
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.totalInsCost}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Radiator:</td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.tankAndOilFormulas?.totalRadiatorWeight}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.radiatorCostPerKg}
                  onChange={(e) =>
                    handleInputChange("cost.radiatorCostPerKg", e.target.value)
                  }
                  bgColor="#D7F3FC"
                  borderColor="0.5px solid #00000033"
                />
              </td>
              <td>
                <CustomInput
                  type="text"
                  value={formState?.cost?.totalRadiatorCost}
                  onChange={(e) => handleInputChange("ez", e.target.value)}
                />
              </td>
            </tr>
          </table>
          {/* <FlexContainer justify="end">
            <TextBtn
              text="View More"
              fontColor="#1400FA"
              textDecoration="none"
            />
          </FlexContainer> */}
        </div>
      ),
    },
  ];
  return (
    <div>
      <NavTabs tabs={tabs} />
      <CustomModal
        open={isRadiatorWidthModalOpen}
        onClose={() => setIsRadiatorWidthModalOpen(false)}
        onModalSubmit={handleRadiatorWidthSubmit}
        title="Radiator Width"
      >
        <TextTypo
          text="Enter radiator width. Common values are 226, 300, and 520."
          margin="20px 0px"
          fontColor="grey"
        />
        <CustomInput
          label="Radiator Width"
          value={customRadiatorWidth}
          onChange={(e) =>
            setCustomRadiatorWidth(e.target.value.replace(/\D/g, ""))
          }
          bgColor="#D7F3FC"
          borderColor="0.5px solid #00000033"
        />
      </CustomModal>
    </div>
  );
};

export default CoilDimensionsTabs;
