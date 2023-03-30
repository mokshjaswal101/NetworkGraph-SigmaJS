import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        background: "rgba(0,0,0,0.2)",
        zIndex: 5000,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "16px solid #f3f3f3",
          borderRadius: "50%",
          borderTop: "16px solid #3498db",
          width: "50px",
          height: "50px",
          animation: "spin 2s linear infinite",
          zIndex: 1000,
        }}
      ></div>
    </div>
  );
};

export default Loader;
