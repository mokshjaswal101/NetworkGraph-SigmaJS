import React, { useEffect, useState } from "react";
import styled from "styled-components";

//components
import HcpDetailItem from "./hcpDetailItem";

//api to fetch details of hcp
import { fetchHcpDetails } from "../../api";

//utils
import capitalizeWords from "../../utils/capitalizeWords";

const HcpDetails = ({
  projectId,
  selectedHcp: hcp,
  setIsHcpDetailsShown,
  isPrescriberShown,
}) => {
  const [hcpData, setHcpData] = useState(null);

  useEffect(() => {
    if (!isPrescriberShown) {
      fetchHcpDetails(hcp.key, projectId).then((res) => {
        setHcpData(res);
      });
    }
  }, [hcp]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 2000,
        maxHeight: "75%",
        height: "fit-content",
        width: "300px",
        wordWrap: "break-word",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-offwhite)",
      }}
    >
      {/* Heading of Hcp Details Card */}
      <div
        style={{
          background: "var(--color-primary)",
          color: "white",
          fontSize: "var(--heading)",
          display: "flex",
          alignItems: "center",
          padding: ".75rem",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span style={{ wordBreak: "break-word", width: "90%" }}>
          {hcp.attributes.label +
            (hcp.attributes.credentials
              ? ", " + hcp.attributes.credentials
              : "")}
        </span>
        <button
          style={{ color: "white" }}
          onClick={() => {
            setIsHcpDetailsShown(false);
          }}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      {hcpData && !isPrescriberShown && (
        <div
          style={{
            overflowY: "scroll",
            flex: "1",
            padding: ".75rem",
          }}
        >
          {hcpData.rank && (
            <HcpDetailItem>
              <b>Rank </b>
              {hcp.attributes?.rank}
            </HcpDetailItem>
          )}

          {hcpData?.taxanomy_codes?.[0]?.specialization && (
            <HcpDetailItem>
              <b>Specialization </b>
              {capitalizeWords(hcpData?.taxanomy_codes?.[0]?.specialization)}
            </HcpDetailItem>
          )}

          <HcpDetailItem>
            <b>Email </b>
            {hcpData.emails?.length > 0 && <br />}
            {hcpData.emails?.length > 0
              ? hcpData.emails.map((el, index) => {
                  return (
                    <div
                      style={{ wordWrap: "break-word" }}
                      key={index}
                    >{`• ${el}`}</div>
                  );
                })
              : "NA"}
          </HcpDetailItem>

          {hcpData.current_affiliation && (
            <HcpDetailItem>
              <b>Recent Affiliation </b>
              {capitalizeWords(hcpData.current_affiliation)}
            </HcpDetailItem>
          )}

          {(hcpData?.clinical_trial_counts == 0 ||
            hcpData.clinical_trial_counts) && (
            <HcpDetailItem>
              <b>Clinical Trials </b>
              {hcpData.clinical_trial_counts}
            </HcpDetailItem>
          )}

          {hcpData.prescription_info && (
            <HcpDetailItem>
              <b>Prescriptions </b>
              <br />
              <br />

              {hcpData.prescription_info.filter(
                (el) => el.key.slice(0, 5) == "Govt_"
              ).length > 0 && <b>Government </b>}

              {hcpData.prescription_info
                .filter((el) => el.key.slice(0, 5) == "Govt_")
                .sort((a, b) => {
                  if (a.total_claims <= b.total_claims) return 1;
                  else return -1;
                })
                .slice(0, 5)
                .map((el, index) => {
                  return (
                    <div key={index}>
                      <div key={el.key}>{`• ${capitalizeWords(
                        el.key.slice(5).split("(")[0]
                      )}${
                        el?.total_claims ? ` - ${el.total_claims}` : ""
                      }`}</div>
                    </div>
                  );
                })}

              {hcpData.prescription_info.filter(
                (el) => el.key.slice(0, 5) == "Govt_"
              ).length > 0 && <br />}

              {hcpData.prescription_info.filter(
                (el) => el.key.slice(0, 5) == "Comm_"
              ).length > 0 && <b>Commercial </b>}

              {hcpData.prescription_info
                .filter((el) => el.key.slice(0, 5) == "Comm_")
                .sort((a, b) => {
                  if (a.total_claims <= b.total_claims) return 1;
                  else return -1;
                })
                .slice(0, 5)
                .map((el, index) => {
                  return (
                    <div key={index}>
                      <div key={el.key}>{`• ${capitalizeWords(
                        el.key.slice(5)
                      )}${
                        el?.total_claims ? ` - ${el.total_claims}` : ""
                      }`}</div>
                    </div>
                  );
                })}
            </HcpDetailItem>
          )}
        </div>
      )}

      {isPrescriberShown && (
        <div
          style={{
            overflowY: "scroll",
            flex: "1",
            padding: ".75rem",
          }}
        >
          {hcp?.key && (
            <HcpDetailItem>
              <b>NPI </b>
              {hcp.key}
            </HcpDetailItem>
          )}

          {hcp.attributes.specialization && (
            <HcpDetailItem>
              <b>Specialization </b>
              {hcp.attributes.specialization}
            </HcpDetailItem>
          )}

          {hcp.attributes.state && (
            <HcpDetailItem>
              <b>State </b>
              {hcp.attributes.state}
            </HcpDetailItem>
          )}

          {hcp.attributes.currentPractice && (
            <HcpDetailItem>
              <b>Current Practice </b>
              {hcp.attributes.currentPractice}
            </HcpDetailItem>
          )}

          {hcp.attributes.prescriptions && (
            <>
              <HcpDetailItem>
                <b>Total claims </b>
                {hcp.attributes.prescriptions.claimsCountTotal}
              </HcpDetailItem>
              <HcpDetailItem>
                <b>Total patients </b>
                {hcp.attributes.prescriptions.patientsCountTotal}
              </HcpDetailItem>
              {Object.entries(hcp.attributes.prescriptions.drugs).map(
                ([name, values]) => {
                  return (
                    <HcpDetailItem>
                      <b>{capitalizeWords(name)}</b>
                      {` Claims ${values.claimsCount} Patients ${values.patientsCount}`}
                    </HcpDetailItem>
                  );
                }
              )}
            </>
          )}
        </div>
      )}

      {!hcpData && !isPrescriberShown && (
        <div style={{ padding: ".5rem" }}>Loading ...</div>
      )}
    </div>
  );
};

export default HcpDetails;
