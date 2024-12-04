import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

const HavbunnGrunnkartLayerSource = () =>
  new TileWMS({
    url: "http://localhost:8080/geoserver/wmts_service/wms",
    params: {
      SERVICE: "WMS",
      VERSION: "1.1.0",
      REQUEST: "GetMap",
      LAYERS: "wmts_service:havbunn_grunnkart",
      BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
      SRS: "EPSG:3857",
      FORMAT: "image/png",
      STYLES: "",
    },
    projection: "EPSG:3857",
  });

const HavbunnGrunnkartLayer = () =>
  new TileLayer({
    source: HavbunnGrunnkartLayerSource(),
  });

export default HavbunnGrunnkartLayer;
