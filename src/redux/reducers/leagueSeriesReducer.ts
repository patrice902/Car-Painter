import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LeagueSeriesService from "src/services/leagueSeriesService";
import { LeagueSeries } from "src/types/model";

import { AppDispatch } from "..";
import { catchErrorMessage } from "./messageReducer";

export type LeagueSeriesReducerState = {
  list: LeagueSeries[];
  loading: boolean;
};

const initialState: LeagueSeriesReducerState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "leagueSeriesReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<LeagueSeries[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setLoading, setList } = slice.actions;

export const getLeagueSeriesListByUserID = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const leagueSeries = await LeagueSeriesService.getLeagueSeriesListByUserID(
      userID
    );
    dispatch(setList(leagueSeries));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
