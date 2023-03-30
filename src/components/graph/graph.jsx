import React, { useEffect, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";

import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  SearchControl,
  FullScreenControl,
  useSetSettings,
  useSigma,
  useRegisterEvents,
} from "@react-sigma/core";

const Graph = ({ data, setSelectedHcp, selectedHcp, setIsHcpDetailsShown }) => {
  const Events = () => {
    const setSettings = useSetSettings();
    const sigma = useSigma();
    const registerEvents = useRegisterEvents();

    const [hoveredNode, setHoveredNode] = useState();

    useEffect(() => {
      console.log("data");
      registerEvents({
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null),
        clickNode: (event) => {
          let node = data.nodes.find((el) => el.key == event.node);
          console.log(node);
          setSelectedHcp(node);
          setIsHcpDetailsShown(true);
          setHoveredNode(null);
        },
      });
    }, []);

    useEffect(() => {
      setSettings({
        nodeReducer: (node, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, highlighted: data.highlighted || false };

          if (hoveredNode) {
            if (
              node === hoveredNode ||
              graph.neighbors(hoveredNode).includes(node)
            ) {
              // newData.highlighted = true;
            } else {
              newData.color = "#E2E2E2";
              newData.highlighted = false;
              newData.hidden = true;
            }
          } else if (selectedHcp?.key) {
            if (node == selectedHcp?.key) {
              newData.highlighted = true;
            }
          }
          return newData;
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };

          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [hoveredNode, setSettings, sigma]);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    data.nodes.map((el) => {
      if (el.attributes.icon) {
        el.attributes.type = "image";
        el.attributes.image = el.attributes.icon;
        el.attributes.size = 13;
        el.attributes.color = "rgba(0, 0, 0, 0)";
      }
    });
  }, [data]);

  const graph = MultiDirectedGraph.from(data);

  return (
    <SigmaContainer
      graph={graph}
      style={{ height: "100%", width: "100%" }}
      settings={{
        nodeProgramClasses: { image: getNodeProgramImage() },
        defaultNodeType: "image",
        renderEdgeLabels: true,
        minEdgeSize: 1,
        maxEdgeSize: 1000,
        maxIterations: 100,
        defaultNodeColor: "#3388AA",
        maxEdgeSize: 20,
        defaultEdgeType: "arrow",
      }}
    >
      {/* <EdgeDisplayData default="tapered" /> */}
      <ControlsContainer position={"top-left"}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
      <Events
        setSelectedHcp={setSelectedHcp}
        data={data}
        setIsHcpDetailsShown={setIsHcpDetailsShown}
        selectedHcp={selectedHcp}
      />
    </SigmaContainer>
  );
};

export default Graph;
