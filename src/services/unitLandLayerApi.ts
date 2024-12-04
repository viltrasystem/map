import axios, { AxiosError } from "axios";
import apiClient from "./apiClient";

const unitLandLayerApi = {
  loadUnitLandLayers: async (unitId: number) => {
    try {
      return await apiClient.post("/map/unitlandlayers", unitId);
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

export default unitLandLayerApi;
