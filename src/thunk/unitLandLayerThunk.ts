import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse, ErrorState, OwnedLand } from "../lib/types";
import unitLandLayerApiService from "../services/unitLandLayerApi";
import { setInitialHeightState } from "../slices/bottomPaneIntialSlice";
import axios from "axios";
import { setLoadingState } from "../slices/loadingSlice";
// Action type constants
const LOADUNITLANDLAYER = "LOADUNITLANDLAYER";

export const loadUnitLandLayer = createAsyncThunk<
  any | string, //***
  OwnedLand,
  { rejectValue: ErrorState }
>(
  LOADUNITLANDLAYER,
  async (landReq: OwnedLand, { rejectWithValue, dispatch }) => {
    try {
      const response = landReq.isLandTab
        ? await unitLandLayerApiService.loadUnitOwnersLandLayers(landReq)
        : await unitLandLayerApiService.loadUnitLandLayers(landReq.unitId);
      if (response.data.StatusCode === 204) {
        return { noContent: true };
      }
      const currentRowsHeight =
        response.data?.Lands != null ? 4 + response.data?.Lands.length * 10 : 0;
      const initialHeight = currentRowsHeight > 20 ? 20 : currentRowsHeight;
      dispatch(setInitialHeightState(initialHeight));
      if (response.status === 204) {
        return { noContent: true };
      }
      dispatch(setLoadingState(false));
      return { data: response.data, locale: landReq.locale };
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
