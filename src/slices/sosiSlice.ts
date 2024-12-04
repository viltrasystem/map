import { createSlice } from "@reduxjs/toolkit";
import { loadSosiFile } from "../thunk/sosiThunk";
import { Geometry } from "ol/geom";
import Feature from "ol/Feature";

interface Sosi {
  sosiData: Feature<Geometry>[] | null;
  loading: boolean;
  error: string | undefined;
}
const initialState: Sosi = {
  sosiData: null,
  loading: false,
  error: undefined,
};
const sosiSlice = createSlice({
  name: "sosi",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSosiFile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadSosiFile.fulfilled, (state, action) => {
        state.loading = false;
        state.sosiData = action.payload;
      })
      .addCase(loadSosiFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default sosiSlice.reducer;
