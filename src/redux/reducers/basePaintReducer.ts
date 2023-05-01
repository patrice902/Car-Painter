import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuilderBase } from "src/types/model";

export type BasepaintReducerState = {
  list: BuilderBase[];
  current: BuilderBase | null;
  loading: boolean;
};

const initialState: BasepaintReducerState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "basePaintReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<BuilderBase[]>) => {
      const list = action.payload;
      for (const item of list) {
        if (typeof item.base_data === "string") {
          item.base_data = JSON.parse(item.base_data);
        }
      }
      state.list = list;
    },
    insertToList: (state, action: PayloadAction<BuilderBase>) => {
      const basepaint = action.payload;
      if (typeof basepaint.base_data === "string") {
        basepaint.base_data = JSON.parse(basepaint.base_data);
      }
      state.list.push(basepaint);
    },
    updateListItem: (state, action: PayloadAction<BuilderBase>) => {
      const basePaintList = [...state.list];
      const foundIndex = basePaintList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        basePaintList[foundIndex] = action.payload;
        state.list = basePaintList;
      }
    },
    setCurrent: (state, action: PayloadAction<BuilderBase | null>) => {
      state.current = action.payload;
    },
  },
});

export const {
  setCurrent,
  setList,
  insertToList,
  updateListItem,
} = slice.actions;

export default slice.reducer;
