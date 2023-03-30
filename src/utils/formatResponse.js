//utils
import calcLatLng from "./calcLatLng";
import capitalizeWords from "./capitalizeWords";

//icons
import starred from "../assets/starred.png";
import prescriber from "../assets/prescriber.png";

//config
import specializations from "../data/specializations";

const formatResponse = (kolData, prescriberData, kols) => {
  let prescribers = [];

  //format nodes of KOL data
  kolData.nodes = kolData?.nodes?.map((node) => {
    let zip = calcLatLng(node.attributes.location, node);

    return {
      key: node.key,
      attributes: {
        label: capitalizeWords(node.attributes.label),
        color:
          specializations[node.attributes.specialization] ||
          specializations["other"],
        state: zip?.state || node.attributes.state,
        icon: null,
        lat: parseFloat(zip?.latitude),
        lng: parseFloat(zip?.longitude),
        x: Math.random(),
        y: Math.random(),
        specialization: node.attributes.specialization,
        rank: node.attributes.rank,
        size: "4",
        credentials: node?.attributes?.credentials
          ?.map((node) => node.toUpperCase())
          .join(" "),
        location: node.attributes.location,
      },
    };
  });

  // format edges of KOL data
  kolData.edges = kolData?.edges?.map((edge, index) => {
    return {
      key: index,
      type:
        edge.attributes.label == "co_author"
          ? "coauthorship"
          : edge.attributes.label == "citation"
          ? "citation"
          : "coaffiliation",
      source: edge.source,
      target: edge.target,
      attributes: {
        color:
          edge.attributes.label == "co_author"
            ? "#00008B"
            : edge.attributes.label == "citation"
            ? "purple"
            : "orange",
        size: edge.attributes.weight > 4 ? 4 : edge.attributes.weight,
        label: edge.attributes.weight,
        type: edge.attributes.label == "citation" ? "arrow" : "",
      },
    };
  });

  // format top KOLs
  kols = kols?.map((node) => {
    let zip = calcLatLng(node.attributes.location, node);
    return {
      key: node.key,
      attributes: {
        label: capitalizeWords(node.attributes.label),
        color:
          specializations[node.attributes.specialization] ||
          specializations["other"],
        state: zip?.state || node.attributes.state,
        icon: starred,
        lat: parseFloat(zip?.latitude),
        lng: parseFloat(zip?.longitude),
        x: Math.random(),
        y: Math.random(),
        specialization: node.attributes.specialization,
        rank: node.attributes.rank,
        size: "4",
        credentials: node?.attributes?.credentials
          ?.map((node) => node.toUpperCase())
          .join(" "),
        location: node.attributes.location,
      },
    };
  });

  // format top prescribers
  prescribers = prescriberData.topPrescribers.map((node) => {
    let zip = calcLatLng(node.attributes.location, node);
    return {
      key: node.key,
      attributes: {
        label: capitalizeWords(node?.attributes?.label),
        color:
          specializations[node.attributes.specialization] ||
          specializations["other"],
        state: zip?.state || node.attributes.state,
        icon: prescriber,
        lat: parseFloat(zip?.latitude),
        lng: parseFloat(zip?.longitude),
        x: Math.random(),
        y: Math.random(),
        specialization: node.attributes.specialization,
        rank: node.attributes.rank,
        size: "4",
        credentials:
          node?.attributes?.credentials
            ?.map((node) => node.toUpperCase())
            .join(" ") || "",
        currentPractice: node.attributes.currentPractice
          ? capitalizeWords(node.attributes.current_practice)
          : "",
        prescriptions: node.attributes.prescriptions,
        location: node.attributes.location,
      },
    };
  });

  //format nodes of referral data
  prescriberData.nodes = prescriberData?.nodes?.map((node) => {
    let zip = calcLatLng(node.attributes.location, node);
    return {
      key: node.key,
      attributes: {
        label: capitalizeWords(node?.attributes?.label),
        color:
          specializations[node.attributes.specialization] ||
          specializations["other"],
        state: zip?.state || node.attributes.state,
        icon: null,
        lat: parseFloat(zip?.latitude),
        lng: parseFloat(zip?.longitude),
        x: Math.random(),
        y: Math.random(),
        specialization: node.attributes.specialization,
        rank: node.attributes.rank,
        size: "4",
        credentials:
          node?.attributes?.credentials
            ?.map((node) => node.toUpperCase())
            .join(" ") || "",
        currentPractice: node.attributes.current_practice,
        prescriptions: node.attributes.prescriptions,
        location: node.attributes.location,
      },
    };
  });

  //format edges of referral data
  prescriberData.edges = prescriberData?.edges?.map((edge, index) => {
    return {
      key: kolData.edges.length + 1 + index,
      type: "referral",
      source: edge.source,
      target: edge.target,
      attributes: {
        color: "#008080",
        size: edge.attributes?.weight * 0.1 > 6 ? 6 : edge.attributes.weight,
        label: edge?.attributes.weight
          ? `Unique Patients referred : ${edge.attributes.weight}`
          : "",
        type: "arrow",
      },
    };
  });

  // console.log("time for formatting: ", (new Date() - date) / 1000);
  // console.log("top kols:", kols.length);

  prescriberData.nodes = [...prescriberData.nodes, ...prescribers];
  kolData.nodes = [...kolData.nodes, ...kols];
  return { kolData, prescriberData, kols, prescribers };
};

export default formatResponse;
