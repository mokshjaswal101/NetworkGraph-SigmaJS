import React, { useState, useEffect } from "react";
import {
  MapContainer,
  LayersControl,
  LayerGroup,
  Polyline,
  TileLayer,
  Marker,
  Popup,
  useMap,
  FeatureGroup,
} from "react-leaflet";

import starred from "../../assets/starred.png";

import getArrow from "./getArrows";

import calculatePolyLines from "./polylines";
import L from "leaflet";

const Map = ({
  data,
  setSelectedHcp,
  selectedHcp,
  setIsHcpDetailsShown,
  setIsLoading,
  totalData,
  influenceTypes,
  setData,
}) => {
  const [polylines, setPolylines] = useState([]);
  const [tempData, setTempData] = useState(null);
  const [secondLevelId, setSecondLevelId] = useState(null);

  useEffect(() => {
    setTempData(data);
  }, []);

  useEffect(() => {
    if (data?.edges) setPolylines(calculatePolyLines(data));
  }, [data?.nodes, data?.edges]);

  const center = [37.445767, -100.161522];

  const ChangeView = () => {
    const map = useMap();
    if (selectedHcp?.key) {
      map.setView([
        parseFloat(selectedHcp?.attributes.lat),
        parseFloat(selectedHcp?.attributes.lng),
      ]);
    } else {
      map.setView(center);
    }
    return null;
  };

  useEffect(() => {
    setTempData(null);
  }, [selectedHcp?.key]);

  const handleSecondLevelInfluence = (id) => {
    if (selectedHcp?.key) {
      let baseData;

      if (tempData?.nodes?.length > 0) {
        baseData = tempData;
      } else baseData = data;

      if (baseData.nodes.some((el) => el.key == id)) {
        if (secondLevelId != id) {
          if (!tempData?.nodes?.length) setTempData(data);
          setSecondLevelId(id);
          let newData = { nodes: baseData?.nodes, edges: [] };
          newData.edges = baseData.edges.filter(
            (el) => el.source == id || el.target == id
          );

          let tempEdges = [];
          let tempNodes = [];

          totalData.edges.forEach((e) => {
            if (
              influenceTypes.includes(e.type) &&
              (e.target == id || e.source == id) &&
              !newData.edges.some((el) => el.key == e.key)
            ) {
              let temp = structuredClone(e);
              temp.level = "second";
              tempEdges.push(temp);
            }
          });

          tempEdges.forEach((edge) => {
            let extra;
            if (edge.source == id) extra = edge.target;
            else extra = edge.source;

            if (
              !newData.nodes.some((node) => node.key == extra) &&
              !tempNodes.some((node) => node.key == extra)
            ) {
              tempNodes.push(totalData.nodes.find((node) => node.key == extra));
            }
          });

          newData.nodes = [...newData.nodes, ...tempNodes];
          newData.edges = [...newData.edges, ...tempEdges];

          setData(structuredClone(newData));
        } else {
          setSecondLevelId(null);
          setData(baseData);
        }
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        style={{ width: "100%", height: "550px" }}
        center={center}
        zoom={4}
        scrollWheelZoom={false}
      >
        <ChangeView />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Default Map">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="KOLs">
            <LayerGroup>
              {data?.nodes?.map((element, index) => {
                return (
                  <Marker
                    key={element?.key}
                    id={element?.key}
                    position={[element.attributes.lat, element.attributes.lng]}
                    zIndexOffset={
                      selectedHcp?.key == element?.key
                        ? 2000
                        : element.attributes.icon
                        ? 1000
                        : 500
                    }
                    value={element}
                    icon={
                      element.attributes.icon != null
                        ? new L.Icon({
                            iconUrl: element.attributes.icon,
                            iconRetinaUrl: element.attributes.icon,
                            popupAnchor: [0, -12],
                            iconSize:
                              selectedHcp?.key == element?.key
                                ? element.attributes.icon == starred
                                  ? new L.point(22, 22)
                                  : new L.point(16, 16)
                                : new L.Point(14, 14),
                          })
                        : new L.divIcon({
                            className: "divMarkerLeaflet",
                            iconSize:
                              selectedHcp?.key == element?.key
                                ? new L.point(14, 14)
                                : new L.Point(7, 7),
                            html: `<div style=" background-color:${
                              element.attributes.color
                            };padding:${
                              selectedHcp?.key == element?.key ? "8px" : "4px"
                            };" ></div>`,
                            popupAnchor: [0, -5],
                          })
                    }
                    eventHandlers={{
                      click: (e) => {
                        handleSecondLevelInfluence(e?.target?.options?.id);
                      },
                    }}
                  >
                    <Popup closeOnClick>
                      {element.attributes.label}
                      {element?.attributes?.credentials
                        ? ", " + element.attributes.credentials
                        : ""}
                      <button
                        style={{
                          marginLeft: ".5rem",
                          border: "1px solid black",
                          padding: ".2rem .5rem",
                        }}
                        onClick={() => {
                          setSelectedHcp(element);
                          setIsHcpDetailsShown(true);
                        }}
                      >
                        <i className="fa fa-info"></i>
                      </button>
                    </Popup>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="First level Influence">
            <LayerGroup>
              {polylines?.length > 0 &&
                polylines
                  .filter((el) => el.level != "second")
                  .map((poly, index) => {
                    return (
                      <Polyline
                        key={index}
                        pathOptions={{ color: poly.cc, weight: poly.weight }}
                        positions={poly.pointList}
                      >
                        {poly?.type == "arrow" ? (
                          getArrow(
                            [poly.pointList[0], poly.pointList[1]],
                            poly.cc,
                            poly.weight
                          )
                        ) : (
                          <></>
                        )}
                      </Polyline>
                    );
                  })}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Second level Influence">
            <LayerGroup>
              {polylines?.length > 0 &&
                polylines
                  .filter((el) => el.level == "second")
                  .map((poly, index) => {
                    return (
                      <Polyline
                        key={index}
                        pathOptions={{ color: poly.cc, weight: poly.weight }}
                        positions={poly.pointList}
                        dashArray={"10, 10"}
                      >
                        {poly?.type == "arrow" ? (
                          getArrow(
                            [poly.pointList[0], poly.pointList[1]],
                            poly.cc,
                            poly.weight
                          )
                        ) : (
                          <></>
                        )}
                      </Polyline>
                    );
                  })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;
