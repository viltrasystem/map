import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponse, RefreshRequest } from "../lib/types";
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

export const refreshApi = createApi({
  reducerPath: "refreshApi",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    refreshToken: builder.mutation<LoginResponse, RefreshRequest>({
      query: (loginRequest) => ({
        url: "/auth/refresh",
        method: "POST",
        body: loginRequest,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useRefreshTokenMutation } = refreshApi;

export default refreshApi;
// Background interval to refresh token every 15 minutes
//const refreshInterval = 1 * 60 * 1000; // 15 minutes in milliseconds

// setInterval(() => {
//   refreshApi.endpoints.refreshToken.initiate;
// }, refreshInterval);
