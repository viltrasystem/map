import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const OSMLayer = () =>
  new TileLayer({
    source: new XYZ({
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    }),
    visible: true,
  });

export default OSMLayer;
