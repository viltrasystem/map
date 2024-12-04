import { createAsyncThunk } from "@reduxjs/toolkit";
import mapDrawnFeaturesApi from "../services/mapDrawnFeaturesApi";
import axios from "axios";
import { ApiResponse } from "../lib/types";

const FETCHFEATURES = "FETCHFEATURES";

export const fetchUserDrawnFeatures = createAsyncThunk(
  FETCHFEATURES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await mapDrawnFeaturesApi.fetchDrawnFeatures();
      return response;
    } catch (error) {
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
