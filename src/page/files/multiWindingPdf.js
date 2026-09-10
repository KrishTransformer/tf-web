import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { registerDejaVuSansFont } from "../../assets/fonts/DejaVuSans-normal";
import { drawLogoPlaceholder } from "./pdfLogoPlaceholder";

const twipsToMm = (twips) => Number(((twips * 25.4) / 1440).toFixed(2));
const PAGE_MARGIN = 12.7;
const SECTION_GAP = 2;
const SECTION_TITLE_GAP = 3.5;

const SAMPLE_WIDTHS = {
  customer: twipsToMm(4765 + 4590),
  customerCols: [twipsToMm(4765), twipsToMm(4590)],
  core: twipsToMm(2515 + 2520 + 2910 + 2845),
  coreCols: [twipsToMm(2515), twipsToMm(2520), twipsToMm(2910), twipsToMm(2845)],
  winding: twipsToMm(2136 + 2396 + 2206 + 2184 + 1950 + 2184),
  windingLabelCol: twipsToMm(2136),
  diametrical: twipsToMm(1339 + 1421 + 1248 + 1170 + 1014 + 1014 + 1092 + 1092 + 1248 + 1248 + 1248 + 1092),
  diametricalLabelCol: twipsToMm(1339),
  tank: twipsToMm(2697 + 2697 + 2698 + 2698),
  tankCols: [twipsToMm(2697), twipsToMm(2697), twipsToMm(2698), twipsToMm(2698)],
  dualBlock: twipsToMm(5395 + 5395),
  taps: twipsToMm(1975 + 6001 + 6419),
  tapCols: [twipsToMm(1975), twipsToMm(6001), twipsToMm(6419)],
};

const MULTI_WDG_COLUMNS = [
  {
    id: "lv",
    heading: "1. INNER",
    shortLabel: "LV",
    voltageField: "lowVoltage",
    windingTypeField: "lvWindingType",
    materialField: "lVConductorMaterial",
    resultKey: "lvWinding",
    dimensionKeys: {
      id: "lvid",
      radial: "lvradial",
      od: "lvod",
    },
  },
  {
    id: "hvMain",
    heading: "2. HV Winding",
    shortLabel: "HV",
    voltageField: "highVoltage",
    windingTypeField: "hvWindingType",
    materialField: "hVConductorMaterial",
    resultKey: "hvWinding",
    dimensionKeys: {
      id: "hvid",
      radial: "hvradial",
      od: "hvod",
    },
  },
  {
    id: "corse",
    heading: "3. COARSE Winding",
    shortLabel: "Corse",
    voltageField: "corseVoltage",
    windingTypeField: "corseWindingType",
    materialField: "corseConductorMaterial",
    resultKey: "corseWinding",
  },
  {
    id: "fine",
    heading: "4. FINE2 Winding",
    shortLabel: "Fine2",
    voltageField: "fineVoltage",
    windingTypeField: "fineWindingType",
    materialField: "fineConductorMaterial",
    resultKey: "fineWinding",
  },
  {
    id: "outer",
    heading: "5. OUTER Winding",
    shortLabel: "Outer",
    voltageField: "outerVoltage",
    windingTypeField: "outerWindingType",
    materialField: "outerConductorMaterial",
    resultKey: "outerWinding",
  },
];

const CONFIGURATION_TO_VISIBLE_COLUMNS = {
  "2_WDG_LV_HV_MAIN": ["lv", "hvMain"],
  "3_WDG_LV_HV_MAIN_OUTER": ["lv", "hvMain", "outer"],
  "4_WDG_LV_HV_MAIN_CORSE_OUTER": ["lv", "hvMain", "corse", "outer"],
  "4_WDG_LV_HV_MAIN_FINE_OUTER": ["lv", "hvMain", "fine", "outer"],
  "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER": ["lv", "hvMain", "corse", "fine", "outer"],
};

const GAP_LABEL_BY_PAIR = {
  "lv:hvMain": "Lv-HV",
  "hvMain:corse": "Hv-Crs",
  "hvMain:fine": "Hv-Fin",
  "hvMain:outer": "Hv-Out",
  "corse:fine": "Crs-Fin",
  "corse:outer": "Crs-Out",
  "fine:outer": "Fine-Out",
};

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const formatPdfValue = (value, fallback = "-") =>
  hasValue(value) ? String(value) : fallback;

const resolveFirst = (...values) => values.find(hasValue);

const getVisibleColumns = (configuration) => {
  const visibleColumnIds =
    CONFIGURATION_TO_VISIBLE_COLUMNS[configuration] ||
    CONFIGURATION_TO_VISIBLE_COLUMNS["2_WDG_LV_HV_MAIN"];

  return MULTI_WDG_COLUMNS.filter((column) => visibleColumnIds.includes(column.id));
};

const getWinding = (designData, windingId) =>
  designData?.part2Windings?.[windingId] || {};

const getWindingResult = (designData, column) =>
  designData?.calculationResponse?.results?.[column.resultKey] || {};

const getGapValue = (designData, leftWindingId, rightWindingId) => {
  if (leftWindingId === "lv" && rightWindingId === "hvMain") {
    return designData?.coilDimensions?.lvhvgap;
  }

  if (leftWindingId === "hvMain" && rightWindingId === "outer") {
    return resolveFirst(
      designData?.coilDimensions?.hvhvgap,
      designData?.multiCoilDimensions?.gaps?.hvMainToOuterGap
    );
  }

  const key = `${leftWindingId}To${rightWindingId.charAt(0).toUpperCase()}${rightWindingId.slice(1)}Gap`;
  return designData?.multiCoilDimensions?.gaps?.[key];
};

const getDimensionValue = (designData, column, key) => {
  const dimensionKey = column?.dimensionKeys?.[key];

  if (dimensionKey) {
    return designData?.coilDimensions?.[dimensionKey];
  }

  return designData?.multiCoilDimensions?.[column.id]?.[key];
};

const formatPhaseAndVoltage = (winding, voltage) => {
  const parts = [];

  if (hasValue(winding?.phaseCurrent)) {
    parts.push(`${winding.phaseCurrent} A`);
  }

  if (hasValue(voltage)) {
    parts.push(`${voltage} V`);
  }

  return parts.length ? parts.join(" / ") : "-";
};

const formatWindingType = (designData, column) => {
  const windingType = designData?.[column.windingTypeField];
  const material = designData?.[column.materialField];
  const parts = [windingType, material].filter(hasValue);

  return parts.length ? parts.join(" / ") : "-";
};

const formatCoilCount = (designData, column, winding) =>
  formatPdfValue(
    resolveFirst(
      getWindingResult(designData, column)?.noOfCoils,
      getWindingResult(designData, column)?.noOfDiscs,
      getWindingResult(designData, column)?.coilCount,
      winding?.noOfLayers
    )
  );

const formatTurnsPerCoil = (designData, column, winding) =>
  formatPdfValue(
    resolveFirst(
      getWindingResult(designData, column)?.turnsPerCoil,
      getWindingResult(designData, column)?.turnsPerDisc,
      winding?.turnsLayers,
      winding?.turnsPerPhase
    )
  );

const formatConductorAndPaper = (winding) => {
  const conductor = hasValue(winding?.conductorSizes)
    ? String(winding.conductorSizes).replace("Round", "O")
    : "";
  const covering = hasValue(winding?.condInsulation)
    ? `${winding?.isEnamel ? "SE" : "P"}${winding.condInsulation}`
    : "";
  const parts = [conductor, covering].filter(hasValue);

  return parts.length ? parts.join(" ") : "-";
};

const formatCompactParallel = (value) => {
  if (!hasValue(value)) {
    return "-";
  }

  return String(value)
    .replace(/Rad\s*/gi, "R")
    .replace(/Axi\s*/gi, "A")
    .replace(/\s*X\s*/gi, "x")
    .replace(/\s*=\s*/g, "=")
    .replace(/\s+/g, " ")
    .trim();
};

const formatOilDuct = (winding) => {
  if (hasValue(winding?.noOfDuctsWidth)) {
    return String(winding.noOfDuctsWidth).replace(" / ", " x ");
  }

  if (hasValue(winding?.discDuctSize)) {
    return formatPdfValue(winding.discDuctSize);
  }

  return "-";
};

const formatTurnsPerLayer = (winding) =>
  formatPdfValue(resolveFirst(winding?.turnsLayers, winding?.turnsPerLayer));

const formatRawMetric = (designData, column, metricCandidates, fallbackCandidates = []) => {
  const result = getWindingResult(designData, column);
  const metricValue = resolveFirst(
    ...metricCandidates.map((metricKey) => result?.[metricKey]),
    ...fallbackCandidates
  );

  return formatPdfValue(metricValue);
};

const formatTransposition = (designData, column, winding) => {
  if (column.id === "lv") {
    return formatPdfValue(
      resolveFirst(designData?.lvFormulas?.lvTransposition, winding?.discDuctSize)
    );
  }

  if (column.id === "hvMain") {
    return formatPdfValue(
      resolveFirst(
        designData?.hvFormulas?.hvTransposition,
        designData?.hvFormulas?.hvDiscDuctsSize,
        winding?.discDuctSize
      )
    );
  }

  return formatRawMetric(designData, column, ["transposition", "discDuctSize"]);
};

const formatRadialThickness = (designData, column) => {
  if (column.id === "lv") {
    return formatPdfValue(
      resolveFirst(designData?.lvFormulas?.lvRadialThickness, designData?.coilDimensions?.lvradial)
    );
  }

  if (column.id === "hvMain") {
    return formatPdfValue(
      resolveFirst(designData?.hvFormulas?.hvRadialThickness, designData?.coilDimensions?.hvradial)
    );
  }

  return formatPdfValue(
    resolveFirst(
      designData?.multiCoilDimensions?.[column.id]?.radial,
      getWindingResult(designData, column)?.radialThickness
    )
  );
};

const formatTurnLength = (designData, column) => {
  if (column.id === "lv") {
    return formatPdfValue(designData?.lvFormulas?.lvLmt);
  }

  if (column.id === "hvMain") {
    return formatPdfValue(designData?.hvFormulas?.hvLmt);
  }

  return formatRawMetric(designData, column, [
    "turnLength",
    "lmt",
    "meanTurnLength",
  ]);
};

const formatWireLength = (designData, column) => {
  if (column.id === "lv") {
    return formatPdfValue(designData?.lvFormulas?.lvWireLength);
  }

  if (column.id === "hvMain") {
    return formatPdfValue(designData?.hvFormulas?.hvWireLength);
  }

  return formatRawMetric(designData, column, [
    "wireLength",
    "totalWireLength",
    "wireLengthM",
  ]);
};

const formatResistance75 = (designData, column) => {
  if (column.id === "lv") {
    return formatPdfValue(designData?.lvFormulas?.lvR75);
  }

  if (column.id === "hvMain") {
    return formatPdfValue(designData?.hvFormulas?.hvR75);
  }

  return formatRawMetric(designData, column, [
    "r75",
    "resistanceAt75",
    "rAt75",
  ]);
};

const buildTappingSummary = (designData) => {
  const totalTaps =
    Number(designData?.tapStepsPositive || 0) + Number(designData?.tapStepsNegative || 0);
  const tapPercent = Number(designData?.tapStepsPercent || 0);
  const positiveRange = tapPercent * Number(designData?.tapStepsPositive || 0);
  const negativeRange = tapPercent * Number(designData?.tapStepsNegative || 0);
  const tapChanger = designData?.isOLTC ? "OLTC" : "OCTC";

  if (!totalTaps) {
    return "Tap details not available";
  }

  return `${totalTaps} Taps, +${positiveRange}% to -${negativeRange}% @ ${tapPercent}%, HV, ${tapChanger}`;
};

const buildTapDisplay = (values) => {
  if (!Array.isArray(values) || !values.length) {
    return "-";
  }

  return values.map((value) => formatPdfValue(value)).join(" / ");
};

const getGeneralRows = (designData) => [
  ["Core Weight", `${formatPdfValue(designData?.core?.coreWeight)} kg`],
  ["Core + Wdg Weight", formatPdfValue(designData?.tankAndOilFormulas?.weightsOfActivePart)],
  [
    "Conductor Weight",
    [
      designData?.multiCost?.conductors?.lv?.weight,
      designData?.multiCost?.conductors?.hvMain?.weight,
      designData?.multiCost?.conductors?.corse?.weight,
      designData?.multiCost?.conductors?.fine?.weight,
      designData?.multiCost?.conductors?.outer?.weight,
    ]
      .filter(hasValue)
      .join(" + ") || "-",
  ],
  ["Steel Weight", formatPdfValue(designData?.tankAndOilFormulas?.totalSteelWeight)],
  ["Oil", formatPdfValue(designData?.tankAndOilFormulas?.totalOil)],
  ["Insulation", formatPdfValue(designData?.tankAndOilFormulas?.insulationWeight)],
  ["Major Material Cost", formatPdfValue(designData?.cost?.capitalCost)],
  ["Active Part Size", formatPdfValue(designData?.coilDimensions?.activePartSize)],
];

const getPerformanceRows = (designData) => [
  ["No Load Loss", formatPdfValue(designData?.coreLoss)],
  ["Load Loss", formatPdfValue(designData?.loadLoss)],
  ["Tank Stray Loss", formatPdfValue(resolveFirst(designData?.tank?.tankLoss, designData?.tankLoss))],
  ["Resistance", formatPdfValue(designData?.commonFormulas?.er)],
  ["Reactance", formatPdfValue(designData?.commonFormulas?.ex)],
  ["Impedance", formatPdfValue(resolveFirst(designData?.ez, designData?.commonFormulas?.ek))],
  [
    "No Load Current (%)",
    formatPdfValue(
      resolveFirst(
        designData?.nlcurrentPercentage,
        designData?.calculationResponse?.results?.nlCurrentPercentage
      )
    ),
  ],
];

const drawSectionTitle = (doc, title, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(title, PAGE_MARGIN, y);
};

export const generateMultiWindingDesignPDF = ({
  designData = {},
  customer = {},
}) => {
  registerDejaVuSansFont(jsPDF);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const usablePageWidth = pageWidth - PAGE_MARGIN * 2;
  const visibleColumns = getVisibleColumns(designData?.windingConfiguration);

  const commonStyles = {
    fontSize: 6.5,
    cellPadding: 0.5,
    halign: "left",
    valign: "middle",
    lineColor: [0, 0, 0],
    lineWidth: 0.25,
    textColor: 20,
    font: "DejaVuSans",
  };

  let currentY = PAGE_MARGIN;

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    theme: "grid",
    styles: commonStyles,
    tableWidth: SAMPLE_WIDTHS.customer,
    columnStyles: {
      0: { cellWidth: SAMPLE_WIDTHS.customerCols[0] },
      1: { cellWidth: SAMPLE_WIDTHS.customerCols[1] },
    },
    body: [
      [
        `Customer Name: ${formatPdfValue(customer?.customerName)}`,
        `First Line: ${formatPdfValue(designData?.primaryVoltage)}/${formatPdfValue(designData?.secondaryVoltage)} V`,
      ],
      [
        `Place: ${formatPdfValue(customer?.customerPlace)}`,
        `Vector Group: ${formatPdfValue(designData?.vectorGroup)}`,
      ],
      [
        `Design Ref: ${formatPdfValue(designData?.designId)}`,
        `KVA: ${formatPdfValue(designData?.kVA)}`,
      ],
    ],
  });

  drawLogoPlaceholder(doc, pageWidth - PAGE_MARGIN - 18, currentY - 0.5, 18, 18);
  currentY = doc.lastAutoTable.finalY + SECTION_GAP;

  const temperatureDisplay = [
    hasValue(designData?.ambientTemp) ? `Amb ${designData.ambientTemp}` : "",
    hasValue(designData?.windingTemp) ? `Wdg ${designData.windingTemp}` : "",
    hasValue(designData?.topOilTemp) ? `Oil ${designData.topOilTemp}` : "",
  ]
    .filter(Boolean)
    .join(" / ");

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    theme: "grid",
    styles: commonStyles,
    tableWidth: SAMPLE_WIDTHS.core,
    columnStyles: {
      0: { cellWidth: SAMPLE_WIDTHS.coreCols[0] },
      1: { cellWidth: SAMPLE_WIDTHS.coreCols[1] },
      2: { cellWidth: SAMPLE_WIDTHS.coreCols[2] },
      3: { cellWidth: SAMPLE_WIDTHS.coreCols[3] },
    },
    body: [
      [
        `Frame: ${formatPdfValue(designData?.core?.coreDia)}/${formatPdfValue(designData?.core?.limbHt)}/${formatPdfValue(designData?.core?.cenDist)}`,
        `Core Factor: ${formatPdfValue(designData?.buildFactor)}`,
        `Core Type: ${formatPdfValue(designData?.core?.coreType)}`,
        `Grade: ${formatPdfValue(designData?.core?.coreMaterial)} (${formatPdfValue(designData?.hvFormulas?.specificLoss)} W/kg)`,
      ],
      [
        `Area: ${formatPdfValue(resolveFirst(designData?.core?.area, designData?.core?.netArea))}`,
        `Weight: ${formatPdfValue(designData?.core?.coreWeight)} kg`,
        `Flux Density: ${formatPdfValue(resolveFirst(designData?.fluxDensity, designData?.lvFormulas?.revisedFluxDensity))}`,
        `Frequency: ${formatPdfValue(designData?.frequency)} Hz`,
      ],
      [
        `Volts/Turn: ${formatPdfValue(resolveFirst(designData?.voltsPerTurn, designData?.lvFormulas?.revisedVoltsPerTurn))}`,
        `Temperature: ${temperatureDisplay || "-"}`,
        `Cooling: ${formatPdfValue(resolveFirst(designData?.tankAndOilFormulas?.coolingStatement, designData?.eRadiatorType))}`,
        `Vector Group: ${formatPdfValue(designData?.vectorGroup)}`,
      ],
    ],
  });
  currentY = doc.lastAutoTable.finalY + SECTION_GAP;

  const windingRows = [
    [
      "Phase A / V",
      ...visibleColumns.map((column) =>
        formatPhaseAndVoltage(
          getWinding(designData, column.id),
          designData?.[column.voltageField]
        )
      ),
    ],
    [
      "Turns/Limb",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.turnsPerPhase)
      ),
    ],
    [
      "Type of WDG",
      ...visibleColumns.map((column) => formatWindingType(designData, column)),
    ],
    [
      "No.of Coils",
      ...visibleColumns.map((column) =>
        formatCoilCount(designData, column, getWinding(designData, column.id))
      ),
    ],
    [
      "Turns per Coil",
      ...visibleColumns.map((column) =>
        formatTurnsPerCoil(designData, column, getWinding(designData, column.id))
      ),
    ],
    [
      "Turns/Layer",
      ...visibleColumns.map((column) =>
        formatTurnsPerLayer(getWinding(designData, column.id))
      ),
    ],
    [
      "INSLN / Layer",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.interLayerInsulation)
      ),
    ],
    [
      "Oil Duct",
      ...visibleColumns.map((column) => formatOilDuct(getWinding(designData, column.id))),
    ],
    [
      "Oil b/w Coils",
      ...visibleColumns.map((column, index) => {
        const nextColumn = visibleColumns[index + 1];

        if (!nextColumn) {
          return "-";
        }

        return formatPdfValue(getGapValue(designData, column.id, nextColumn.id));
      }),
    ],
    [
      "Cond-Size + Paper Thick.",
      ...visibleColumns.map((column) =>
        formatConductorAndPaper(getWinding(designData, column.id))
      ),
    ],
    [
      "No.in Parallel",
      ...visibleColumns.map((column) =>
        formatCompactParallel(getWinding(designData, column.id)?.noInParallel)
      ),
    ],
    [
      "Cond. Cross-Section",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.condCrossSec)
      ),
    ],
    [
      "Transposition",
      ...visibleColumns.map((column) =>
        formatTransposition(designData, column, getWinding(designData, column.id))
      ),
    ],
    [
      "Radial Thickness",
      ...visibleColumns.map((column) => formatRadialThickness(designData, column)),
    ],
    [
      "Winding Length",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.windingLength)
      ),
    ],
    [
      "Current Density (A/mm2)",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.currentDensity)
      ),
    ],
    [
      "Turn Length (m)",
      ...visibleColumns.map((column) => formatTurnLength(designData, column)),
    ],
    [
      "Wire Length (m)",
      ...visibleColumns.map((column) => formatWireLength(designData, column)),
    ],
    [
      "R @75C Ohms/ph Nom",
      ...visibleColumns.map((column) => formatResistance75(designData, column)),
    ],
    [
      "Weight bare/Cover (kg)",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.weightBareInsulated)
      ),
    ],
    [
      "Stray Loss %",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.eddyStrayLoss)
      ),
    ],
    [
      "Load Loss w",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.loadLoss)
      ),
    ],
    [
      "Temperature Gradient C",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.tempGradDegC)
      ),
    ],
    [
      "End Clearances (mm)",
      ...visibleColumns.map((column) =>
        formatPdfValue(getWinding(designData, column.id)?.endClearances)
      ),
    ],
    [
      "Window Height (mm)",
      ...visibleColumns.map(() => formatPdfValue(designData?.core?.limbHt)),
    ],
    [
      "Ampere Turns",
      ...visibleColumns.map(() => formatPdfValue(designData?.commonFormulas?.ampereTurns)),
    ],
  ];

  const windingColumnStyles = {
    0: { cellWidth: 33, halign: "left" },
  };
  const windingValueCellWidth =
    (usablePageWidth - 33) /
    Math.max(visibleColumns.length, 1);

  visibleColumns.forEach((_, index) => {
    windingColumnStyles[index + 1] = {
      cellWidth: windingValueCellWidth,
      halign: "center",
    };
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: visibleColumns.length >= 5 ? 5.6 : 6,
      cellPadding: 0.38,
    },
    tableWidth: usablePageWidth,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: windingColumnStyles,
    head: [["WINDING DATA", ...visibleColumns.map((column) => column.heading)]],
    body: windingRows,
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + SECTION_TITLE_GAP;
  drawSectionTitle(doc, "Coil Dimensions:", currentY);
  currentY += 2.8;

  const diameterHeaders = [
    "Diametrical",
    "Core Dia",
    ...visibleColumns.flatMap((column) => [`${column.shortLabel}-ID`, `${column.shortLabel}-OD`]),
  ];
  const dynamicDiameterCellWidth =
    (usablePageWidth - SAMPLE_WIDTHS.diametricalLabelCol) /
    Math.max(diameterHeaders.length - 1, 1);
  const diameterColumnStyles = {
    0: { cellWidth: SAMPLE_WIDTHS.diametricalLabelCol, halign: "left" },
  };

  for (let index = 1; index < diameterHeaders.length; index += 1) {
    diameterColumnStyles[index] = {
      cellWidth: dynamicDiameterCellWidth,
      halign: "center",
    };
  }

  const diameterValueRow = [
    "Dia Dim",
    formatPdfValue(designData?.coilDimensions?.coreDia),
    ...visibleColumns.flatMap((column) => [
      formatPdfValue(getDimensionValue(designData, column, "id")),
      formatPdfValue(getDimensionValue(designData, column, "od")),
    ]),
  ];

  const diameterRadialRow = [
    "Radial x 2",
    "-",
    ...visibleColumns.flatMap((column) => [
      "-",
      formatPdfValue(getDimensionValue(designData, column, "radial")),
    ]),
  ];

  const diameterClearanceRow = [
    "Radial Clearances",
    `Core-LV: ${formatPdfValue(designData?.coilDimensions?.coreGap)}`,
  ];

  visibleColumns.forEach((column, index) => {
    if (index === 0) {
      diameterClearanceRow.push(`LvRad: ${formatPdfValue(getDimensionValue(designData, column, "radial"))}`);
      diameterClearanceRow.push(`Lv-HV: ${formatPdfValue(getGapValue(designData, "lv", "hvMain"))}`);
      return;
    }

    if (column.id === "hvMain") {
      diameterClearanceRow.push(`HvRad: ${formatPdfValue(getDimensionValue(designData, column, "radial"))}`);
      return;
    }

    const previousColumn = visibleColumns[index - 1];
    const pairKey = `${previousColumn.id}:${column.id}`;
    diameterClearanceRow.push(
      `${GAP_LABEL_BY_PAIR[pairKey] || `${previousColumn.shortLabel}-${column.shortLabel}`}: ${formatPdfValue(
        getGapValue(designData, previousColumn.id, column.id)
      )}`
    );
    diameterClearanceRow.push(
      `${column.shortLabel}Rad: ${formatPdfValue(getDimensionValue(designData, column, "radial"))}`
    );
  });

  while (diameterClearanceRow.length < diameterHeaders.length) {
    diameterClearanceRow.push(
      `LimbGap: ${formatPdfValue(
        resolveFirst(designData?.coilDimensions?.centerDistance, designData?.core?.cenDist)
      )}`
    );
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: 5.9,
      cellPadding: 0.38,
    },
    tableWidth: usablePageWidth,
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: diameterColumnStyles,
    head: [diameterHeaders],
    body: [
      diameterValueRow,
      diameterRadialRow,
      diameterClearanceRow.slice(0, diameterHeaders.length),
    ],
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + SECTION_TITLE_GAP;
  drawSectionTitle(doc, "TANK DETAILS", currentY);
  currentY += 2.8;

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: 6.3,
      cellPadding: 0.42,
    },
    tableWidth: SAMPLE_WIDTHS.tank,
    columnStyles: {
      0: { cellWidth: SAMPLE_WIDTHS.tankCols[0] },
      1: { cellWidth: SAMPLE_WIDTHS.tankCols[1] },
      2: { cellWidth: SAMPLE_WIDTHS.tankCols[2] },
      3: { cellWidth: SAMPLE_WIDTHS.tankCols[3] },
    },
    body: [
      [
        `Side sheet: ${formatPdfValue(designData?.tank?.tankWallThickness)}`,
        `Bot. Sheet: ${formatPdfValue(designData?.tank?.tankBottomThickness)}`,
        `Lid Sheet: ${formatPdfValue(designData?.tank?.tankLidThickness)}`,
        `Frame: ${formatPdfValue(designData?.tank?.frameThickness)}`,
      ],
      [
        "Tank Size",
        `Length: ${formatPdfValue(designData?.tank?.tankLength)}`,
        `Width: ${formatPdfValue(designData?.tank?.tankWidth)}`,
        `Height: ${formatPdfValue(designData?.tank?.tankHeight)}`,
      ],
      [
        `Radiator: ${formatPdfValue(designData?.eRadiatorType)}`,
        `Length: ${formatPdfValue(designData?.tankAndOilFormulas?.radiatorHeight)}`,
        `Width: ${formatPdfValue(resolveFirst(designData?.radiatorWidth, designData?.tankAndOilFormulas?.radiatorWidth))}`,
        `Sections: ${formatPdfValue(resolveFirst(designData?.tankAndOilFormulas?.coolingStatement, designData?.tank?.tankCapacity))}`,
      ],
      [
        "Conservator:",
        `Dia: ${formatPdfValue(designData?.tankAndOilFormulas?.conservatorDia)}`,
        `Length: ${formatPdfValue(designData?.tankAndOilFormulas?.conservatorLength)}`,
        `Volume: ${formatPdfValue(resolveFirst(designData?.tankAndOilFormulas?.conservatorCapacity, designData?.tank?.tankCapacity))}`,
      ],
    ],
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });

  currentY = doc.lastAutoTable.finalY + SECTION_GAP;

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    tableWidth: SAMPLE_WIDTHS.dualBlock / 2,
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: 6.2,
      cellPadding: 0.4,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    head: [["Generals", "Value"]],
    body: getGeneralRows(designData),
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });
  const generalTableFinalY = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN + SAMPLE_WIDTHS.dualBlock / 2 },
    tableWidth: SAMPLE_WIDTHS.dualBlock / 2,
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: 6.2,
      cellPadding: 0.4,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    head: [["Performance", "Calculated"]],
    body: getPerformanceRows(designData),
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });
  const performanceTableFinalY = doc.lastAutoTable.finalY;

  currentY = Math.max(generalTableFinalY, performanceTableFinalY) + SECTION_TITLE_GAP;
  drawSectionTitle(doc, "Taps Description :", currentY);
  currentY += 2.8;

  autoTable(doc, {
    startY: currentY,
    margin: { left: PAGE_MARGIN },
    tableWidth: usablePageWidth,
    theme: "grid",
    styles: {
      ...commonStyles,
      fontSize: 6.15,
      cellPadding: 0.38,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: 0,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: SAMPLE_WIDTHS.tapCols[0] },
      1: { cellWidth: SAMPLE_WIDTHS.tapCols[1] },
      2: { cellWidth: SAMPLE_WIDTHS.tapCols[2] },
    },
    head: [["Tapping Details", "Calculated", "Remarks"]],
    body: [
      [
        "Summary",
        buildTappingSummary(designData),
        formatPdfValue(resolveFirst(designData?.vectorGroup, designData?.windingConfiguration)),
      ],
      [
        "HV Taps",
        buildTapDisplay(designData?.hvFormulas?.tapVoltages),
        buildTapDisplay(designData?.hvFormulas?.tapCurrent),
      ],
      [
        "Corse Taps",
        formatPdfValue(designData?.corseVoltage),
        formatPdfValue(designData?.part2Windings?.corse?.turnsPerPhase),
      ],
      [
        "Fine Taps",
        formatPdfValue(designData?.fineVoltage),
        formatPdfValue(designData?.part2Windings?.fine?.turnsPerPhase),
      ],
      [
        "Edge Taps",
        formatPdfValue(designData?.outerVoltage),
        formatPdfValue(designData?.part2Windings?.outer?.turnsPerPhase),
      ],
      [
        "Test Voltage",
        `HV: ${formatPdfValue(designData?.hvTestVoltage)} / ${(Number(designData?.highVoltage) * 2 / 1000) || "-"} / ${formatPdfValue(designData?.hvImpulseVoltage)}`,
        `LV: ${formatPdfValue(designData?.lvTestVoltage)} / ${(Number(designData?.lowVoltage) * 2 / 1000) || "-"} / ${formatPdfValue(designData?.lvImpulseVoltage)}`,
      ],
    ],
    didParseCell: ({ section, column, cell }) => {
      if (section === "body" && column.index === 0) {
        cell.styles.fontStyle = "bold";
      }
    },
  });

  const footerY = doc.lastAutoTable.finalY + 6;
  const footerSectionWidth = (pageWidth - PAGE_MARGIN * 2) / 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Date: __________________", PAGE_MARGIN, footerY);
  doc.text("Designed By: __________________", PAGE_MARGIN + footerSectionWidth, footerY);
  doc.text("Verified By: __________________", PAGE_MARGIN + footerSectionWidth * 2, footerY);

  const pdfBlobUrl = doc.output("bloburl");
  window.open(pdfBlobUrl, "_blank");
};
