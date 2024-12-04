import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

const Kartdata3Layer = () =>
  new TileLayer({
    source: new TileWMS({
      url: "http://localhost:8080/geoserver/wmts_service/wms",
      params: {
        SERVICE: "WMS",
        VERSION: "1.1.0",
        REQUEST: "GetMap",
        LAYERS: "wmts_service:kartdata3",
        BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
        SRS: "EPSG:3857",
        FORMAT: "image/png",
        STYLES: "",
      },
      projection: "EPSG:3857",
    }),
  });

export default Kartdata3Layer;
