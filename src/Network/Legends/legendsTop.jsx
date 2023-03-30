import React from "react";

//components
import LegendItem from "./legendItem";

//icons
import starred from "../../assets/starred.png";
import prescriber from "../../assets/prescriber.png";
import diamondblue from "../../assets/diamondblue.png";

const LegendsTop = ({ isPrescriberShown }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".75rem",
        marginTop: ".5rem",
      }}
    >
      {/* Icon Legends */}
      <LegendItem>
        <img src={diamondblue} style={{ height: "16px" }} />
        Filtered Hcps
      </LegendItem>
      {!isPrescriberShown ? (
        <LegendItem>
          <img src={starred} style={{ height: "16px" }} />
          Top KOLs
        </LegendItem>
      ) : (
        <LegendItem>
          <img src={prescriber} style={{ height: "16px" }} />
          Prescribers
        </LegendItem>
      )}

      {/* Type of influence */}
      {!isPrescriberShown ? (
        <>
          <LegendItem>
            <div
              style={{
                width: "16px",
                height: "5px",
                background: "orange",
              }}
            ></div>
            <div>Affiliations</div>
          </LegendItem>
          <LegendItem>
            <div
              style={{
                width: "16px",
                height: "5px",
                background: "#00008B",
              }}
            ></div>
            <div>Co-Authorship</div>
          </LegendItem>
          <LegendItem>
            <div
              style={{
                width: "16px",
                height: "5px",
                background: "purple",
              }}
            ></div>
            <div>Citations</div>
          </LegendItem>
        </>
      ) : (
        <LegendItem>
          <div
            style={{
              width: "16px",
              height: "5px",
              background: "#008080",
            }}
          ></div>
          <div>Referral</div>
        </LegendItem>
      )}

      {/* Level of Influeunces */}
      <LegendItem>
        <div
          style={{
            width: "16px",
            height: "5px",
            background: "black",
          }}
        ></div>
        <div>First Level Influence</div>
      </LegendItem>
      <LegendItem>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justContent: "center",
            gap: ".2rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "5px",
              background: "black",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "5px",
              background: "black",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "5px",
              background: "black",
            }}
          ></div>
        </div>
        <div>Second Level Influence</div>
      </LegendItem>
    </div>
  );
};

export default LegendsTop;
