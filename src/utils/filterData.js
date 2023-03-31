//icons
import starred from "../assets/starred.png";
import starBlue from "../assets/bluestar.png";
import diamondBlue from "../assets/diamondblue.png";
import lock from "../assets/lock.png";

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
  setSelectedSpecialization,
  unlockedNodes = -1
) => {
  let filteredData = { nodes: [], edges: [] };
  let stateList = [];
  let specializationList = new Set();

  //filter data based on selected hcp
  if (selectedHcp?.key) {
    if (
      selectedHcp?.attributes.icon == lock ||
      selectedHcp?.attributes.label == "Locked"
    ) {
      selectedHcp = data.nodes.find((node) => node.key == selectedHcp.key);
    }

    let res = filterBasedOnSelectedHcp(
      data,
      selectedHcp,
      influenceTypes,
      unlockedNodes
    );
    filteredData = res.newData;
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
const filterBasedOnSelectedHcp = (
  data,
  selectedHcp,
  influenceTypes,
  unlockedNodes
) => {
  let newData = { nodes: [], edges: [] };
  let stateList = new Set();
  let specializationList = new Set();

  // filter edges if selected hcp is equal to either source or target
  data?.edges?.forEach((edge) => {
    if (
      (edge.source == selectedHcp.key || edge.target == selectedHcp.key) &&
      influenceTypes.includes(edge.type)
    ) {
      newData.edges.push(edge);
    }
  });

  newData.nodes.push(selectedHcp);
  specializationList.add(selectedHcp?.attributes?.specialization);
  stateList.add(selectedHcp.attributes.state);

  // get nodes based on the edges filtered
  data?.nodes?.forEach((node) => {
    newData?.edges?.forEach((edge) => {
      if (
        node.key != selectedHcp.key &&
        (node.key == edge.source || node.key == edge.target) &&
        !newData.nodes.some((x) => x.key == node.key)
      ) {
        let newNode = structuredClone(node);
        let temp = edge.attributes.isVisible;
        newNode.attributes.isVisible = temp;

        if (
          unlockedNodes != -1 &&
          newNode.attributes.isVisible > unlockedNodes
        ) {
          newNode.attributes.icon = lock;
          newNode.attributes.label = "Locked";
        }
        newData.nodes.push(newNode);
        stateList.add(node.attributes.state);
        specializationList.add(node.attributes.specialization);
      }
    });
  });

  stateList = Array.from(stateList);
  specializationList = Array.from(specializationList);
  newData = structuredClone(newData);
  return { newData, stateList, specializationList };
};

//filter data based on the advanced filters
const filterBasedOnAdvancedFilters = (
  data,
  selectedSpecialization,
  selectedState
) => {
  let displayData = structuredClone(data);

  // filtering based on specialization
  if (selectedSpecialization && selectedSpecialization != "") {
    let filteredData = { nodes: [], edges: [] };
    if (selectedSpecialization == "others") {
      data.nodes.forEach((node) =>
        !node.attributes.specialization
          ? filteredData.nodes.push(structuredClone(node))
          : null
      );
    } else {
      data.nodes.forEach((node) =>
        node.attributes.specialization === selectedSpecialization
          ? filteredData.nodes.push(structuredClone(node))
          : null
      );
    }

    let extraNodes = [];

    data.edges.forEach((edge) => {
      let source = filteredData.nodes.find((node) => node.key === edge.source);
      let target = filteredData.nodes.find((node) => node.key === edge.target);

      if (source && target) {
        filteredData.edges.push(edge);
      } else if (source || target) {
        if (source) {
          extraNodes.push(data.nodes.find((node) => node.key === edge.target));
        }
        if (target) {
          extraNodes.push(data.nodes.find((node) => node.key === edge.source));
        }

        filteredData.edges.push(edge);
      }
      return false;
    });

    {
      !selectedState &&
        filteredData.nodes.forEach((node) => {
          if(node.attributes.icon != lock) {
            if (node?.attributes?.icon == starred)
            node.attributes.icon = starBlue;
          else node.attributes.icon = diamondBlue;
          }
         
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
          extraNodes.push(data.nodes.find((node) => node.key === edge.target));
        }
        if (target) {
          extraNodes.push(data.nodes.find((node) => node.key === edge.source));
        }

        filteredData.edges.push(edge);
      }
      return false;
    });

    {
      filteredData.nodes.forEach((node) => {
        if(node.attributes.icon != lock){
          if (node?.attributes?.icon == starred) node.attributes.icon = starBlue;
          else node.attributes.icon = diamondBlue;
        }
       
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
