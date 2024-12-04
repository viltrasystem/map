import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MappingState {
  isMapping: boolean;
  rootId: number;
  unitId: number;
  currentUserId: number;
  landId: number;
  municipality: string;
  mainNo: string;
  subNo: string;
}

const initialState: MappingState = {
  isMapping: false,
  rootId: 0,
  unitId: 0,
  currentUserId: 0,
  landId: 0,
  municipality: "",
  mainNo: "",
  subNo: "",
};

const landMapping = createSlice({
  name: "landMapping",
  initialState: initialState,
  reducers: {
    setLandMapping: (state, action: PayloadAction<MappingState>) => {
      (state.isMapping = action.payload.isMapping),
        (state.rootId = action.payload.rootId),
        (state.unitId = action.payload.unitId),
        (state.currentUserId = action.payload.currentUserId),
        (state.landId = action.payload.landId),
        (state.municipality = action.payload.municipality),
        (state.mainNo = action.payload.mainNo),
        (state.subNo = action.payload.subNo),
        console.log(action.payload, "mapping result");
    },
  },
});

export const { setLandMapping } = landMapping.actions;

export default landMapping.reducer;
