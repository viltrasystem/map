import axios, { AxiosError } from "axios";
import { FeatureData } from "../lib/types";
import apiClient from "./apiClient";

const mapDrawnFeaturesApi = {
  saveDrawnFeatures: async (geojsonString: string) => {
    try {
      console.log(
        "Sending GeoJSON to API:",
        JSON.stringify(geojsonString, null, 2)
      );
      console.log(geojsonString, "apigeojson");
      return await apiClient.post<FeatureData[]>(
        "/map/savedrawnfeatures",
        geojsonString
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  fetchDrawnFeatures: async () => {
    try {
      const response = await apiClient.get("/map/features");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
};

export default mapDrawnFeaturesApi;
