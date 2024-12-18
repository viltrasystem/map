import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface DrawState {
  selectedColor: "red" | "green" | "yellow" | "blue" | "black";
  selectedFontSize: "8px" | "12px" | "16px" | "24px" | "32px";
  selectedLineSize: 1 | 2 | 3 | 4 | 5;
  selectedDrawOption:
    | "Point"
    | "LineString"
    | "Polygon"
    | "Text"
    | "Edit"
    | "Delete"
    | null;

  selectedImageOption:
    | "position_marker_hi"
    | "position_marker_gi"
    | "point"
    | "circle"
    | "fence"
    | "cross"
    | "home"
    | "hut"
    | "tree"
    | "solid_tree"
    | "tree_deciduous"
    | "cow"
    | "grass"
    | null;
  typedText: string | null;
}

const initialState: DrawState = {
  selectedColor: "black",
  selectedLineSize: 2,
  selectedFontSize: "8px",
  selectedDrawOption: null,
  selectedImageOption: null,
  typedText: null,
};

const drawSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setSelectedColor: (
      state,
      action: PayloadAction<DrawState["selectedColor"]>
    ) => {
      state.selectedColor = action.payload;
    },
    setSelectedLineSize: (
      state,
      action: PayloadAction<DrawState["selectedLineSize"]>
    ) => {
      state.selectedLineSize = action.payload;
    },
    setSelectedFontSize: (
      state,
      action: PayloadAction<DrawState["selectedFontSize"]>
    ) => {
      state.selectedFontSize = action.payload;
    },
    setSelectedDrawOption: (
      state,
      action: PayloadAction<DrawState["selectedDrawOption"]>
    ) => {
      state.selectedDrawOption = action.payload;
    },
    setSelectedImageOption: (
      state,
      action: PayloadAction<DrawState["selectedImageOption"]>
    ) => {
      state.selectedImageOption = action.payload;
    },
    setTypedText: (state, action: PayloadAction<DrawState["typedText"]>) => {
      state.typedText = action.payload;
    },
  },
});

export const {
  setSelectedColor,
  setSelectedLineSize,
  setSelectedFontSize,
  setSelectedDrawOption,
  setSelectedImageOption,
  setTypedText,
} = drawSlice.actions;

export default drawSlice.reducer;
