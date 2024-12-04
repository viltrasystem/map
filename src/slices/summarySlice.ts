import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SummaryInfo = {
  unitId: number;
  summaryType: string;
};

interface SummaryInfoState {
  summaryInfo: SummaryInfo;
}

const initialState: SummaryInfoState = {
  summaryInfo: { unitId: 0, summaryType: "land" },
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setSummaryUnit: (state, action: PayloadAction<SummaryInfo>) => {
      state.summaryInfo.unitId = action.payload.unitId;
      state.summaryInfo.summaryType = action.payload.summaryType;
    },
  },
});

export const { setSummaryUnit } = summarySlice.actions;
export default summarySlice.reducer;
