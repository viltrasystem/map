import axios, { AxiosError } from "axios";
import { LandSelectorFormInputs } from "../lib/types";
import apiClient from "./apiClient";

const selectedLandApi = {
  loadLand: async (selectedLand: LandSelectorFormInputs) => {
    try {
      return await apiClient.post("/map/selectedMap", {
        Municipality: selectedLand.municipality.substring(
          selectedLand.municipality.length - 4
        ),
        LandId: selectedLand.landId,
        MainNo: selectedLand.mainNo,
        SubNo: selectedLand.subNo,
        PlotNo: selectedLand.plotNo ?? null,
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

export default selectedLandApi;

// import { ITeig, LandSelectorFormInputs } from "../lib/types";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL; });

// export const selectedLandApi = createApi({
//   reducerPath: "selectedLandApi",
//   baseQuery,
//   endpoints: (builder) => ({
//     getSelectedLand: builder.query<ITeig[], LandSelectorFormInputs>({
//       query: ({ municipality, mainNo, subNo }) =>
//         `map/selectedMap?municipilityNo=${municipality}&MainNo=${mainNo}&subNo=${subNo}`,
//     }),
//   }),
// });

// export const { useGetSelectedLandQuery } = selectedLandApi;
