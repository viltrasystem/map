import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { getSvgIconString } from "../utility/iconMapping";
import { Fill, Stroke } from "ol/style";

/**
 * Generates an OpenLayers feature style dynamically.
 * @param iconType
 * @param color
 * @param size
 * @returns An OpenLayers Style object or null if the icon type is invalid.
 */
export const getFeatureStyle = (
  iconType: string,
  color: string,
  size: string
): Style | null => {
  const svgString = getSvgIconString(iconType, color, size);

  if (!svgString) {
    console.error(`Failed to generate style for icon type "${iconType}".`);
    return null;
  }

  return new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
      scale: 1,
    }),
  });
};

/**
 * Style for accuracy feature.
 * @param accuracy The accuracy in meters.
 * @returns OpenLayers Style object.
 */
export const getAccuracyStyle = (accuracy: number) => {
  let opacity;
  let strokeColor = "blue";
  let fillColor = "rgba(0, 0, 255, 0.3)";

  if (accuracy < 10) {
    opacity = 0.6;
    fillColor = `rgba(0, 255, 0, ${opacity})`;
    strokeColor = "green";
  } else if (accuracy < 25) {
    opacity = 0.5;
    fillColor = `rgba(0, 0, 255, ${opacity})`;
    strokeColor = "cyan";
  } else if (accuracy < 50) {
    opacity = 0.5;
    fillColor = `rgba(255, 255, 0, ${opacity})`;
    strokeColor = "yellow";
  } else {
    opacity = 0.3;
    fillColor = `rgba(255, 0, 0, ${opacity})`;
    strokeColor = "red";
  }

  return new Style({
    fill: new Fill({
      color: fillColor,
    }),
    stroke: new Stroke({
      color: strokeColor,
      width: 2,
    }),
  });
};
