import React from "react";
import QuarterCircle from "./QuarterCircle";

const BarDiagram = ({ stepsData, highlightedStep, coreDiameter }) => {
  const radius = 300;
  const maxWidth = Math.max(...stepsData?.map((stepNo) => stepNo.width));
  const sumStk = stepsData
    .map((stepNo) => stepNo.stack)
    .reduce((acc, val) => acc + val, 0);
  const oneUnitWidth = radius / (maxWidth / 2);
  const oneUnitHeight = radius / (sumStk / 2);
  const circleRadius = oneUnitWidth * (coreDiameter/2)

  let yAxis = 0;
  let previousBarHeight = 0;
  stepsData = stepsData?.map((element) => {
    yAxis = yAxis + previousBarHeight;
    previousBarHeight = (element.stack / 2) * oneUnitHeight;
    return {
      stepNo: element.stepNo,
      width: (element.width / 2) * oneUnitWidth,
      height: (element.stack / 2) * oneUnitHeight,
      yAxis: yAxis,
    };
  });

  return (
    <div className="core-svg-container">
      <br></br>
      <div className="quarter-circle-container">
      <br></br>
        <div className="d-flex top-row">
          <QuarterCircle
            stepsData={stepsData}
            transform="scale(-1, -1)"
            highlightedStep={highlightedStep}
            radius={radius}
            className="quarter-circle left"
            circleRadius = {circleRadius}
          />
          <QuarterCircle
            stepsData={stepsData}
            transform="scale(1, -1)"
            highlightedStep={highlightedStep}
            radius={radius}
            className="quarter-circle right"
            circleRadius = {circleRadius}
          />
        </div>
        <div className="d-flex bottom-row">
          <QuarterCircle
            stepsData={stepsData}
            transform="scale(-1, 1)"
            highlightedStep={highlightedStep}
            radius={radius}
            className="quarter-circle left"
            circleRadius = {circleRadius}
          />
          <QuarterCircle
            stepsData={stepsData}
            transform="scale(1, 1)"
            highlightedStep={highlightedStep}
            radius={radius}
            className="quarter-circle right"
            circleRadius = {circleRadius}
          />
        </div>
      </div>
    </div>
  );
};
export default BarDiagram;
