import { RootState } from "../app/store";
import { UserUnit } from "../slices/userUnitSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserUnitQueryParams {
  dnnUserId: number;
  isAdmin: boolean;
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
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const userUnitApi = createApi({
  reducerPath: "userUnitApi",
  baseQuery,
  endpoints: (builder) => ({
    getUserUnits: builder.query<UserUnit[], UserUnitQueryParams>({
      query: ({ dnnUserId, isAdmin }) =>
        `Main/userunit?dnnUserId=${dnnUserId}&isAdmin=${isAdmin}`,
    }),
  }),
});

export const { useGetUserUnitsQuery } = userUnitApi;
export default userUnitApi;
