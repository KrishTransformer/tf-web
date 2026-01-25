import React from "react";

const QuarterCircle = ({
  stepsData,
  transform,
  highlightedStep,
  radius,
  className,
  circleRadius,
}) => {
  return (
    <svg
      width={circleRadius}
      height={circleRadius}
      style={{ backgroundColor: "white", transform: transform }}
      className={className}
    >
      <circle
        r={circleRadius}
        cx={0}
        cy={stepsData[0]?.yAxis}
        fill="none"
        className="full-circle-container"
      />
      {stepsData.map((step, index) => {
        const x = 0;
        const isHighlighted = highlightedStep === step.stepNo;
        return (
          <rect
            key={step.stepNo}
            x={x}
            y={step.yAxis}
            width={step.width}
            height={step.height}
            fill={isHighlighted ? "#C3C3C3" : "#fff"}
            stroke="#213"
          >
            <title>{`Step: ${step.stepNo}, Width: ${step.width}, Stk: ${step.height}`}</title>
          </rect>
        );
      })}
    </svg>
  );
};

export default QuarterCircle;
