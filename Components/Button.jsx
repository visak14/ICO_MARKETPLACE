import React from "react";

const Button = ({name , handleClick , classStyle}) => {
  return <div className={`${classStyle} new-button`}
  onClick={handleClick}
  >{name}</div>;
};


export default Button;
