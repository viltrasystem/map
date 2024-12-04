import { createAsyncThunk } from "@reduxjs/toolkit";
import landApi from "../services/landApi";
import { setLoadingState } from "../slices/loadingSlice";
import {
  LandOwnersObj,
  OwnedLand,
  SharedLand,
} from "../slices/landOwnersSlice";
import { ApiResponse } from "../lib/types";
import axios from "axios";
// Action type constants
const LANDOWNERS = "LANDOWNERS";

export const landOwners = createAsyncThunk(
  LANDOWNERS,
  async (landReq: OwnedLand, { rejectWithValue, dispatch }) => {
    try {
      const response = await landApi.landOwners(landReq.unitId);
      // if (response.status === 204) {
      //   return { noContent: true };
      // }
      //   const currentRowsHeight =
      //     response.data?.LandInformations != null
      //       ? 4 + response.data?.LandInformations.length * 10
      //       : 0;
      //   const initialHeight = currentRowsHeight > 20 ? 20 : currentRowsHeight;
      dispatch(setLoadingState(false));
      return { data: response as LandOwnersObj, locale: landReq.locale };
    } catch (error) {
      dispatch(setLoadingState(false));
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiResponse;
        return rejectWithValue({
          message: apiError?.Message || error.message,
          statusCode: apiError?.StatusCode || 500,
        });
      } else if (error instanceof Error) {
        return rejectWithValue({
          message: error.message,
          statusCode: 500,
        });
      } else {
        return rejectWithValue({
          message: "An unexpected error occurred",
          statusCode: 500,
        });
      }
    }
  }
);

// export const ownersLand = createAsyncThunk(
//   LANDOWNERS,
//   async (ownedLand: OwnedLand, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await landApi.ownersLand(ownedLand);
//       if (response.status === 204) {
//         return { noContent: true };
//       }
//       //   const currentRowsHeight =
//       //     response.data?.LandInformations != null
//       //       ? 4 + response.data?.LandInformations.length * 10
//       //       : 0;
//       //   const initialHeight = currentRowsHeight > 20 ? 20 : currentRowsHeight;
//       dispatch(setLoadingState(false));
//       return response;
//     } catch (err) {
//       dispatch(setLoadingState(false));
//       if (!err.response) {
//         throw err;
//       }
//       if (err.response.status === 404) {
//         return rejectWithValue({
//           notFound: true,
//           message: err.response.data,
//         });
//       }
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const sharedOwnersLand = createAsyncThunk(
  LANDOWNERS,
  async (sharedLand: SharedLand, { rejectWithValue, dispatch }) => {
    try {
      const response = await landApi.sharedOwnersLand(sharedLand);
      if (response.status === 204) {
        return { noContent: true };
      }
      //   const currentRowsHeight =
      //     response.data?.LandInformations != null
      //       ? 4 + response.data?.LandInformations.length * 10
      //       : 0;
      //   const initialHeight = currentRowsHeight > 20 ? 20 : currentRowsHeight;
      dispatch(setLoadingState(false));
      return response;
    } catch (error) {
      dispatch(setLoadingState(false));
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiResponse;
        return rejectWithValue({
          message: apiError?.Message || error.message,
          statusCode: apiError?.StatusCode || 500,
        });
      } else if (error instanceof Error) {
        return rejectWithValue({
          message: error.message,
          statusCode: 500,
        });
      } else {
        return rejectWithValue({
          message: "An unexpected error occurred",
          statusCode: 500,
        });
      }
    }
  }
);
