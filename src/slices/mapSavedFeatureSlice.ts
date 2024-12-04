import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserDrawnFeatures } from "../thunk/mapSavedFeatureThunk";
import { FeatureData } from "../lib/types";

export interface MapSavedState {
  savedFeatures: any[]; //Feature[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MapSavedState = {
  savedFeatures: [],
  isLoading: false,
  error: null,
};

const mapSavedFeatureSlice = createSlice({
  name: "mapSavedFeature",
  initialState,
  reducers: {
    setSavedDrawnFeatures(state, action: PayloadAction<FeatureData[]>) {
      state.savedFeatures = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDrawnFeatures.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserDrawnFeatures.fulfilled, (state, action) => {
      state.isLoading = false;
      state.savedFeatures = action.payload;
      //  const geoJSONFormat = new GeoJSON();
      // state.savedFeatures = action.payload.map((feature: any) =>
      //   geoJSONFormat.readFeature(feature)
      // );
    });
    builder.addCase(fetchUserDrawnFeatures.rejected, (state, action) => {
      console.log("rejecteed fetch user drawn features");
      state.isLoading = false;
      state.error = action.payload ? String(action.payload) : "Unknown error";
    });
  },
});

export const { setSavedDrawnFeatures } = mapSavedFeatureSlice.actions;

export default mapSavedFeatureSlice.reducer;
