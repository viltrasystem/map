import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface selectedLayerSliceState {
  layerInfo: {
    layerName: string | undefined;
    isClicked: false;
    isMouseEnter: false;
    version: number;
  };
}

const initialState: selectedLayerSliceState = {
  layerInfo: {
    isClicked: false,
    isMouseEnter: false,
    layerName: undefined,
    version: 0,
  },
};

const selectedLayerSliceSlice = createSlice({
  name: "selectedLayer",
  initialState: initialState,
  reducers: {
    setSelectedLayerState: (state, action: PayloadAction<any>) => {
      state.layerInfo.layerName = action.payload.layerName;
      state.layerInfo.isClicked = action.payload.isClicked;
      state.layerInfo.isMouseEnter = action.payload.isMouseEnter;
      state.layerInfo.version += 1;
    },
  },
});

export const { setSelectedLayerState } = selectedLayerSliceSlice.actions;

export default selectedLayerSliceSlice.reducer;
