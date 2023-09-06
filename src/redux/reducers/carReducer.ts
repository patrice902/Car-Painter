import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CarService from "src/services/carService";
import { CarRace } from "src/types/query";

import { AppDispatch, GetState } from "..";
import { setMessage } from "./messageReducer";
import { setCurrent as setCurrentScheme, updateScheme } from "./schemeReducer";

export type CarReducerState = {
  cars: CarRace[];
  loading: boolean;
  submitting: boolean;
};

const initialState: CarReducerState = {
  cars: [],
  loading: false,
  submitting: false,
};

export const slice = createSlice({
  name: "carReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setCars: (state, action: PayloadAction<CarRace[]>) => {
      state.cars = action.payload;
    },
  },
});

const { setLoading, setSubmitting } = slice.actions;
export const { setCars } = slice.actions;

export const getCarRaces = (
  schemeID: number,
  onSuccess?: () => void,
  onError?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const carRaces = [];
    const stampedCarResult = await CarService.getCarRace(schemeID, 0);
    if (stampedCarResult.status) {
      carRaces.push(stampedCarResult.output);
    }
    const customCarResult = await CarService.getCarRace(schemeID, 1);
    if (customCarResult.status) {
      carRaces.push(customCarResult.output);
    }
    dispatch(setCars(carRaces));
    onSuccess?.();
  } catch (err) {
    onError?.();
  }
  dispatch(setLoading(false));
};

export const setCarRace = (
  payload: FormData,
  onSuccess?: () => void,
  onError?: () => void
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setSubmitting(true));
  try {
    const result = await CarService.setCarRace(payload);
    if (result.status != 1) {
      dispatch(setMessage({ message: result.output }));
    }
    const currentScheme = getState().schemeReducer.current;
    if (currentScheme) {
      dispatch(
        updateScheme({ ...currentScheme, race_updated: 1 }, false, false)
      );
      dispatch(setCurrentScheme({ ...currentScheme, race_updated: 1 }));
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.log("Error: ", err);
    // dispatch(catchErrorMessage(err));
    dispatch(setMessage({ message: "Racing Failed!" }));
    if (onError) {
      onError();
    }
  }
  dispatch(setSubmitting(false));
};

export default slice.reducer;
