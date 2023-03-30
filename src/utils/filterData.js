import starred from "../assets/starred.png";
import starBlue from "../assets/bluestar.png";
import diamondBlue from "../assets/diamondblue.png";

import specializations from "../data/specializations";

const filterData = (
  data,
  setData,
  influenceTypes,
  selectedHcp,
  selectedSpecialization = "",
  selectedState = "",
  setStateList,
  setSpecializationList,
  setSelectedState,
  setSelectedSpecialization
) => {
  let filteredData = { nodes: [], edges: [] };
  let stateList = [];
  let specializationList = new Set();

  //filter data based on selected hcp
  if (selectedHcp?.key) {
    let res = filterBasedOnSelectedHcp(data, selectedHcp, influenceTypes);
    filteredData = res.filteredData;
    stateList = res.stateList;
    specializationList = res.specializationList;
  } else {
    setData({ nodes: [], edges: [] });
    return;
  }

  //filter data based on advanced filters
  filteredData = filterBasedOnAdvancedFilters(
    filteredData,
    !specializationList.includes(selectedSpecialization)
      ? ""
      : selectedSpecialization,
    !stateList.includes(selectedState) ? "" : selectedState
  );

  //On changing filters and selected hcp, if the new state list and specializations list do not contain the selected state or specialization, set them to default all
  if (!stateList.includes(selectedState)) {
    setSelectedState("");
  }
  if (!specializationList.includes(selectedSpecialization)) {
    setSelectedSpecialization("");
  }

  //Set the new state list and specializations list
  setStateList(stateList);
  setSpecializationList(specializationList);

  //set new filtered data
  setData(filteredData);
};

//filter data based on the selected Hcp
const filterBasedOnSelectedHcp = (data, selectedHcp, influenceTypes) => {
  let newData = { nodes: [], edges: [] };
  let stateList = new Set();
  let specializationList = new Set();

  // filter
  data?.edges?.forEach((edge) => {
    if (
      (edge.source == selectedHcp.key || edge.target == selectedHcp.key) &&
      influenceTypes.includes(edge.type)
    ) {
      let newEdge = structuredClone(edge);
      newEdge.level = "first";
      newData.edges.push(newEdge);
    }
  });

  newData.nodes.push(selectedHcp);
  specializationList.add(selectedHcp?.attributes?.specialization);
  stateList.add(selectedHcp.attributes.state);
  if (
    !Object.keys(specializations).includes(
      selectedHcp.attributes.specialization
    )
  )
    specializationList.add(selectedHcp.attributes.specialization);

  data?.nodes?.forEach((element) => {
    newData?.edges?.forEach((edge) => {
      if (
        element.key != selectedHcp.key &&
        (element.key == edge.source || element.key == edge.target) &&
        !newData.nodes.some((x) => x.key == element.key)
      ) {
        newData.nodes.push(structuredClone(element));
        stateList.add(element.attributes.state);
        if (
          Object.keys(specializations).includes(
            element.attributes.specialization
          )
        )
          specializationList.add(element.attributes.specialization);
      }
    });
  });

  data = structuredClone(newData);
  stateList = Array.from(stateList);
  specializationList = Array.from(specializationList);

  return { data, stateList, specializationList };
};

//filter data based on the advanced filters
const filterBasedOnAdvancedFilters = (
  totalData,
  selectedSpecialization,
  selectedState
) => {
  let displayData = structuredClone(totalData);

  // filtering based on specialization
  if (selectedSpecialization && selectedSpecialization != "") {
    let filteredData = { nodes: [], edges: [] };
    if (selectedSpecialization == "others") {
      totalData.nodes.forEach((node) =>
        !node.attributes.specialization
          ? filteredData.nodes.push(structuredClone(node))
          : null
      );
    } else {
      totalData.nodes.forEach((node) =>
        node.attributes.specialization === selectedSpecialization
          ? filteredData.nodes.push(structuredClone(node))
          : null
      );
    }

    let extraNodes = [];

    totalData.edges.forEach((edge) => {
      let source = filteredData.nodes.find((node) => node.key === edge.source);
      let target = filteredData.nodes.find((node) => node.key === edge.target);

      if (source && target) {
        filteredData.edges.push(edge);
      } else if (source || target) {
        if (source) {
          extraNodes.push(
            totalData.nodes.find((node) => node.key === edge.target)
          );
        }
        if (target) {
          extraNodes.push(
            totalData.nodes.find((node) => node.key === edge.source)
          );
        }

        filteredData.edges.push(edge);
      }
      return false;
    });

    {
      !selectedState &&
        filteredData.nodes.forEach((node) => {
          if (node?.attributes?.icon == starred)
            node.attributes.icon = starBlue;
          else node.attributes.icon = diamondBlue;
        });
    }

    extraNodes.forEach((node) => {
      if (!filteredData.nodes.some((el) => el.key == node.key))
        filteredData.nodes.push(node);
    });

    displayData = filteredData;
  }

  //filtering based on state
  if (selectedState && selectedState != "") {
    let filteredData = { nodes: [], edges: [] };

    displayData.nodes.forEach((node) =>
      node.attributes.state === selectedState
        ? filteredData.nodes.push(structuredClone(node))
        : null
    );

    let extraNodes = [];

    displayData.edges.forEach((edge) => {
      let source = filteredData.nodes.find((node) => node.key === edge.source);
      let target = filteredData.nodes.find((node) => node.key === edge.target);

      if (source && target) {
        filteredData.edges.push(edge);
      } else if (source || target) {
        if (source) {
          extraNodes.push(
            totalData.nodes.find((node) => node.key === edge.target)
          );
        }
        if (target) {
          extraNodes.push(
            totalData.nodes.find((node) => node.key === edge.source)
          );
        }

        filteredData.edges.push(edge);
      }
      return false;
    });

    {
      filteredData.nodes.forEach((node) => {
        if (node?.attributes?.icon == starred) node.attributes.icon = starBlue;
        else node.attributes.icon = diamondBlue;
      });
    }

    extraNodes.forEach((node) => {
      if (!filteredData.nodes.some((el) => el.key == node.key))
        filteredData.nodes.push(node);
    });

    return filteredData;
  } else {
    return displayData;
  }
};

export default filterData;
