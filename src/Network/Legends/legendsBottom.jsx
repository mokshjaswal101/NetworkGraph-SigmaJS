import React from "react";

//components
import LegendItem from "./legendItem";

//Legends data
import Specializations from "../../data/specializations";

//utils
import capitalizeWords from "../../utils/capitalizeWords";

const LegendsBottom = ({ specializationList }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".75rem",
      }}
    >
      {Object.entries(Specializations)
        .filter((el) => specializationList.includes(el[0]) || el[0] == "other")
        ?.map((el, index) => {
          return (
            <LegendItem key={index}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: `${el[1]}`,
                }}
              ></div>
              <div>{capitalizeWords(el[0])}</div>
            </LegendItem>
          );
        })}
    </div>
  );
};

export default LegendsBottom;
