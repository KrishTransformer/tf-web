export const drawLogoPlaceholder = (doc, x, y, width, height = width) => {
  doc.saveGraphicsState();
  doc.setDrawColor(150, 150, 150);
  doc.setFillColor(248, 248, 248);
  doc.setLineWidth(0.3);
  doc.rect(x, y, width, height, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text("LOGO", x + width / 2, y + height / 2 + 1, {
    align: "center",
  });
  doc.restoreGraphicsState();
};
