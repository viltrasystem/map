// *** not used
import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { IEiendomsgrense, IHoydekurveData } from "../lib/types";
import { RootState } from "../app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : import.meta.env.MODE === "production"
    ? "https://test.viltrapporten.no/api/v1"
    : "https://localhost:7144/api/v1", // Backend API URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseMapApi = createApi({
  reducerPath: "baseMapApi",
  baseQuery,
  endpoints: (builder) => ({
    getBaseMap: builder.query<IHoydekurveData, void>({
      query: () => `map/basemap`,
    }),
  }),
});

export const { useGetBaseMapQuery } = baseMapApi;

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery,
  endpoints: (builder) => ({
    getMap: builder.query<IEiendomsgrense, void>({
      query: () => `map/map`,
    }),
  }),
});

export const { useGetMapQuery } = mapApi;

const customBaseQuery = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  const result = await fetchBaseQuery({
    baseUrl: "https://wfs.geonorge.no/skwms1/wfs.administrative_enheter?",
  })(args, api, extraOptions);

  if (result.error) {
    console.error("Request failed", result.error);
  }

  return result;
};

export const wfsApi = createApi({
  reducerPath: "wfsApi",
  baseQuery: customBaseQuery, // Using the custom base query
  endpoints: (builder) => ({
    getWfsLayer: builder.query<string, void>({
      query: () =>
        `service=WFS&request=GetFeature&service=WFS&version=2.0.0&typename=app:Kommune&srsname=EPSG:4326&bbox=-10.126953125,50.338134765625,30.126953125,74.661865234375,EPSG:4326`,
      transformResponse: (response: Response) => response.text(),
    }),
  }),
});

export const { useGetWfsLayerQuery } = wfsApi;

export default baseMapApi;

// const xmlResponseHandler = (response) => {
//   if (response.status === 200) {
//     return response.data; // Assuming XML data is directly in the response.data
//   } else {
//     throw new Error("Failed to fetch XML data");
//   }
// };
