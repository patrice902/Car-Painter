import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { THEMES } from "src/types/enum";

const initialState = {
  currentTheme: THEMES.DARK,
};

export const slice = createSlice({
  name: "themeReducer",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<THEMES>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = slice.actions;

export default slice.reducer;
