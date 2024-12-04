import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SideBarState {
  isSidebarVisible: boolean;
}
const initialState: SideBarState = {
  isSidebarVisible: false,
};

const sideBarSlice = createSlice({
  name: "sideBar",
  initialState: initialState,
  reducers: {
    setSideBarVisibility: (state, action: PayloadAction<boolean>) => {
      state.isSidebarVisible = action.payload;
    },
  },
});

export const { setSideBarVisibility } = sideBarSlice.actions;

export default sideBarSlice.reducer;
