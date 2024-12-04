import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  globalFilter: string;
}

const initialState: FilterState = {
  globalFilter: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setGlobalFilter(state, action: PayloadAction<string>) {
      state.globalFilter = action.payload;
    },
  },
});

export const { setGlobalFilter } = filterSlice.actions;
export default filterSlice.reducer;
