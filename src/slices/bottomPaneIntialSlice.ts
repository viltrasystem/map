import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BottomPaneIntialState {
  initialHeight: number;
}

const initialState: BottomPaneIntialState = {
  initialHeight: 0,
};

const bottomPaneIntialSlice = createSlice({
  name: "bottomPaneIntial",
  initialState: initialState,
  reducers: {
    setInitialHeightState: (state, action: PayloadAction<number>) => {
      state.initialHeight = action.payload;
    },
  },
});

export const { setInitialHeightState } = bottomPaneIntialSlice.actions;

export default bottomPaneIntialSlice.reducer;
