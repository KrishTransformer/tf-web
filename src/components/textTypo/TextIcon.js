import React from 'react';

const TextIcon = ({ children, fontSize = '16px', fontWeight = 'normal', textAlign = 'left', fontColor = 'black' }) => {
  const style = {
    fontSize,
    fontWeight,
    textAlign,
    color: fontColor,
  };

  return (
    <div>
      <h1 style={style}>{children}</h1>
    </div>
  );
};

export default TextIcon;
