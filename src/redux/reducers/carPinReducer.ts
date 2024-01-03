import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CarPinService from "src/services/carPinService";
import { CarPin } from "src/types/model";

import { AppDispatch, GetState } from "..";
import { catchErrorMessage } from "./messageReducer";

export type CarPinReducerState = {
  list: CarPin[];
  loading: boolean;
  updatingID: number;
};

const initialState: CarPinReducerState = {
  list: [],
  loading: false,
  updatingID: -1,
};

export const slice = createSlice({
  name: "carPinReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<CarPin[]>) => {
      state.list = action.payload;
    },
    insertToList: (state, action: PayloadAction<CarPin>) => {
      state.list.push(action.payload);
    },
    deleteListItem: (state, action: PayloadAction<CarPin>) => {
      const pinList = [...state.list];
      const foundIndex = pinList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        pinList.splice(foundIndex, 1);
        state.list = pinList;
      }
    },
    setUpdatingID: (state, action: PayloadAction<number>) => {
      state.updatingID = action.payload;
    },
  },
});

export const {
  setLoading,
  setList,
  insertToList,
  deleteListItem,
  setUpdatingID,
} = slice.actions;

export const getCarPinListByUserID = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const carPinList = await CarPinService.getCarPinListByUserID(userID);
    dispatch(setList(carPinList));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createCarPin = (carMakeID: number) => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  dispatch(setUpdatingID(carMakeID));
  try {
    const currentUser = getState().authReducer.user;
    if (!currentUser) {
      throw new Error("User not found");
    }

    const newCarPin = await CarPinService.createCarPin({
      car_make: carMakeID,
      userid: currentUser.id,
    });

    dispatch(insertToList(newCarPin));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setUpdatingID(-1));
};

export const deleteCarPin = (carMakeID: number) => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  dispatch(setUpdatingID(carMakeID));
  try {
    const carPinList = getState().carPinReducer.list;
    const carPin = carPinList.find((item) => item.car_make === carMakeID);
    if (carPin) {
      await CarPinService.deleteCarPin(carPin.id);
      dispatch(deleteListItem(carPin));
    }
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setUpdatingID(-1));
};

export default slice.reducer;
