// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { NodeData } from "../lib/types";

// export interface UnitChildQueryParams {
//   parentId: number;
//   isUserOnlyOnMunicipality: boolean;
//   isGuest: boolean;
// }
// const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL; });

// export const unitTreeApi = createApi({
//   reducerPath: "treeApi",
//   baseQuery,
//   endpoints: (builder) => ({
//     getUnitChilds: builder.query<NodeData[], UnitChildQueryParams>({
//       query: ({ parentId, isUserOnlyOnMunicipality, isGuest }) =>
//         `Main/ChildNode?parentId=${parentId}&isUserOnlyOnMunicipality=${isUserOnlyOnMunicipality}&isGuest=${isGuest}`,
//     }),
//   }),
// });

// export const { useGetUnitChildsQuery } = unitTreeApi;
// export default unitTreeApi;

import axios, { AxiosError } from "axios";
import { NodeData } from "../lib/types";
import { UserUnit } from "../slices/userUnitSlice";
import apiClient from "./apiClient";

export interface UnitChildQueryParams {
  parentId: number;
  isUserOnlyOnMunicipality: boolean;
  isGuest: boolean;
}

export interface UserUnitQueryParams {
  dnnUserId: number;
  isAdmin: boolean;
}

const treeUnitApi = {
  userUnit: async (userUnitReq: UserUnitQueryParams): Promise<UserUnit[]> => {
    try {
      const response = await apiClient.get<UserUnit[]>(`Main/userunit`, {
        params: {
          dnnUserId: userUnitReq.dnnUserId,
          isAdmin: userUnitReq.isAdmin,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw error;
      }
    }
  },
  unitChildNode: async (
    childReq: UnitChildQueryParams
  ): Promise<NodeData[]> => {
    try {
      const response = await apiClient.get<NodeData[]>(`Main/ChildNode`, {
        params: {
          parentId: childReq.parentId,
          isUserOnlyOnMunicipality: childReq.isUserOnlyOnMunicipality,
          isGuest: childReq.isGuest,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw error;
      }
    }
  },
};

export default treeUnitApi;
