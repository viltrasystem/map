import axios, { AxiosError } from "axios";
import apiClient from "./apiClient";
import { OwnedLand } from "../lib/types";

const unitLandLayerApi = {
  loadUnitLandLayers: async (unitId: number) => {
    try {
      return await apiClient.get("/map/unitlandlayers", {
        params: {
          unitId: unitId,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  loadUnitOwnersLandLayers: async (ownedLand: OwnedLand) => {
    try {
      return await apiClient.get("/map/unitownerslandlayers", {
        params: {
          unitId: ownedLand.unitId,
          ownerUId: ownedLand.userId,
          isDnnId: ownedLand.isDnnId,
          isLandTab: ownedLand.isLandTab,
        },
      });
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
