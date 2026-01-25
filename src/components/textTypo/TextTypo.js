import React from 'react';

const TextTypo = ({ text, fontSize = '16px', fontWeight = 'normal', textAlign = 'left', fontColor = 'black',margin = "0px" }) => {
  const style = {
    fontSize: fontSize,
    fontWeight: fontWeight,
    textAlign: textAlign,
    color: fontColor,
    margin: margin,
    // fontFamily: 'Jost',
  };

  return (
    <div>
      <h1 style={style}>{text}</h1>
    </div>
  );
};

export default TextTypo;
