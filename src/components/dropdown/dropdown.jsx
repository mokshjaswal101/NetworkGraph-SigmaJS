import React from "react";
import "./dropdown.scss";

const Dropdown = ({ label, children }) => {
  return (
    <div
      className="dropdown"
      style={{
        zIndex: "2000",
        width: "160px",
        border: "1px solid var(--color-bg)",
        position: "relative",
        padding: "0 5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        userSelect: "none",
        height: "30px",
        fontSize: "14px",
      }}
    >
      <label>{label}</label>

      <ul
        className="dropdown-list"
        style={{ maxHeight: "300px", overflowY: "scroll" }}
      >
        {children}
      </ul>
    </div>
  );
};

export default Dropdown;
