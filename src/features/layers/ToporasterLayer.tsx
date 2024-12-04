import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { getMapUrl } from "../../lib/helpFunction";

const ToporasterLayer = () =>
  new TileLayer({
    source: new TileWMS({
      url: `${getMapUrl()}/geoserver/base/wms`, // GeoServer WMS URL
      params: {
        SERVICE: "WMS",
        VERSION: "1.1.0",
        REQUEST: "GetMap",
        LAYERS: "base:toporaster", // Layer name
        STYLES: "", // Default style (empty for default)
        //BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
        BBOX: "-1.2645686342253646E7,-2.3583545928003695E7,1.4361008310400637E7,2.611837501148252E7", // Bounding box
        WIDTH: 417, // Width of the map
        HEIGHT: 768, // Height of the map
        SRS: "EPSG:3857", // Spatial Reference System (projection)
        FORMAT: "image/png", // Format of the map image
      },
      projection: "EPSG:3857",
      serverType: "geoserver", // Server type
      crossOrigin: "anonymous", // Cross-origin access
    }),
  });
export default ToporasterLayer;

//http://217.182.198.16:8080/geoserver/base/wms?service=WMS&version=1.1.0&request=GetMap&layers=base%3Atoporaster&bbox=-3500000.0%2C3500000.0%2C2045984.0%2C9045984.0&width=768&height=768&srs=EPSG%3A25835&styles=&format=image%2Fpng
