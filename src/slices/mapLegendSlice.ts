import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapLegendState {
  legendUrl: string | undefined;
}
const initialState: MapLegendState = {
  legendUrl: undefined,
};

const mapLegendSlice = createSlice({
  name: "mapLegend",
  initialState: initialState,
  reducers: {
    setLegend: (state, action: PayloadAction<string | undefined>) => {
      state.legendUrl = action.payload;
    },
  },
});

export const { setLegend } = mapLegendSlice.actions;

export default mapLegendSlice.reducer;
