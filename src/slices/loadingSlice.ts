import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean | undefined;
}

const initialState: LoadingState = {
  isLoading: undefined,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialState,
  reducers: {
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoadingState } = loadingSlice.actions;

export default loadingSlice.reducer;
//
