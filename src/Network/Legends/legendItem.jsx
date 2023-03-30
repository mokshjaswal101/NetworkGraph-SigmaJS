import React from "react";

const LegendItem = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".3rem",
        wrap: "wrap",
      }}
    >
      {children}
    </div>
  );
};

export default LegendItem;
