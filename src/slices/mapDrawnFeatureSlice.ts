import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Feature from "ol/Feature";
import { saveUserDrawnFeatures } from "../thunk/drawnFeatureThunk";
import { toast } from "react-toastify";
import { getToastOptions } from "../lib/helpFunction";
import { Geometry } from "ol/geom";

export type drawnFeature = {
  id: string;
  iconType: string;
  iconColor: string;
  iconSize: string;
  geometry: Feature<Geometry>;
};

export interface MapDrawnState {
  drawnFeatures: drawnFeature[];
  isLoading: boolean;
}

const initialState: MapDrawnState = {
  drawnFeatures: [],
  isLoading: false,
};

const mapDrawnFeatureSlice = createSlice({
  name: "mapDrawnFeature",
  initialState,
  reducers: {
    updateDrawnFeatures(state, action: PayloadAction<drawnFeature[]>) {
      state.drawnFeatures = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveUserDrawnFeatures.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(saveUserDrawnFeatures.fulfilled, (state) => {
      state.isLoading = false;
      toast.success("successfully saved", {
        ...getToastOptions,
        position: "top-center",
      });
    }),
      builder.addCase(saveUserDrawnFeatures.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(
          `Error saving features${
            action.payload ? ", " + action.payload : ", " + action.error.message
          }`,
          {
            ...getToastOptions,
            position: "top-center",
          }
        );
        console.error(
          "Error saving features:- slice",
          action.payload || action.error.message
        ); // Log the error for debugging purposes
      });
  },
});

export const { updateDrawnFeatures } = mapDrawnFeatureSlice.actions;

export default mapDrawnFeatureSlice.reducer;
