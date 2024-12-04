import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  mapCenter: [number, number]; // [longitude, latitude]
  mapZoom: number;
  coordinates: [number, number];
  userCoordinate: [number, number];
}

const initialState: MapState = {
  mapCenter: [12.75, 65.3], // Initial center coordinates  [93630944278, -4596719] EU89 UTM33 6713266N 165035Ø(from map o fnorway), [656368, 6802082]
  mapZoom: 5.25, // Initial zoom level
  coordinates: [0, 0],
  userCoordinate: [0, 0],
};

const mapFeatureSlice = createSlice({
  name: "mapFeature",
  initialState: initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.mapCenter = action.payload;
      alert(`${action.payload}`);
    },
    setZoomLevel(state, action: PayloadAction<number>) {
      state.mapZoom = action.payload;
    },
    setCoordinates(state, action: PayloadAction<[number, number]>) {
      state.coordinates = action.payload;
    },
    setUserCoordinate(state, action: PayloadAction<[number, number]>) {
      state.userCoordinate = action.payload;
    },
  },
});

export const { setCenter, setZoomLevel, setCoordinates, setUserCoordinate } =
  mapFeatureSlice.actions;

export default mapFeatureSlice.reducer;