import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";

const createVectorLayer = () =>
  new VectorLayer({
    source: new VectorSource({
      url: "http://localhost:8080/geoserver/base/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=base:Kommune&outputFormat=application/json",
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: "#797e79",
        width: 1,
      }),
    }),
  });

export default createVectorLayer;
