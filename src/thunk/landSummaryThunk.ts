import { createAsyncThunk } from "@reduxjs/toolkit";
import landApi from "../services/landApi";
import { setLoadingState } from "../slices/loadingSlice";
import { ArchiveInfo } from "../slices/landSummarySlice";
import { ApiResponse, ErrorState, OwnedLand } from "../lib/types";
import axios from "axios";

// Action type constants
const LANDSUMMERY = "LANDSUMMERY";
const ARCHIVEAND = "ARCHIVEAND";

export const landSummary = createAsyncThunk<
  any | string, //***
  OwnedLand,
  { rejectValue: ErrorState }
>(LANDSUMMERY, async (landReq: OwnedLand, { rejectWithValue, dispatch }) => {
  try {
    const response = landReq.isLandTab
      ? await landApi.ownersLand(landReq)
      : await landApi.landSummery(landReq.unitId);
    if (response.status === 204) {
      return { noContent: true };
    }
    dispatch(setLoadingState(false));
    return { data: response, locale: landReq.locale };
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
});

export const archiveLand = createAsyncThunk<
  any | string, //***
  ArchiveInfo,
  { rejectValue: ErrorState }
>(
  ARCHIVEAND,
  async (archiveInfo: ArchiveInfo, { rejectWithValue, dispatch }) => {
    try {
      const response = await landApi.archiveLand(archiveInfo);
      if (response.status === 204) {
        return { noContent: true };
      }
      dispatch(setLoadingState(false));
      console.log(archiveInfo.locale);
      return { data: response, locale: archiveInfo.locale };
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
