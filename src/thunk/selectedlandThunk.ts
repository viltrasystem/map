import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ApiResponse,
  ErrorState,
  LandSelectorFormInputs,
  MapLandInformation,
} from "../lib/types";
import selectedLandApiService from "../services/selectedLandApi";
import { setInitialHeightState } from "../slices/bottomPaneIntialSlice";
import axios from "axios";
import { setLoadingState } from "../slices/loadingSlice";
// Action type constants
const LOADLAND = "LOADLAND";

export const loadLand = createAsyncThunk<
  MapLandInformation | { noContent: boolean },
  LandSelectorFormInputs,
  { rejectValue: ErrorState }
>(
  LOADLAND,
  async (
    selectedLand: LandSelectorFormInputs,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await selectedLandApiService.loadLand(selectedLand);
      if (response.data.StatusCode === 204) {
        return { noContent: true };
      }
      const currentRowsHeight =
        response.data?.LandInformations != null
          ? 4 + response.data?.LandInformations.length * 10
          : 0;
      const initialHeight = currentRowsHeight > 20 ? 20 : currentRowsHeight;
      dispatch(setInitialHeightState(initialHeight));
      dispatch(setLoadingState(false));
      return response.data;
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
