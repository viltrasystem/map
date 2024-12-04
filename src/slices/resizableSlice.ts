import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ResizableState {
  bottomPaneHeight: number;
}
const initialState: ResizableState = {
  bottomPaneHeight: 0,
};

const resizableSlice = createSlice({
  name: "resize",
  initialState: initialState,
  reducers: {
    setHeightState: (state, action: PayloadAction<number>) => {
      state.bottomPaneHeight = action.payload;
    },
  },
});

export const { setHeightState } = resizableSlice.actions;

export default resizableSlice.reducer;
