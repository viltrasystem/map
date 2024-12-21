import React, {
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Overlay } from "ol";
import { transform } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import store, { RootState } from "../../app/store";
import styles from "./Map.module.css"; // Import Tailwind CSS
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { Fill, Icon, Text } from "ol/style";
//import { containsCoordinate } from "ol/extent";
import LayerSelection from "../../ui/LayerSelection";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Draw, Modify, Select } from "ol/interaction";
import { Circle, Geometry, LineString, Polygon } from "ol/geom";
import CircleStyle from "ol/style/Circle";
import { unByKey } from "ol/Observable";
import { DrawEvent } from "ol/interaction/Draw";
import {
  adjustCenter,
  colorToHex,
  formatArea,
  formatLength,
  getToastOptions,
  isEmpty,
  isValidDrawFeature,
  isValidDrawOption,
  showFeatureInfo,
  showNoFeatureInfo,
} from "../../lib/helpFunction";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  drawnFeature,
  updateDrawnFeatures,
} from "../../slices/mapDrawnFeatureSlice";
import { ScaleLine } from "ol/control";
import CoordinateDisplay from "../../ui/CoordinateDisplay";
import { setCoordinates } from "../../slices/mapFeatureSlice";
import UserLocate from "../../ui/UserLocate";
import ZoomIn from "../../ui/ZoomIn";
import ZoomOut from "../../ui/ZoomOut";
import "ol/ol.css";
import { setLoadingState } from "../../slices/loadingSlice";
import ToporasterLayer from "../layers/ToporasterLayer";
import SjokartrasterLayer from "../layers/SjokartrasterLayer";
import TopoLayer from "../layers/TopoLayer";
import createVectorLayer from "../layers/createVectorLayer";
import TopograatoneLayer from "../layers/TopograatoneLayer";
import OSMLayer from "../layers/OSMLayer";
import { PrintInfo } from "../../ui/SideBar";
import { click } from "ol/events/condition";
import { setSideBarVisibility } from "../../slices/sideBarSlice";
import { getFeatureStyle, getAccuracyStyle } from "../../lib/featureStyle";
import SpinnerMini from "../../ui/SpinnerMini";
import { fetchComplete } from "../../slices/unitLandLayerSlice";

type MapWrapperProps = {};
export interface MapWrapperRef {
  PrintMap: (arg: PrintInfo) => void;
  DownloadMap: (arg: PrintInfo) => void;
  CancelDownloadMap: () => void;
  mapToolToggle: (height: number) => void;
  mapLayerChange: () => void;
  mapMarkerRemove: () => void;
  mapUnitLayerChange: () => void;
  // TooltipClose: () => void;
}

const MapWrapper = React.memo(
  forwardRef<MapWrapperRef, MapWrapperProps>((props, ref) => {
    console.log(props); //*** */
    const mapRef = useRef<HTMLDivElement>(null); // Ref for the map container
    const overlaysRef = useRef<Overlay[]>([]);
    const markerRef = useRef<Feature<Geometry> | null>(null);
    const mapToolRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const closerRef = useRef<HTMLAnchorElement>(null);
    const dispatch = useAppDispatch();
    const { selectedTab } = useAppSelector(
      (state: RootState) => state.tabSelection
    );
    const { savedFeatures, isLoading: isSavedFeaturesLoading } = useAppSelector(
      (state: RootState) => state.mapSavedFeature
    );
    //const { data: baseLayerData } = useGetBaseLayerQuery("base:Kommune");

    proj4.defs(
      "EPSG:25832",
      "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"
    ); //corresponds to ETRS89 / UTM zone 32N. The EPSG code 25832 represents this specific UTM zone, which covers northern Europe.
    register(proj4);

    const vectorLayer = useMemo(() => createVectorLayer(), []);
    const toporasterLayer = useMemo(() => ToporasterLayer(), []);
    const sjokartrasterLayer = useMemo(() => SjokartrasterLayer(), []);
    const topoLayer = useMemo(() => TopoLayer(), []);
    const topograatoneLayer = useMemo(() => TopograatoneLayer(), []);
    const osmLayer = useMemo(() => OSMLayer(), []);

    const sourceCRS = "EPSG:25832";
    const targetCRS = "EPSG:3857";
    const transformFunction = proj4(sourceCRS, targetCRS);

    // const {
    //   data: fetchedMapData,
    //   isLoading: mapLoading1,
    //   isError: isMapError,
    //   error: mapError,
    // } = useGetMapQuery();

    const {
      land,
      isLoading: mapLoading,
      noContent,
      // error,
      // isError,
    } = useAppSelector((state: RootState) => state.selectland);

    const { landLayers, status } = useAppSelector(
      (state: RootState) => ({
        landLayers: state.unitLandLayer.landLayers,
        status: state.unitLandLayer.status,
      }),
      (prev, next) =>
        prev.landLayers === next.landLayers && prev.status === next.status
    );

    let selectedLand: any = null;
    const lastFeature: Record<string, Feature> = {};
    if (land) {
      selectedLand = land;
    }

    let unitLands: any = null;
    let firstFeature: Feature | undefined = undefined;
    if (landLayers) {
      unitLands = landLayers;
    }

    const markerStyle = useMemo(
      () =>
        new Style({
          image: new Icon({
            src: "/assets/images/flag.png",
            scale: 1,
          }),
        }),
      []
    );

    const markerHideStyle = new Style({
      image: new Icon({
        src: "/assets/images/flag.png",
        scale: 0.1,
      }),
    });

    const markers = new VectorLayer({
      source: new VectorSource(),
    });

    const selectStyle = new Style({
      stroke: new Stroke({
        color: "#3399CC",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(248, 12, 83, 0.2)",
      }),
    });

    const fillStyle = new Style({
      fill: new Fill({
        color: "rgba(248, 12, 83, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(248, 12, 83, 0.4)",
        width: 1, // Stroke width
      }),
    });

    const fillHighlightedStyle = new Style({
      fill: new Fill({
        color: "rgba(255, 20, 90, 0.4)", // Fill color (red with 20% opacity)
      }),
      stroke: new Stroke({
        color: "rgba(255, 50, 70, 0.9)", // Stroke color (red)
        width: 1, // Stroke width
      }),
    });

    const drawnVectorSource = new VectorSource();
    const drawnVectorLayer = new VectorLayer({
      source: drawnVectorSource,
    });

    let savedFeatureLayer = new VectorLayer();

    const selectDrawnFeatures = new Select({
      // for select drawn feature when drawn layer on top of another layer
      condition: click,
      layers: [drawnVectorLayer],
      style: selectStyle,
    });

    const userPositionSource = new VectorSource();
    const userPositionLayer = new VectorLayer({
      source: userPositionSource,
      // style: userLocateStyle,
    });
    console.log(
      store.getState().mapFeature.mapZoom,
      "store.getState().mapFeature.mapZoom"
    );
    const view = useMemo(
      () =>
        new View({
          center: transform(
            store.getState().mapFeature.mapCenter,
            "EPSG:4326",
            "EPSG:3857"
          ), //y [10, 60], // Default center, previous working one ([(12.75, 65.3)] "EPSG:4326", "EPSG:3857")
          zoom: store.getState().mapFeature.mapZoom, // Default zoom
          projection: "EPSG:3857",
          maxZoom: 19,
          // resolutions: resolutions,
        }),
      []
    );

    const map = new Map({
      // target: mapRef.current,
      layers: [
        toporasterLayer,
        sjokartrasterLayer,
        topoLayer,
        topograatoneLayer,
        osmLayer,
        drawnVectorLayer,
        userPositionLayer,
      ],
      view: view,
      controls: [
        new ScaleLine({
          className: "ol-scale-line",
          bar: false,
        }),
      ], // Add the ScaleLine control for the ruler
      //  overlays: [overlay],
    });

    // #region define variables for drawn features
    let sketch: Feature<Geometry> | null = null;
    let draw: Draw;
    let helpMsg: string;
    let helpTooltipElement: HTMLElement;
    let helpTooltip: Overlay;
    let measureTooltipElement: HTMLElement;
    let measureTooltip: Overlay;
    const continuePolygonMsg: string = "Click to continue drawing the polygon";
    const continueLineMsg: string = "Click to continue drawing the line";
    const continuePointMsg: string = "Click to continue drawing the points";
    let mouseOut: boolean = false;
    // #endregion

    useEffect(() => {
      if (
        !vectorLayer ||
        //  !fetchedBaseMapData ||
        // !fetchedMapData ||
        !mapRef.current ||
        !popupRef.current ||
        !closerRef.current
        // !land ||
        // !europa_forenkletLayer ||
        //!norges_grunnkart_graatoneLayer ||
      ) {
        return;
      }

      /// *** start - loading vector layer///
      // const transformCoordinates = (
      //   coordinates: number[][] | number[][][] | number[][][][]
      // ) => {
      //   if (Array.isArray(coordinates[0])) {
      //     return coordinates.map((coord) => transformFunction.forward(coord));
      //   } else if (Array.isArray(coordinates[0][0])) {
      //     return coordinates.map((path) =>
      //       path.map((coord) => transformFunction.forward(coord))
      //     );
      //   } else {
      //     return coordinates.map((component) =>
      //       component.map((path) =>
      //         path.map((coord) => transformFunction.forward(coord))
      //       )
      //     );
      //   }
      // };

      // const transformedMapGeoJsonData = {
      //   ...fetchedMapData,
      //   features: fetchedMapData?.features.map((feature) => ({
      //     ...feature,
      //     geometry: {
      //       ...feature.geometry,
      //       coordinates: transformCoordinates(feature.geometry.coordinates),
      //     },
      //   })),
      // };

      // const mapFeatures = new GeoJSON().readFeatures(transformedMapGeoJsonData);
      // const mapVectorSource = new VectorSource({
      //   features: mapFeatures,
      // });
      // mapVectorLayer.setSource(mapVectorSource);
      /// *** end - loading vector layer///
      const container = popupRef.current;
      // const content = container.querySelector("#popup-content");
      const closer = closerRef.current;

      const overlay = new Overlay({
        element: container,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      map.setTarget(mapRef.current);
      map.addOverlay(overlay);

      toporasterLayer.setVisible(false);
      sjokartrasterLayer.setVisible(false);
      topoLayer.setVisible(true);
      topograatoneLayer.setVisible(false);
      osmLayer.setVisible(false);

      // #region   for  land loaded
      const overlays: Overlay[] = [];
      if (
        selectedTab === "selectedLand" &&
        selectedLand &&
        selectedLand.length > 0 &&
        !noContent
      ) {
        selectedLand.forEach((landFeature: any, index: number) => {
          const transformedFeatures: Feature<Geometry>[] = [];
          const vectorLandSource = new VectorSource();
          if (landFeature.features) {
            // Iterate over each feature in the Feature Collection
            landFeature.features.forEach((feature: Feature<Geometry>) => {
              try {
                // Read and transform each feature individually
                const transformedFeature = new GeoJSON().readFeature(feature, {
                  dataProjection: sourceCRS,
                  featureProjection: targetCRS,
                });

                if (selectedLand.length === index + 1) {
                  const key =
                    landFeature.features[0]?.properties?.Matrikkelnummertekst;
                  if (key) {
                    lastFeature[key] = transformedFeature;
                  } else {
                    console.error(
                      "Matrikkelnummertekst is missing in properties."
                    );
                  }
                }
                if (!transformedFeature) {
                  console.error("Failed to transform feature:", feature);
                  return;
                }

                // Push the transformed feature to the array
                transformedFeatures.push(transformedFeature);

                const geometry = transformedFeature.getGeometry();
                if (!geometry) {
                  console.error("Feature has no geometry:", transformedFeature);
                  return;
                }

                // Get the center of the polygon
                const extent = transformedFeature?.getGeometry()?.getExtent()!;
                const adjustedCenter = adjustCenter(extent, 50, 0);
                // const center = getCenter(extent);

                // Create overlay element
                const landOverlayElement: HTMLElement =
                  document.createElement("div");
                landOverlayElement.className = "overlay";
                landOverlayElement.innerHTML =
                  transformedFeature.getProperties().Matrikkelnummertekst;

                // Create an overlay and set its position
                const overlay = new Overlay({
                  element: landOverlayElement,
                  positioning: "bottom-left",
                  stopEvent: false,
                  offset: [0, -15],
                });

                overlay.setPosition(adjustedCenter);
                overlays.push(overlay);
              } catch (error) {
                console.error("Error processing feature:", feature, error);
              }
            });
          } else {
            console.error("No features found in landFeature:", landFeature);
          }
          vectorLandSource.addFeatures(transformedFeatures);

          const vectorLandLayer = new VectorLayer({
            source: vectorLandSource,
            style: new Style({
              fill: new Fill({
                color: "rgba(248, 12, 83, 0.2)",
              }),
              stroke: new Stroke({
                color: "rgba(248, 12, 83, 0.4)",
                width: 1, // Stroke width
              }),
            }),
            properties: {
              Matrikkelnummertekst:
                landFeature.features[0].properties.Matrikkelnummertekst,
            },
          });
          // Create a vector source with the transformed features
          // //  vectorLandSource.addFeatures(transformedFeatures);

          // //   const vectorLandLayer = new VectorLayer({
          // //     source: vectorLandSource,
          // //     style: new Style({
          // //       fill: new Fill({
          // //         color: "rgba(248, 12, 83, 0.2)", // Fill color (red with 20% opacity)
          // //       }),
          // //       stroke: new Stroke({
          // //         color: "#1bdf3b", // Stroke color (red)
          // //         width: 1, // Stroke width
          // //       }),
          // //     }),
          map.addLayer(vectorLandLayer);
        });

        if (overlays.length > 0) {
          overlays.forEach((overlay) => {
            map.addOverlay(overlay);
          });
        }
        //  localStorage.setItem("selected_land", JSON.stringify(selectedLand));
      }

      ////////////////////
      if (selectedTab === "land" && unitLands && unitLands.length > 0) {
        // && !noContent ***
        unitLands.forEach((layer: any, index: number) => {
          layer.forEach((landFeature: any) => {
            const transformedFeatures: Feature<Geometry>[] = [];
            const vectorLandSource = new VectorSource();
            if (landFeature.features) {
              // Iterate over each feature in the Feature Collection
              landFeature.features.forEach((feature: Feature<Geometry>) => {
                try {
                  // Read and transform each feature individually
                  const transformedFeature = new GeoJSON().readFeature(
                    feature,
                    {
                      dataProjection: sourceCRS,
                      featureProjection: targetCRS,
                    }
                  );

                  if (index === 1) {
                    firstFeature = transformedFeature;
                  }
                  if (!transformedFeature) {
                    console.error("Failed to transform feature:", feature);
                    return;
                  }

                  // Push the transformed feature to the array
                  transformedFeatures.push(transformedFeature);

                  const geometry = transformedFeature.getGeometry();
                  if (!geometry) {
                    console.error(
                      "Feature has no geometry:",
                      transformedFeature
                    );
                    return;
                  }

                  // Get the center of the polygon
                  const extent = transformedFeature
                    ?.getGeometry()
                    ?.getExtent()!;
                  const adjustedCenter = adjustCenter(extent, 50, 0);
                  // const center = getCenter(extent);

                  // Create overlay element
                  const landOverlayElement: HTMLElement =
                    document.createElement("div");
                  landOverlayElement.className = "overlay";
                  landOverlayElement.innerHTML =
                    transformedFeature.getProperties().Matrikkelnummertekst;

                  // Create an overlay and set its position
                  const overlay = new Overlay({
                    element: landOverlayElement,
                    positioning: "bottom-left",
                    stopEvent: false,
                    offset: [0, -15],
                  });

                  overlay.setPosition(adjustedCenter);
                  overlays.push(overlay);
                } catch (error) {
                  console.error("Error processing feature:", feature, error);
                }
              });
            } else {
              console.error("No features found in landFeature:", landFeature);
            }
            vectorLandSource.addFeatures(transformedFeatures);

            const vectorLandLayer = new VectorLayer({
              source: vectorLandSource,
              style: new Style({
                fill: new Fill({
                  color: "rgba(248, 12, 83, 0.2)",
                }),
                stroke: new Stroke({
                  color: "rgba(248, 12, 83, 0.4)",
                  width: 1, // Stroke width
                }),
              }),
              properties: {
                Matrikkelnummertekst:
                  landFeature.features[0].properties.Matrikkelnummertekst,
                LandId: landFeature.features[0].properties.LandId,
              },
            });
            // Create a vector source with the transformed features
            // //  vectorLandSource.addFeatures(transformedFeatures);

            // //   const vectorLandLayer = new VectorLayer({
            // //     source: vectorLandSource,
            // //     style: new Style({
            // //       fill: new Fill({
            // //         color: "rgba(248, 12, 83, 0.2)", // Fill color (red with 20% opacity)
            // //       }),
            // //       stroke: new Stroke({
            // //         color: "#1bdf3b", // Stroke color (red)
            // //         width: 1, // Stroke width
            // //       }),
            // //     }),
            map.addLayer(vectorLandLayer);
          });
        });

        if (overlays.length > 0) {
          overlays.forEach((overlay) => {
            map.addOverlay(overlay);
          });
        }
        //  localStorage.setItem("selected_land", JSON.stringify(selectedLand));
      }
      ///////////////////////

      overlaysRef.current = overlays;
      overlays.forEach((overlay) => map.addOverlay(overlay));

      // Listen for zoom changes
      map.getView().on("change:resolution", () => {
        const zoom =
          map.getView().getZoom() || store.getState().mapFeature.mapZoom;
        const showOverlays = zoom >= 14;
        const showMarkers = zoom >= 13;

        if (overlays.length > 0) {
          overlays.forEach((overlay) => {
            const element = overlay.getElement();
            if (element) {
              element.style.display = showOverlays ? "block" : "none";
            }
          });
        }

        if (markerRef.current) {
          markerRef.current.setStyle(
            showMarkers ? markerStyle : markerHideStyle
          ); // Show or hide the marker
        }

        if (showOverlays) {
          savedFeatureLayer.setVisible(true);
        } else {
          savedFeatureLayer.setVisible(false);
        }
      });

      // Initial check
      const initialZoom =
        map.getView().getZoom() || store.getState().mapFeature.mapZoom;
      const initialShowOverlays = initialZoom >= 14;
      const initialShowMarkers = initialZoom >= 13;
      overlays.forEach((overlay) => {
        const element = overlay.getElement();
        if (element) {
          element.style.display = initialShowOverlays ? "block" : "none";
        }
      });

      if (markerRef.current) {
        markerRef.current.setStyle(
          initialShowMarkers ? markerStyle : markerHideStyle
        ); // Show or hide the marker
      }

      // #endregion

      // #region   for drawn features
      const addPoint = (coordinates: number[]) => {
        const iconType = store.getState().draw.selectedImageOption!;
        const iconColor = store.getState().draw.selectedColor!;
        const iconSize = store.getState().draw.selectedFontSize!;
        const pointFeature = new Feature({
          geometry: new Point(coordinates),
          iconType: iconType,
          id: uuidv4(), // Use a unique identifier for each feature
          iconColor: iconColor,
          iconSize: iconSize,
        });
        const featureStyle = getFeatureStyle(iconType, iconColor, iconSize);
        if (featureStyle != null) {
          pointFeature.setStyle(featureStyle);
          drawnVectorSource.addFeature(pointFeature);
        }
      };

      map.on("click", function (event) {
        if (store.getState().draw.selectedDrawOption === "Point") {
          if (store.getState().draw.selectedImageOption === null) {
            toast.error("Please select icon type before click", {
              ...getToastOptions,
              position: "top-center",
            });
          } else {
            const coordinates = event.coordinate;
            addPoint(coordinates);
          }
        } else if (store.getState().draw.selectedDrawOption === "Text") {
          if (store.getState().draw.typedText === null) {
            toast.error("Please enter text before click", {
              ...getToastOptions,
              position: "top-center",
            });
          } else {
            const coordinate = event.coordinate; // Clicked coordinate

            const textFeature = new Feature({
              geometry: new Point(coordinate),
              iconType: null,
              id: uuidv4(), // Use a unique identifier for each feature
            });
            textFeature.setStyle(
              textStyle(
                store.getState().draw.selectedColor,
                store.getState().draw.typedText!
              )
            );
            drawnVectorSource.addFeature(textFeature);
          }
        } else if (
          store.getState().draw.selectedDrawOption === "Edit" ||
          store.getState().draw.selectedDrawOption === "Delete"
        ) {
          selectDrawnFeatures.on("select", (event) => {
            const selectedFeatures = event.selected;
            if (selectedFeatures.length > 0) {
              console.log(selectedFeatures, "click");
              if (
                selectedFeatures &&
                store.getState().draw.selectedDrawOption === "Edit"
              ) {
                const modify = new Modify({ source: drawnVectorSource });
                map.addInteraction(modify);
                //   selectedFeatures.setStyle(selectStyle); already set
                console.log("click edit");
              } else if (
                selectedFeatures &&
                store.getState().draw.selectedDrawOption === "Delete"
              ) {
                drawnVectorSource.removeFeature(selectedFeatures[0]);
              }
            }
          });
        }
      });

      map.getViewport().addEventListener("mouseleave", function () {
        mouseOut = true;
        map.removeInteraction(selectDrawnFeatures);
        map.removeInteraction(draw);
        if (helpTooltipElement) helpTooltipElement.classList.add("hidden");
      });

      map.on("pointermove", function (event) {
        // #region pointer cordinate to show
        const coords: [number, number] = map.getEventCoordinate(
          event.originalEvent
        ) as [number, number];
        dispatch(setCoordinates(coords));
        if (isValidDrawFeature(store.getState().draw.selectedDrawOption)) {
          // #endregion
          if (mouseOut) {
            mouseOut = false;
            if (
              store.getState().draw.selectedDrawOption === "Edit" ||
              store.getState().draw.selectedDrawOption === "Delete"
            ) {
              if (store.getState().draw.selectedDrawOption === "Edit") {
                helpMsg = "Click on the drawing to edit";
              } else {
                helpMsg = "Click on the feature on map to delete";
              }
              map.addInteraction(selectDrawnFeatures);
            } else if (store.getState().draw.selectedDrawOption === "Text") {
              helpMsg = "Click on the map to place text";
            } else if (
              isValidDrawOption(store.getState().draw.selectedDrawOption)
            ) {
              helpMsg = "Click to start drawing";
              addInteraction();
            }
          }

          if (event.dragging) {
            return;
          }

          if (
            sketch &&
            store.getState().draw.selectedDrawOption !== "Edit" &&
            store.getState().draw.selectedDrawOption !== "Text" &&
            isValidDrawOption(store.getState().draw.selectedDrawOption)
          ) {
            const geom = sketch.getGeometry();
            if (
              geom instanceof Polygon &&
              store.getState().draw.selectedDrawOption === "Polygon"
            ) {
              helpMsg = continuePolygonMsg;
            } else if (
              geom instanceof LineString &&
              store.getState().draw.selectedDrawOption === "LineString"
            ) {
              helpMsg = continueLineMsg;
            } else if (
              geom instanceof Point &&
              store.getState().draw.selectedDrawOption === "Point"
            ) {
              helpMsg = continuePointMsg;
            }
          }

          if (helpTooltipElement) {
            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(event.coordinate);
            helpTooltipElement.classList.remove("hidden");
          }
        }
      });

      const addInteraction = (): void => {
        const type = store.getState().draw.selectedDrawOption;
        if (type === "LineString" || type === "Polygon") {
          draw = new Draw({
            source: drawnVectorSource,
            type: type,
            style: getStyle,
          });

          map.addInteraction(draw);

          map.addInteraction(selectDrawnFeatures);
          console.log(type, "inside add interaction LineString/Polygon");
          createMeasureTooltip();
          createHelpTooltip();

          let listener: any;
          draw.on("drawstart", function (evt: DrawEvent) {
            // set sketch
            sketch = evt.feature;
            if (sketch && sketch.getGeometry()) {
              let tooltipCoord: any;
              listener = sketch.getGeometry()?.on("change", function (evt) {
                const geom = evt.target;
                let output: string = "";
                if (geom instanceof Polygon) {
                  output = formatArea(geom);
                  tooltipCoord = geom.getInteriorPoint().getCoordinates();
                  measureTooltip.setPosition(tooltipCoord);
                } else if (geom instanceof LineString) {
                  output = formatLength(geom);
                  tooltipCoord = geom.getLastCoordinate();
                  measureTooltip.setPosition(tooltipCoord);
                }
                measureTooltipElement.innerHTML = output;
              });
            }
          });

          draw.on("drawend", function (e) {
            const customStyle = new Style({
              fill: new Fill({
                color: colorToHex(store.getState().draw.selectedColor, 0.3),
              }),
              stroke: new Stroke({
                color: store.getState().draw.selectedColor,
                width: store.getState().draw.selectedLineSize,
              }),
            });

            e.feature.setStyle(customStyle);
            measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
            measureTooltip.setOffset([0, -7]);

            measureTooltipElement.innerHTML = "";
            createMeasureTooltip();
            unByKey(listener);
          });
        }
      };

      const createHelpTooltip = (): void => {
        // help tooltip overlay
        if (helpTooltipElement) {
          helpTooltipElement.parentNode?.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement("div");
        helpTooltipElement.className = "ol-tooltip hidden";
        helpTooltip = new Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: "center-left",
        });
        map.addOverlay(helpTooltip);
      };

      const createMeasureTooltip = (): void => {
        // crating measure
        if (measureTooltipElement) {
          measureTooltipElement.parentNode?.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement("div");
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: "bottom-center",
          stopEvent: false,
          insertFirst: false,
        });
        map.addOverlay(measureTooltip);
        measureTooltipElement.addEventListener(
          "click",
          handleOverlayClick.bind(null, measureTooltip)
        );
      };

      const handleOverlayClick = (clickedOverlay: Overlay) => {
        // overlay area/length lable delete
        if (store.getState().draw.selectedDrawOption === "Delete") {
          map.removeOverlay(clickedOverlay);
          console.log("Clicked overlay: in", clickedOverlay);
        }
        console.log("Clicked overlay:out", clickedOverlay);
      };

      const textStyle = (seleColor: string, typedTxt: string): Style => {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new CircleStyle({
            radius: 1,
            fill: new Fill({
              color: "rgba(225,225,225,0.1)",
            }),
          }),
          text: new Text({
            font: "12px Calibri,sans-serif",
            fill: new Fill({
              color: seleColor,
            }),
            stroke: new Stroke({
              color: "rgba(225,225,225,0.1)",
              width: 3,
            }),
            text: typedTxt,
            overflow: true,
            offsetY: 0,
          }),
        });
      };

      const getStyle = () => {
        // style for polygon and line string
        return new Style({
          fill: new Fill({
            color: colorToHex(store.getState().draw.selectedColor, 0.3),
          }),
          stroke: new Stroke({
            color: store.getState().draw.selectedColor,
            lineDash: [10, 10],
            width: store.getState().draw.selectedLineSize,
          }),
        });
      };

      const serializeFeatures = (
        features: Feature<Geometry>[]
      ): drawnFeature[] => {
        return features.map((feature) => {
          //   const geometry = feature.getGeometry();
          const properties = feature.getProperties();
          return {
            id: properties.id,
            iconType: properties.iconType,
            iconColor: properties.iconColor,
            iconSize: properties.iconSize,
            geometry: feature,
            //geometry: geometry ? geometry.clone() : null, // Ensure geometry is cloned properly
          };
        });
      };

      drawnVectorSource.on("addfeature", () => {
        const features = drawnVectorSource.getFeatures();
        const serializedFeatures = serializeFeatures(features);
        dispatch(updateDrawnFeatures(serializedFeatures));
      });

      drawnVectorSource.on("removefeature", () => {
        const features = drawnVectorSource.getFeatures();
        const serializedFeatures = serializeFeatures(features);
        dispatch(updateDrawnFeatures(serializedFeatures));
      });

      // #endregion
      closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      // #region load saved map data
      if (!isSavedFeaturesLoading && savedFeatures.length > 0) {
        const geojsonObject = {
          type: "FeatureCollection",
          features: savedFeatures.map((feature) => {
            return {
              type: "Feature",
              geometry: feature.Geometry,
              properties: feature.Properties,
            };
          }),
        };

        const savedFeatureSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject, {
            featureProjection: "EPSG:3857", // adjust the projection if needed
          }),
        });

        savedFeatureSource.getFeatures().forEach((olFeature) => {
          const geometry = olFeature.getGeometry();
          if (geometry instanceof Point) {
            const properties = olFeature.getProperties();
            if (properties.iconType) {
              const featureStyle = getFeatureStyle(
                properties.iconType,
                properties.iconColor,
                properties.iconSize
              );
              if (featureStyle) olFeature.setStyle(featureStyle);
            } else {
              olFeature.setStyle(
                textStyle(properties.style.textColor, properties.style.text)
              );
            }
            //  console.log("This feature is a Point.");
          } else {
            const styleData = olFeature.get("style");
            if (styleData) {
              const style = new Style({
                fill: new Fill({ color: styleData.fillColor }),
                stroke: new Stroke({
                  color: styleData.strokeColor,
                  width: styleData.strokeWidth,
                }),
                text: new Text({
                  text: styleData.text,
                  fill: new Fill({ color: styleData.textColor }),
                  font: styleData.textFont,
                }),
              });
              olFeature.setStyle(style);
            }
          }
        });

        savedFeatureLayer = new VectorLayer({
          source: savedFeatureSource,
          style: (feature) => {
            const style = feature.get("style");
            return new Style({
              fill: new Fill({
                color: style.fillColor,
              }),
              stroke: new Stroke({
                color: style.strokeColor,
                width: style.strokeWidth,
              }),
            });
          },
        });

        savedFeatureLayer.setVisible(false); // initially hide since large feature sizes
        map.addLayer(savedFeatureLayer);
      }

      return () => {
        map.setTarget(undefined);
      };
    }, [
      // fetchedMapData,
      transformFunction,
      vectorLayer,
      selectedLand,
      savedFeatures,
    ]);

    useEffect(() => {
      const onRenderComplete = () => {
        // set extent to current land and add marker in center of extent
        if (
          (view &&
            selectedTab === "selectedLand" &&
            !mapLoading &&
            selectedLand &&
            selectedLand.length > 0) ||
          (selectedTab === "land" &&
            status === "succeeded" &&
            landLayers &&
            landLayers.length > 0)
        ) {
          const extent =
            selectedTab === "land"
              ? firstFeature?.getGeometry()?.getExtent()
              : Object.values(lastFeature)?.[0]?.getGeometry()?.getExtent();
          if (extent) {
            const centerLon = (extent[0] + extent[2]) / 2;
            const centerLat = (extent[1] + extent[3]) / 2;
            const centerCoordinates = transform(
              [centerLon, centerLat],
              targetCRS,
              targetCRS
            );
            if (selectedTab === "selectedLand" && markerRef.current) {
              const markerFeature = new Feature({
                geometry: new Point(centerCoordinates),
                name: "Marker",
              });
              markerFeature.setStyle(markerStyle);
              markerRef.current = markerFeature;
              markers?.getSource()?.addFeature(markerFeature);
              map.addLayer(markers);
            }
            map
              .getView()
              .fit(extent, { padding: [50, 50, 50, 50], duration: 2000 });
            if (selectedTab === "land") {
              const targetZoom = 10;
              setTimeout(() => {
                if (map.getView().getZoom()) {
                  view.setZoom(targetZoom);
                  dispatch(fetchComplete(true));
                }
              }, 2000); // Wait for the `fit` animation to complete
            }
          }
        }
        setTimeout(() => {
          dispatch(setLoadingState(false));
        }, 3000);
      };

      map.once("rendercomplete", onRenderComplete);

      // Cleanup function
      return () => {
        map.un("rendercomplete", onRenderComplete);
      };
    }, [
      map,
      view,
      selectedLand,
      landLayers,
      firstFeature,
      lastFeature,
      markerStyle,
      markerRef,
      markers,
      dispatch,
      mapLoading,
      status,
      selectedTab,
    ]);

    // Step 2: Add a click event listener
    map.on("singleclick", (evt) => {
      if (store.getState().draw.selectedDrawOption === null) {
        map!.forEachFeatureAtPixel(evt.pixel, (feature) => {
          // Step 3: Retrieve and display feature information
          const properties = feature.getProperties();
          const { geometry, ...otherProperties } = properties;
          if (!isEmpty(otherProperties)) {
            showFeatureInfo(overlayRef, otherProperties, [
              evt.pixel[0],
              evt.pixel[1],
            ]);
          } else {
            showNoFeatureInfo(overlayRef, [evt.pixel[0], evt.pixel[1]]);
          }
          //  console.log(JSON.stringify(otherProperties, null, 2));
          return true;
        });
      }
    });

    const handleZoom = () => {
      map.getView().animate({
        zoom: store.getState().mapFeature.mapZoom, //map.getView().getZoom()! + 1,
        duration: 250, // Animation duration in milliseconds
      });
    };

    const handleUserLocation = (tracking: boolean) => {
      const state = store.getState();
      const userCoordinates = state.mapFeature.userCoordinate;
      const mapZoom = state.mapFeature.mapZoom;
      const accuracy = state.mapFeature.accuracy;

      if (!userCoordinates || userCoordinates.length !== 2) {
        console.error("Invalid user coordinates:", userCoordinates);
        return;
      }

      const transformedCoords = transform(
        userCoordinates,
        "EPSG:4326",
        "EPSG:3857"
      );

      userPositionSource.clear();

      const accuracyCircle = new Circle(transformedCoords, accuracy);
      const accuracyFeature = new Feature({
        geometry: accuracyCircle,
      });

      const accuracyStyle = getAccuracyStyle(accuracy);
      if (accuracyStyle) {
        accuracyFeature.setStyle(accuracyStyle);
      }
      userPositionSource.addFeature(accuracyFeature);

      const userPointFeature = new Feature({
        geometry: new Point(transformedCoords),
        iconType: "position_marker_gi",
        id: uuidv4(),
      });
      const iconColor = tracking ? "green" : "red";
      const style = getFeatureStyle("position_marker_gi", iconColor, "32px");
      if (style) {
        userPointFeature.setStyle(style);
      }
      userPositionSource.addFeature(userPointFeature);

      map.getView().setCenter(transformedCoords);
      map.getView().animate({
        zoom: mapZoom || 18,
        duration: 3000,
      });
    };

    const toggleBaseLayer = (layerName: string) => {
      toporasterLayer.setVisible(layerName === "toporaster");
      sjokartrasterLayer.setVisible(layerName === "sjokartraster");
      topoLayer.setVisible(layerName === "topo");
      topograatoneLayer.setVisible(layerName === "topograatone");
      osmLayer.setVisible(layerName === "osm");
    };

    /////////////////////////////////
    // useEffect(() => {
    const layerSelection = () => {
      const layerInfo = store.getState().selectedLayer.layerInfo;
      if (layerInfo.layerName) {
        const layers = map.getLayers().getArray();
        const targetLayers = layers.filter(
          (layer) => layer.get("Matrikkelnummertekst") === layerInfo.layerName
        ) as [VectorLayer<VectorSource>];

        if (targetLayers) {
          targetLayers.forEach((targetLayer) => {
            if (layerInfo.isClicked) {
              targetLayer.setStyle(fillHighlightedStyle);
              const source = targetLayer.getSource();
              const extent = source?.getExtent();
              if (extent)
                map.getView().fit(extent, { size: map.getSize(), maxZoom: 16 });
            } else {
              if (layerInfo.isMouseEnter) {
                // Implement highlight code
                targetLayer.setStyle(fillHighlightedStyle);
              } else {
                // Implement remove highlight code
                targetLayer.setStyle(fillStyle);
              }
            }
          });
        } else {
          console.error("Layer not found");
        }
      }
    };
    // }, [layerInfo]);

    const markerRemove = () => {
      const layerInfo = store.getState().selectedLayer.layerInfo;
      if (layerInfo.layerName) {
        const markerToRemove = lastFeature[layerInfo.layerName];
        if (markerToRemove) {
          const markerSource = markers.getSource();
          markerSource?.removeFeature(markerToRemove); // Remove the specific marker
          delete lastFeature[layerInfo.layerName];
          markerSource?.changed(); // Force a refresh of the source
        }
      }
    };
    // const removeLayer = () => {
    //   const layerInfo = store.getState().selectedLayer.layerInfo;

    //   if (layerInfo?.layerName) {
    //     const layers = map.getLayers().getArray();
    //     const targetLayers = layers.filter(
    //       (layer) => layer.get("Matrikkelnummertekst") === layerInfo.layerName
    //     ) as [VectorLayer<VectorSource>];

    //     if (targetLayers && targetLayers.length > 0) {
    //       targetLayers.forEach((targetLayer) => {
    //         map.removeLayer(targetLayer); // Remove the layer from the map
    //       });
    //       console.log(`Layer ${layerInfo.layerName} removed successfully.`);
    //     } else {
    //       console.error("Layer not found for removal.");
    //     }
    //   } else {
    //     console.error("Invalid layer information provided for removal.");
    //   }
    // };

    const unitLayerSelection = () => {
      const layerInfo = store.getState().selectedLayer.layerInfo;
      console.log(layerInfo, "layerInfo.layerName");
      if (layerInfo.layerName) {
        const layers = map.getLayers().getArray();
        const targetLayers = layers.filter(
          (layer) => layer.get("LandId") === Number(layerInfo.layerName)
        ) as [VectorLayer<VectorSource>];
        console.log(targetLayers, "targetLayers");
        if (targetLayers) {
          targetLayers.forEach((targetLayer) => {
            if (layerInfo.isClicked) {
              targetLayer.setStyle(fillHighlightedStyle);
              const source = targetLayer.getSource();
              const extent = source?.getExtent();
              if (extent)
                map.getView().fit(extent, { size: map.getSize(), maxZoom: 16 });
            } else {
              if (layerInfo.isMouseEnter) {
                // Implement highlight code
                targetLayer.setStyle(fillHighlightedStyle);
              } else {
                // Implement remove highlight code
                targetLayer.setStyle(fillStyle);
              }
            }
          });
        } else {
          console.error("Layer not found");
        }
      }
    };

    // const focusLayers = (layerId: string): void => {
    //   const layers = map.getLayers().getArray();
    //   const targetLayer = layers.find(
    //     (layer) => layer.get("Matrikkelnummertekst") === layerId
    //   ) as VectorLayer<VectorSource>;

    //   if (targetLayer) {
    //     const source = targetLayer.getSource();
    //     const extent = source.getExtent();
    //     map.getView().fit(extent, { size: map.getSize(), maxZoom: 16 });
    //   } else {
    //     console.error("Layer not found");
    //   }
    // };

    // const focusLayer = () => {
    //   // event.preventDefault(); // Prevent default button behavior
    //   const layer = "28/3,13,30"; // Your layer value
    //   focusLayers(layer);
    // };
    /////////////////////////////////////////

    const mapToolToggles = (height: number) => {
      if (mapToolRef.current) {
        const displayOption = height > 80 ? "none" : "";
        mapToolRef.current.style.display = displayOption;
        //   const isSidebarVisible = store.getState().sideBar.isSidebarVisible;
        if (window.innerWidth > 1280) {
          const isSidebarVisible = height > 80 ? false : true;
          dispatch(setSideBarVisibility(isSidebarVisible));
        } else {
          dispatch(setSideBarVisibility(false));
        }
      }
    };

    // const tooltipClose = () => {
    //   mouseOut = true;
    //   map.removeInteraction(selectDrawnFeatures);
    //   map.removeInteraction(draw);
    //   if (helpTooltipElement) {
    //     helpTooltipElement.classList.add("hidden");
    //   }
    //   console.log("close draw modal mapwrapper hidden tooltip");
    // };

    useImperativeHandle(ref, () => ({
      PrintMap(arg: PrintInfo) {
        // Handle the print map logic here
        console.log("Handling print map in mapwrapper:", arg.title);
      },
      DownloadMap(arg: PrintInfo) {
        // Handle the print map logic here
        console.log("Handling download map in mapwrapper:", arg.title);
      },
      CancelDownloadMap() {
        // Handle the print map logic here
        console.log("Handling Cancel Download Map mapwrapper");
      },
      mapToolToggle: (height: number) => {
        mapToolToggles(height);
      },
      mapLayerChange: () => {
        layerSelection();
      },
      mapMarkerRemove: () => {
        markerRemove();
      },
      mapUnitLayerChange: () => {
        unitLayerSelection();
      },
      // TooltipClose: () => {
      //   tooltipClose();
      // },
    }));

    useEffect(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let offsetX = 0;
      let offsetY = 0;

      const handleMouseDown = (e: MouseEvent) => {
        if (e.target && (e.target as HTMLElement).closest(".cursor-grab")) {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = overlay.getBoundingClientRect();
          offsetX = startX - rect.left;
          offsetY = startY - rect.top;
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const sidebarWidth = store.getState().sideBar.isSidebarVisible
            ? 18 * 16
            : 0; // 18rem in pixels (1rem = 16px)
          const topbarHeight = 3 * 16; // 3rem in pixels (1rem = 16px)
          overlay.style.left = `${e.clientX - sidebarWidth - offsetX}px`;
          overlay.style.top = `${e.clientY - topbarHeight - offsetY}px`;
        }
      };

      const handleMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      overlay.addEventListener("mousedown", handleMouseDown);
      return () => {
        overlay.removeEventListener("mousedown", handleMouseDown);
      };
    }, []);

    return (
      <>
        <div id="popup" ref={popupRef} className={`${styles.popup} hidden`}>
          <a href="#" ref={closerRef} className={styles.popupCloser}></a>
          <div id="popup-content"></div>
        </div>
        <div
          ref={overlayRef}
          className="absolute cursor-grab bg-white shadow-lg px-4 pb-4 rounded-lg max-w-xs hidden  dark:bg-gray-700 z-[9]"
        ></div>
        <div id="map" ref={mapRef} className={`${styles.map} relative`}>
          <div ref={mapToolRef}>
            <div
              className={`button-container  items-center  flex flex-col gap-2 absolute top-16 left-1 shadow-lg p-1 border-red-800  z-10`}
            >
              <UserLocate setUserLocation={handleUserLocation} />
              <ZoomIn setZoom={handleZoom} />
              <ZoomOut setZoom={handleZoom} />
              {status === "loading" && (
                <SpinnerMini width={"w-8"} height={"h-8"} padding={"p-[4px]"} />
              )}
            </div>
            <div className="items-center flex flex-row gap-1 absolute bottom-24 right-1  justify-center bg-gray-100 bg-opacity-30 shadow-lg z-10">
              <CoordinateDisplay />
            </div>
            <div className="items-center flex flex-row gap-1 absolute bottom-4 right-1  justify-center bg-gray-100 bg-opacity-20 p-0.5 shadow-2xl z-10">
              <LayerSelection toggleBaseLayer={toggleBaseLayer} />
            </div>
          </div>
          {/* <div className="absolute  left-2 bottom-10 z-10">
          <button onClick={focusLayer}>xxx</button>
        </div> */}
        </div>
      </>
    );
  })
);

export default MapWrapper as React.FC<
  MapWrapperProps & React.RefAttributes<MapWrapperRef>
>;
