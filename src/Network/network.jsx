import React, { useEffect, useState } from "react";

//components
import Graph from "../components/graph/graph";
import Map from "../components/map/map";
import Filters from "./Filters/filters";
import HcpDetails from "./HcpDetails/hcpDetails";
import Legends from "./Legends/legends";
import TopHcps from "./TopHcps/topHcps";
import Loader from "../components/Loader/loader";

// dummy data for testing
import DummyData from "../data/network_graph.json";
import DummyReferralData from "../data/network_graph_temp.json";
import DummyDataHalozyme from "../data/network_graph_holozyme.json";

//apis to fetch data
import { fetchAllData } from "../api";

//utils
import formatResponse from "../utils/formatResponse";
import filterData from "../utils/filterData";

//configs
import configJson from "../config/config.json";

const Network = () => {
  //flag to show either map or graph
  const [isGraph, setIsGraph] = useState(false);

  //data variables
  const [kolData, setKolData] = useState({ nodes: [], edges: [] });
  const [prescriberData, setPrescriberData] = useState({
    nodes: [],
    edges: [],
  });
  const [totalData, setTotalData] = useState({ nodes: [], edges: [] });
  const [data, setData] = useState({ nodes: [], edges: [] });

  //flag to show either Kols or Prescribers
  const [isPrescriberShown, setIsPrescriberShown] = useState(false);

  //hcp details
  const [selectedHcp, setSelectedHcp] = useState(null);
  const [isHcpDetailsShown, setIsHcpDetailsShown] = useState(false);

  //top KOLs and prescribers
  const [isTopHcpsShown, setIsTopHcpsShown] = useState(true);
  const [kols, setKols] = useState([]);
  const [prescribers, setPrescribers] = useState([]);
  const [topHcps, setTopHcps] = useState([]);

  //which KOLs to display in HCP List
  const [KolsOffset, setKolsOffset] = useState(0);

  //influence variables
  const [influenceTypes, setInfluenceTypes] = useState(["coauthorship"]);

  //advanced Filter variables
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateList, setStateList] = useState([]);
  const [specializationList, setSpecializationList] = useState([]);

  //loader
  const [isLoading, setIsLoading] = useState(true);

  const [projectId, setProjectId] = useState(
    "a0d3c6ec-e30e-4ccb-925d-7327f1c58031"
  );
  const [config, setConfig] = useState();

  //handle initial loading of data
  useEffect(() => {
    let conf = configJson[projectId];
    setConfig(conf);

    fetchAllData(projectId).then((res) => {
      //format the response based on requirements for map and graph
      let formattedResponse = formatResponse(
        res.kol_graph,
        res.referral,
        res.top_nodes,
        conf.specializationsOfInterest,
        conf.countriesOfInterest
      );

      //handle intital filtering of data on component mount
      filterData(
        formattedResponse.kolData,
        setData,
        influenceTypes,
        formattedResponse.kols[0],
        selectedSpecialization,
        selectedState,
        setStateList,
        setSpecializationList,
        setSelectedState,
        setSelectedSpecialization,
        conf?.unlockedNodes
      );

      setSelectedHcp(formattedResponse.kols[0]);
      setTotalData(formattedResponse.kolData);
      setKolData(formattedResponse.kolData);
      setPrescriberData(formattedResponse.prescriberData);
      setPrescribers(formattedResponse.prescribers);
      setTopHcps(formattedResponse.kols);
      setKols(formattedResponse.kols);

      setIsLoading(false);
    });
  }, []);

  //filter data based on filter changes
  useEffect(() => {
    filterData(
      totalData,
      setData,
      influenceTypes,
      selectedHcp,
      selectedSpecialization,
      selectedState,
      setStateList,
      setSpecializationList,
      setSelectedState,
      setSelectedSpecialization,
      config?.unlockedNodes
    );
  }, [influenceTypes, selectedHcp?.key, KolsOffset, topHcps]);

  //display hcp details when selected hcp changes
  useEffect(() => {
    if (selectedHcp?.key) setIsHcpDetailsShown(true);
  }, [selectedHcp?.key]);

  useEffect(() => {
    if (isPrescriberShown) {
      setInfluenceTypes(["referral"]);
      setTotalData(prescriberData);
      setTopHcps(prescribers);
      setSelectedHcp(prescribers?.[0]);
    } else {
      setInfluenceTypes(["coauthorship"]);
      setTotalData(kolData);
      setTopHcps(kols);
      setSelectedHcp(kols?.[0]);
    }
  }, [isPrescriberShown]);

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Filters
        setIsGraph={setIsGraph}
        isGraph={isGraph}
        setSelectedHcp={setSelectedHcp}
        isTopHcpsShown={isTopHcpsShown}
        setIsTopHcpsShown={setIsTopHcpsShown}
        totalData={totalData}
        setData={setData}
        specializationList={specializationList}
        selectedHcp={selectedHcp}
        stateList={stateList}
        influenceTypes={influenceTypes}
        setInfluenceTypes={setInfluenceTypes}
        selectedSpecialization={selectedSpecialization}
        setSelectedSpecialization={setSelectedSpecialization}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        setStateList={setStateList}
        setSpecializationList={setSpecializationList}
        data={data}
        setIsPrescriberShown={setIsPrescriberShown}
        isPrescriberShown={isPrescriberShown}
        setKolsOffset={setKolsOffset}
        kolData={kolData}
        prescriberData={prescriberData}
        config={config}
        topHcps={topHcps}
      />
      <div style={{ width: "100%", height: "550px", position: "relative" }}>
        {isLoading && <Loader />}

        {isHcpDetailsShown && selectedHcp?.key && (
          <HcpDetails
            projectId={projectId}
            selectedHcp={selectedHcp}
            setSelectedHcp={setSelectedHcp}
            setIsHcpDetailsShown={setIsHcpDetailsShown}
            isPrescriberShown={isPrescriberShown}
          />
        )}

        {isTopHcpsShown && (
          <TopHcps
            topHcps={topHcps}
            setSelectedHcp={setSelectedHcp}
            setIsTopHcpsShown={setIsTopHcpsShown}
            selectedHcp={selectedHcp}
            KolsOffset={KolsOffset}
            setKolsOffset={setKolsOffset}
            isPrescriberShown={isPrescriberShown}
          />
        )}

        {isGraph ? (
          <Graph
            selectedHcp={selectedHcp}
            data={data}
            setSelectedHcp={setSelectedHcp}
            setIsHcpDetailsShown={setIsHcpDetailsShown}
            unlockedNodes={config.unlockedNodes}
          />
        ) : (
          <Map
            selectedHcp={selectedHcp}
            data={data}
            setSelectedHcp={setSelectedHcp}
            setIsHcpDetailsShown={setIsHcpDetailsShown}
            setIsLoading={setIsLoading}
            totalData={totalData}
            influenceTypes={influenceTypes}
            setData={setData}
            unlockedNodes={config?.unlockedNodes}
          />
        )}
      </div>

      <Legends
        isPrescriberShown={isPrescriberShown}
        specializationList={specializationList}
        specializationsOfInterest={config?.specializationsOfInterest}
      />
    </div>
  );
};

export default Network;
