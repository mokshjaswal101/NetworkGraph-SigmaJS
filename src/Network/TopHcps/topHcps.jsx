import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";

const TopHcps = ({
  topHcps,
  selectedHcp,
  setSelectedHcp,
  setIsTopHcpsShown,
  KolsOffset,
  setKolsOffset,
  isPrescriberShown,
}) => {
  // function to select hcp from the HCP List
  const handleHcpClick = (hcp) => {
    if (selectedHcp?.key != hcp?.key) setSelectedHcp(hcp);
  };

  // by default, set the page and starting HCP to starting
  useEffect(() => {
    setKolsOffset(0);
  }, []);

  return (
    topHcps?.length > 0 && (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 2000,
          height: "fit-content",
          maxHeight: "75%",
          width: "220px",
          wordWrap: "break-word",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-offwhite)",
        }}
      >
        {/* Heading of the HCP List */}
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
            {isPrescriberShown ? "Prescribers" : "Top KOLs"}
          </span>

          <button
            style={{ color: "white" }}
            onClick={() => {
              setIsTopHcpsShown(false);
            }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* HCP List */}
        <div style={{ flex: 1, padding: ".5rem" }}>
          {topHcps.slice(KolsOffset, KolsOffset + 10).map((hcp, index) => {
            return (
              <div
                key={index}
                onClick={() => handleHcpClick(hcp)}
                className="topKolItem"
                style={{
                  padding: ".rem 0",
                  cursor: "pointer",
                  padding: ".4rem",
                  color: hcp?.key == selectedHcp?.key ? "white" : "",
                  background:
                    hcp?.key == selectedHcp?.key ? "var(--color-primary)" : "",
                }}
              >
                {`${!isPrescriberShown ? hcp.attributes.rank + "." : ""} ${
                  hcp.attributes.label
                }${
                  hcp.attributes.credentials
                    ? ", " + hcp.attributes.credentials
                    : ""
                }`}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Math.ceil(topHcps.length / 10) > 1 && (
            <ReactPaginate
              onPageChange={(e) => setKolsOffset(e.selected * 10)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={Math.ceil(topHcps.length / 10)}
              previousLabel={<i className="fa fa-caret-left"></i>}
              nextLabel={<i className="fa fa-caret-right"></i>}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item "
              previousLinkClassName="page-link"
              nextClassName="page-item "
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
              initialPage={KolsOffset / 10}
              forcePage={KolsOffset / 10}
            />
          )}
        </div>
      </div>
    )
  );
};

export default TopHcps;
