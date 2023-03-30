import React from "react";

//components
import LegendsTop from "./legendsTop";
import LegendsBottom from "./legendsBottom";

const Legends = ({ isPrescriberShown, specializationList }) => {
  return (
    <>
      <LegendsTop isPrescriberShown={isPrescriberShown} />
      <hr
        style={{
          height: "1px",
          backgroundColor: "var(--color-bg)",
          border: "none",
        }}
      />
      <LegendsBottom specializationList={specializationList} />
    </>
  );
};

export default Legends;
