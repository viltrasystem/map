// import XYZ from "ol/source/XYZ";
// import TileLayer from "ol/layer/Tile";
// import { useMemo } from "react";
// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";
// //import { TileWMS } from "ol/source";
// import TileWMS from "ol/source/TileWMS";
// import Style from "ol/style/Style";
// import Stroke from "ol/style/Stroke";
// import GeoJSON from "ol/format/GeoJSON";

// // #region base layers
// export const osmLayer = new TileLayer({
//   source: new XYZ({
//     url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
//   }),
//   visible: true,
// });

// export const vectorLayer = useMemo(() => {
//   return new VectorLayer({
//     source: new VectorSource({
//       url: "http://localhost:8080/geoserver/base/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=base:Kommune&outputFormat=application/json",
//       format: new GeoJSON(),
//     }),
//     style: new Style({
//       stroke: new Stroke({
//         color: "#797e79",
//         width: 1,
//       }),
//     }),
//   });
// }, []);
// //bakgrunnskart_forenklet
// //europa_forenklet
// export const europa_forenkletLayer = useMemo(() => {
//   return new TileLayer({
//     source: new TileWMS({
//       url: "http://localhost:8080/geoserver/wmts_service/wms",
//       params: {
//         SERVICE: "WMS",
//         VERSION: "1.1.0",
//         REQUEST: "GetMap",
//         LAYERS: "wmts_service:europa_forenklet",
//         BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
//         // WIDTH: 767,
//         // HEIGHT: 768,
//         SRS: "EPSG:3857",
//         FORMAT: "image/png",
//         STYLES: "",
//       },
//       projection: "EPSG:3857",
//     }),
//   });
// }, []);

// export const havbunn_grunnkartLayer_source = new TileWMS({
//   url: "http://localhost:8080/geoserver/wmts_service/wms",
//   params: {
//     SERVICE: "WMS",
//     VERSION: "1.1.0",
//     REQUEST: "GetMap",
//     LAYERS: "wmts_service:havbunn_grunnkart",
//     BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
//     // WIDTH: 767,
//     // HEIGHT: 768,
//     SRS: "EPSG:3857",
//     FORMAT: "image/png",
//     STYLES: "",
//   },
//   projection: "EPSG:3857",
// });

// export const havbunn_grunnkartLayer = useMemo(() => {
//   return new TileLayer({
//     source: havbunn_grunnkartLayer_source,
//   });
// }, []);

// export const kartdata3Layer = useMemo(() => {
//   return new TileLayer({
//     source: new TileWMS({
//       url: "http://localhost:8080/geoserver/wmts_service/wms",
//       params: {
//         SERVICE: "WMS",
//         VERSION: "1.1.0",
//         REQUEST: "GetMap",
//         LAYERS: "wmts_service:kartdata3",
//         BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
//         // WIDTH: 767,
//         // HEIGHT: 768,
//         SRS: "EPSG:3857",
//         FORMAT: "image/png",
//         STYLES: "",
//       },
//       projection: "EPSG:3857",
//     }),
//   });
// }, []);

// export const topograatoneLayer = useMemo(() => {
//   return new TileLayer({
//     source: new TileWMS({
//       url: "http://localhost:8080/geoserver/wmts_service/wms",
//       params: {
//         SERVICE: "WMS",
//         VERSION: "1.1.0",
//         REQUEST: "GetMap",
//         LAYERS: "wmts_service:topograatone",
//         BBOX: "-2.0037508342789244E7,-2.00489661040146E7,2.0037508342789244E7,2.0048966104014594E7",
//         // WIDTH: 767,
//         // HEIGHT: 768,
//         SRS: "EPSG:3857",
//         FORMAT: "image/png",
//         STYLES: "",
//       },
//       projection: "EPSG:3857",
//     }),
//   });
// }, []);

// // #endregion
