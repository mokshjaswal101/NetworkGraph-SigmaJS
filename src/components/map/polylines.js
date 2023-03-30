import L from "leaflet";
const calculatePolyLines = (data) => {
  let p = data?.edges?.map((edge) => {
    let source = edge.source;
    let target = edge.target;
    let pointA = { lat: 0, lng: 0 };
    let pointB = { lat: 0, lng: 0 };

    data?.nodes.map((node) => {
      if (node.key == source) {
        pointA = new L.latLng(node.attributes.lat, node.attributes.lng);
      }
      if (node.key == target) {
        pointB = new L.latLng(node.attributes.lat, node.attributes.lng);
      }
      if (!pointA.lat || !pointB.lat) {
        return;
      }
    });
    return {
      pointList: [pointA, pointB],
      op: edge.attributes.opacity || 1,
      cc: edge.attributes.color || "#000",
      level: edge.level,
      weight: edge.attributes.size,
      type: edge.attributes.type,
      influence: edge.influence,
    };
  });

  return p;
};

export default calculatePolyLines;
