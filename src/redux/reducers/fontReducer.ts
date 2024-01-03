import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import FontService from "src/services/fontService";
import { BuilderFont } from "src/types/model";

import { AppDispatch } from "..";
import { catchErrorMessage } from "./messageReducer";

export type FontReducerState = {
  list: BuilderFont[];
  loadedList: string[];
  current?: BuilderFont | null;
  loading: boolean;
};

const initialState: FontReducerState = {
  list: [],
  loadedList: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "fontReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<BuilderFont[]>) => {
      state.list = action.payload;
    },
    insertToList: (state, action: PayloadAction<BuilderFont>) => {
      state.list.push(action.payload);
    },
    concatList: (state, action: PayloadAction<BuilderFont[]>) => {
      state.list = state.list.concat(action.payload);
    },
    setLoadedList: (state, action: PayloadAction<string[]>) => {
      state.loadedList = action.payload;
    },
    insertToLoadedList: (state, action: PayloadAction<string>) => {
      state.loadedList = state.loadedList.concat(action.payload);
    },
    updateListItem: (state, action: PayloadAction<BuilderFont>) => {
      const overlayList = [...state.list];
      const foundIndex = overlayList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        overlayList[foundIndex] = action.payload;
        state.list = overlayList;
      }
    },
    setCurrent: (state, action: PayloadAction<BuilderFont | null>) => {
      state.current = action.payload;
    },
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  setList,
  insertToList,
  concatList,
  updateListItem,
  setLoadedList,
  insertToLoadedList,
} = slice.actions;

export default slice.reducer;

export const getFontList = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const fonts = await FontService.getFontList();
    dispatch(setList(fonts));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};
