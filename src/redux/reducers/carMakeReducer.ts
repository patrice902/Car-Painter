import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CarMakeService from "src/services/carMakeService";
import { CarMake } from "src/types/model";
import { CarMakePayload } from "src/types/query";

import { AppDispatch } from "..";
import { catchErrorMessage } from "./messageReducer";

export type CarMakeReducerState = {
  list: CarMake[];
  current?: CarMake | null;
  loading: boolean;
};

const initialState: CarMakeReducerState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "carMakeReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<CarMake[]>) => {
      state.list = action.payload;
    },
    insertToList: (state, action: PayloadAction<CarMake>) => {
      state.list.push(action.payload);
    },
    updateListItem: (state, action: PayloadAction<CarMake>) => {
      const schemeList = [...state.list];
      const foundIndex = schemeList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        schemeList[foundIndex] = action.payload;
        state.list = schemeList;
      }
    },
    setCurrent: (state, action: PayloadAction<CarMake | null>) => {
      state.current = action.payload;
    },
  },
});

const { setLoading, setList, insertToList, updateListItem } = slice.actions;
export const { setCurrent } = slice.actions;

export const getCarMakeList = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const carMakes = await CarMakeService.getCarMakeList();
    dispatch(setList(carMakes));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createCarMake = (payload: CarMakePayload) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const carMake = await CarMakeService.createCarMake(payload);
    dispatch(insertToList(carMake));
    dispatch(setCurrent(carMake));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const updateCarMake = (id: number, payload: CarMakePayload) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const carMake = await CarMakeService.updateCarMake(id, payload);
    dispatch(updateListItem(carMake));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
