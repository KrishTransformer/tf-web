import React from 'react';

const BorderStyled = ({ borderColor = '#00000080', margin = '0px', borderStyle = 'solid' ,borderWidth = "100%", borderHeight = "2px"}) => {
  const style = {
    border: 'none',
    borderTop: `${borderHeight} ${borderStyle} ${borderColor}`,
    margin: margin,
    width:borderWidth,
  };

  return <hr style={style} />;
};

export default BorderStyled;
