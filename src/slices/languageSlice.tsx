import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: "nb-NO",
};

const languageSlice = createSlice({
  name: "language",
  initialState: initialState,
  reducers: {
    setLanguageState: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguageState } = languageSlice.actions;

export default languageSlice.reducer;
