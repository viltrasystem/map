import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TabState {
  selectedTab: string;
}
const initialState: TabState = {
  selectedTab: "land",
};

const tabSelectionSlice = createSlice({
  name: "tabSelection",
  initialState: initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = tabSelectionSlice.actions;

export default tabSelectionSlice.reducer;
