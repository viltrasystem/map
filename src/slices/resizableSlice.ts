import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ResizableState {
  bottomPaneHeight: number;
  isAtTop: boolean;
}
const initialState: ResizableState = {
  bottomPaneHeight: 0,
  isAtTop: false,
};

const resizableSlice = createSlice({
  name: "resize",
  initialState: initialState,
  reducers: {
    setHeightState: (state, action: PayloadAction<number>) => {
      state.bottomPaneHeight = action.payload;
      state.isAtTop = action.payload > 95;
    },
  },
});

export const { setHeightState } = resizableSlice.actions;

export default resizableSlice.reducer;
