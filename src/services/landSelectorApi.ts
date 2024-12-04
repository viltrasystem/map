import { RootState } from "../app/store";
import { Municipality } from "../lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const landSelectorApi = createApi({
  reducerPath: "landSelectorApi",
  baseQuery,
  tagTypes: ["Municipality"],
  endpoints: (builder) => ({
    getMunicipalityList: builder.query<Municipality[], void>({
      query: () => `land/municipality`,
      providesTags: ["Municipality"],
      keepUnusedDataFor: 3600, // 5 minutes in seconds (similar to gcTime)
    }),
  }),
});

export const { useGetMunicipalityListQuery } = landSelectorApi;
export default landSelectorApi;
