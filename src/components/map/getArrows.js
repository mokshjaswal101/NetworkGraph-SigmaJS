import L from "leaflet";
import { Marker } from "react-leaflet";

const getArrow = (arrLatlngs, color = "red", weight) => {
  if (!arrLatlngs || arrLatlngs.length < 2) return;

  if (
    arrLatlngs[0].lat == arrLatlngs[1].lat &&
    arrLatlngs[0].lng == arrLatlngs[1].lng
  )
    return;

  let icon = L.divIcon({
    className: "arrow-icon",
    html: `<div style="border: 8px solid transparent; border-top-color:${color} ;  transform: rotate(${getAngle(
      arrLatlngs[1],
      arrLatlngs[0],
      -1
    )}rad) translateY(-30%);" ></div>`,
  });

  return <Marker position={arrLatlngs[1]} icon={icon} />;
};

const getAngle = (latLng1, latlng2) => {
  let dx = latlng2.lat - latLng1.lat;
  let dy = latlng2.lng - latLng1.lng;

  let ang = Math.atan2(dy, dx);
  return ang;
};

export default getArrow;
