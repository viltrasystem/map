// slices/sosiSlice.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import GeoJSON from "ol/format/GeoJSON";

export const loadSosiFile = createAsyncThunk(
  "sosi/loadSosiFile",
  async (filePath: string) => {
    try {
      //   const response = await apiClient.get(
      //     "/assets/sosi/3423_25832_AR250_SOSI.SOS"
      //   //   );
      //   const response = await fetch("/assets/sosi/3423_25832_AR250_SOSI.SOS");
      //   if (!response.ok) {
      //     throw new Error("Failed to load SOSI file");
      //   }
      //   const sosiData = await response.json();
      //   return sosiData;
      console.log(filePath);
      const response = await fetch("/assets/sosi/3423_25832_AR250_SOSI.SOS", {
        headers: new Headers({
          "Content-Type": "application/octet-stream",
        }),
      }); // Replace with your actual path
      const sosiData = await response.text();

      // Process the SOSI data (e.g., convert to GeoJSON)
      const geoJSONFormat = new GeoJSON();
      const geoJSONFeatures = geoJSONFormat.readFeatures(sosiData);

      // Return the processed data (e.g., GeoJSON features)
      return geoJSONFeatures;
    } catch (error) {
      throw Error("Failed to load SOSI file");
    }
  }
);
