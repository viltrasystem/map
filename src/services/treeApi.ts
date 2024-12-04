import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NodeData } from "../lib/types";
import { RootState } from "../app/store";

export interface ChildUnitQueryParams {
  parentId: number;
  isUserOnlyOnMunicipality: boolean;
  isGuest: boolean;
}
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
    return headers;
  },
});

export const treeApi = createApi({
  reducerPath: "treeApi",
  baseQuery,
  endpoints: (builder) => ({
    getChildUnits: builder.query<NodeData[], ChildUnitQueryParams>({
      query: ({ parentId, isUserOnlyOnMunicipality, isGuest }) =>
        `Main/ChildNode?parentId=${parentId}&isUserOnlyOnMunicipality=${isUserOnlyOnMunicipality}&isGuest=${isGuest}`,
    }),
  }),
});

export const { useGetChildUnitsQuery } = treeApi;
export default treeApi;
