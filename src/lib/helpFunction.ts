import { Feature } from "ol";

import { LineString, Polygon } from "ol/geom";
import { getArea, getLength } from "ol/sphere";
import { Style } from "ol/style";
import { ToastOptions } from "react-toastify";
import { Extent, getCenter } from "ol/extent";
import { Row } from "./types";
import authApiClient from "../services/authApiClient";
import axios, { AxiosError } from "axios";

export const formatLength = function (line: LineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

export const formatArea = function (polygon: Polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};
export type colorType =
  | "black"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "cyan"
  | "magenta";
export const colorToHex = (color: string, opacity: number): string => {
  const colors = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 255, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    cyan: [0, 255, 255],
    magenta: [255, 0, 255],
  };

  if (!colors[color as colorType]) {
    throw new Error("Color not recognized");
  }

  const rgb = colors[color as colorType];
  const hex = rgb.map((value) => value.toString(16).padStart(2, "0")).join("");
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${hex}${alpha}`;
};

export const isEmpty = (
  obj: Record<string, any> | null | undefined
): boolean => {
  if (obj == null) return true; // Check for null or undefined
  return Object.keys(obj).length === 0;
};

export const getToastOptions = (): ToastOptions => {
  return {
    position: "top-center",
    autoClose: 5000, // Corrected option name
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      fontSize: "12px",
      width: "600px",
      padding: "4px 6px",
      fontWeight: "500",
      minHeight: "30px",
      lineHeight: "0.7",
      //backgroundColor: "black",
      //color: "white",
      transform: "translate(-50%, -50%)",
    },
    progress: undefined, // Custom progress bar value (0 to 1)
    // type: "default", // Type of toast: 'info', 'success', 'warning', 'error', 'default' **
    onClose: () => {}, // Callback when the toast closes
    onOpen: () => {}, // Callback when the toast opens
    closeButton: true, // Display the close button (can be a custom React component)
    // render: "Custom Content", // Custom content for the toast (can be a React component)
    // className: "custom-toast-class", // Custom CSS class for the toast
    // bodyClassName: "custom-body-class", // Custom CSS class for the body
    // toastId: "custom-id", // Custom ID for the toast
    // transition: "Slide", // Transition effect: 'Slide', 'Zoom', 'Flip', 'Bounce' **
    //icon: "🔔", // Custom icon (can be a React component)
    // containerId: "custom-container", // ID of the container to display the toast
    // theme: "dark", // Theme: 'light', 'dark', 'colored'
  };
};

// #region drawing style defined

// #endregion

export const extractStyle = (feature: Feature): object | null => {
  const style = feature.getStyle() as Style;
  if (!style) {
    return null;
  }

  // Extract style properties
  const fillColor = style.getFill()?.getColor();
  const strokeColor = style.getStroke()?.getColor();
  const strokeWidth = style.getStroke()?.getWidth();
  const text = style.getText()?.getText();
  const textColor = style.getText()?.getFill()?.getColor();
  const textFont = style.getText()?.getFont();

  return {
    fillColor,
    strokeColor,
    strokeWidth,
    text,
    textColor,
    textFont,
  };
};

export const adjustCenter = (extent: Extent, dx = 0, dy = 0) => {
  const center = getCenter(extent);
  // Adjust the center point
  const adjustedCenter = [center[0] + dx, center[1] + dy];
  return adjustedCenter;
};

type DrawOption =
  | "Point"
  | "LineString"
  | "Polygon"
  | "Text"
  | "Edit"
  | "Delete"; ///////////////////////////

export const isValidDrawOption = (option: any): option is DrawOption => {
  return option === "Point" || option === "LineString" || option === "Polygon";
};

export const isValidDrawFeature = (option: any): option is DrawOption => {
  return (
    option === "Point" ||
    option === "LineString" ||
    option === "Polygon" ||
    option === "Text" ||
    option === "Edit" ||
    option === "Delete"
  );
};

export const showNoFeatureInfo = (
  overlayRef: React.MutableRefObject<HTMLDivElement | null>,
  pixel: [number, number]
) => {
  if (overlayRef.current) {
    const [x, y] = pixel;
    overlayRef.current.style.display = "block";
    overlayRef.current.style.left = `${x}px`;
    overlayRef.current.style.top = `${y}px`;
    overlayRef.current.innerHTML = `<div class="flex flex-row items-center justify-between p-1 border-b rounded-t dark:border-gray-600">
    <h6 class="font-semibold text-gray-900 dark:text-white">Feature Information</h6>
   <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                   <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                  </svg>
                </button>
</div>
<span class="mb-1 text-[12px] text-sm leading-relaxed text-gray-500 dark:text-gray-400 pt-2">no information awailable
     </span>   
      `;
    overlayRef.current
      .querySelector("button")!
      .addEventListener("click", () => {
        overlayRef.current!.style.display = "none";
      });
  }
};

export const showFeatureInfo = (
  overlayRef: React.MutableRefObject<HTMLDivElement | null>,
  info: any,
  pixel: [number, number]
) => {
  if (overlayRef.current) {
    const [x, y] = pixel;
    overlayRef.current.style.display = "block";
    overlayRef.current.style.left = `${x}px`;
    overlayRef.current.style.top = `${y}px`;
    overlayRef.current.innerHTML = `<div class="flex flex-row items-center justify-between p-1 border-b rounded-t dark:border-gray-600">
    <h6 class="font-semibold text-gray-900 dark:text-white">Feature Information</h6>
   <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                   <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                  </svg>
                </button>
</div>
        <ul class="text-sm leading-relaxed text-gray-500 dark:text-gray-400 pt-2">
          ${Object.entries(info)
            .map(
              ([key, value]) =>
                `<li class="mb-1 text-[12px]"><strong>${key}: </strong>${
                  value ? value.toString() : "N/A"
                }</li>`
            )
            .join("")}
        </ul>
        
      `;
    overlayRef.current
      .querySelector("button")!
      .addEventListener("click", () => {
        overlayRef.current!.style.display = "none";
      });
  }
};

export const LocalizeNumber = (val: string, language: string): string => {
  let strVal: string = Number(val).toFixed(2);
  if (language.toLowerCase() === "nb-no") {
    strVal = strVal.replace(/\./, ",");
  }
  return strVal;
};

export const wordExistsInUri = (word: string) => {
  const url = window.location.href;
  return url.includes(word);
};

// export function formatNumberByLocale(value: number, locale: string) {
//   return new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).format(
//     value
//   );
// }

export function parseInput(value: string, locale: string): number {
  const separator = locale === "nb-NO" ? "," : ".";
  const formattedValue = value
    .toString()
    .replace(separator === "," ? "," : ".", ".");
  console.log(formattedValue, value, parseFloat(formattedValue), "parseInput");
  return parseFloat(formattedValue);
}

export const parseLocalizedNumber = (value: string, locale: string): number => {
  if (value !== "0" && parseInt(value) !== 0 && value !== undefined) {
    const exampleNumber = 1234.56;
    const formattedNumber = formatNumberForLocale(exampleNumber, locale);

    // Create regex based on the localized format of the decimal and thousand separators
    const decimalSeparator = formattedNumber.includes(",") ? "," : ".";
    const thousandSeparator = decimalSeparator === "." ? "," : "\\s";
    console.log(
      value,
      locale,
      formattedNumber,
      decimalSeparator,
      thousandSeparator,
      "value value value"
    );

    // Replace thousand separators and convert decimal format to plain number
    const normalizedValue = value
      ?.toString()
      .replace(new RegExp(`[${thousandSeparator}]`, "g"), "") // Handle any space or comma
      .replace(decimalSeparator, ".");
    console.log(
      value,
      locale,
      formattedNumber,
      decimalSeparator,
      thousandSeparator,
      normalizedValue,
      parseFloat(normalizedValue),
      "end end end"
    );

    return parseFloat(normalizedValue);
  } else {
    console.log(value, "else else else");
    return parseFloat(value);
  }
};

export const formatNumberForLocale = (
  value: number,
  locale: string
): string => {
  // Use Intl.NumberFormat to format number according to the specified locale
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2, // You can change this based on your needs
    maximumFractionDigits: 2,
  }).format(value);
};

export const parseEnglishNumber = (value: string): number => {
  // Remove commas (thousands separators) and replace period (.) with the decimal point
  const normalizedValue = value.toString().replace(/,/g, "").replace(".", ".");
  return parseFloat(normalizedValue);
};

// export const formatNumberForLocale = (value: number, locale: string) => {
//   return new Intl.NumberFormat(locale).format(value);
// };

/////////////////////////////////////////////////////
// Function to format number as per locale
export type LocaleKey = "en-US" | "nb-NO";

export const localeFormats: Record<
  LocaleKey,
  { locale: string; thousandSeparator: string; decimalSeparator: string }
> = {
  "en-US": { locale: "en-US", thousandSeparator: ",", decimalSeparator: "." },
  "nb-NO": { locale: "no-NO", thousandSeparator: "//s", decimalSeparator: "," },
};

// export const localeFormats = {
//   "en-US": { locale: "en-US", thousandSeparator: ",", decimalSeparator: "." },
//   "nb-NO": {
//     locale: "no-NO",
//     thousandSeparator: "//s",
//     decimalSeparator: ",",
//   },
// };

export const formatNumber = (value: string, locale: string) => {
  const normalizedValue =
    typeof value === "string"
      ? value.replace(/\s/g, "").replace(",", ".")
      : value;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(parseFloat(normalizedValue));
};

export const formatInteger = (value: string, locale: string) => {
  const normalizedValue =
    typeof value === "string"
      ? value.replace(/\s/g, "").replace(",", ".")
      : value;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(parseFloat(normalizedValue));
};

export const formatFloat = (value: string, locale: string) => {
  const normalizedValue =
    typeof value === "string"
      ? value.replace(/\s/g, "").replace(",", ".")
      : value;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(parseFloat(normalizedValue));
};

export const parseFormattedNumber = (
  formattedValue: string,
  decimalSeparator: string,
  locale: string
) => {
  // Remove thousand separators
  const rawValue = formattedValue
    .toString()
    .replace(
      new RegExp(
        `[${localeFormats[locale as LocaleKey].thousandSeparator}]`,
        "g"
      ),
      ""
    );
  // Replace the locale-specific decimal separator with a dot (.)
  return rawValue.replace(decimalSeparator, ".");
};

export const normalizedValue = (value: string): string => {
  const normalizedValue =
    typeof value === "string"
      ? value.replace(/\s/g, "").replace(",", ".")
      : value;
  return normalizedValue;
};

export const generateData = (numRows: number): Row[] => {
  return Array.from({ length: numRows }, (_, i) => ({
    id: i + 1,
    value: `Row ${i + 1}`,
    subRows: Array.from({ length: 3 }, (_, j) => ({
      id: j + 1,
      value: `SubRow ${i + 1}.${j + 1}`,
      subValue: `SubRow ${i + 1}.${j + 1}`,
      subSubRows: Array.from({ length: 2 }, (_, k) => ({
        id: k + 1,
        subSubValue: `SubSubRow ${i + 1}.${j + 1}.${k + 1}`,
      })),
    })),
  }));
};

export const getIpAddress = async (): Promise<string | null> => {
  let ipAddress: string | null = null;
  try {
    const response = await authApiClient.get(
      "https://api.ipify.org/?format=json"
    );
    ipAddress = response.data.ip;
    return ipAddress;
  } catch (error) {
    console.error(
      "First IP fetch method failed, trying the second method",
      error
    );

    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      ipAddress = data.ip;
      return ipAddress;
    } catch (error) {
      console.error("Second IP fetch method also failed", error);
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("Failed to retrieve IP address");
      }
    }
  }
};

export const getMapUrl = (): string => {
  return import.meta.env.MODE === "production"
    ? "https://test.viltrapporten.no"
    : "http://217.182.198.16:8080";
};

export const GeoJsonToFeatureConverter = (
  mapGeoJson: string | null
): any[] | null => {
  if (!mapGeoJson) {
    return null;
  }

  const list: any[] = [];
  try {
    const parsedGeoJson = JSON.parse(mapGeoJson);
    if (parsedGeoJson && parsedGeoJson.features) {
      parsedGeoJson.features.forEach((landFeature: any) => {
        const feature = {
          features: [landFeature],
          type: "FeatureCollection",
        };
        list.push(feature);
      });
    }
  } catch (e) {
    console.error("Invalid MapGeoJson format", e);
    // Return null in case of JSON parsing errors
    return null;
  }

  return list;
};
