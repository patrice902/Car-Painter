import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TeamService from "src/services/teamService";
import { Team } from "src/types/model";

import { AppDispatch } from "..";
import { catchErrorMessage } from "./messageReducer";

export type TeamReducerState = {
  list: Team[];
  loading: boolean;
};

const initialState: TeamReducerState = {
  list: [],
  loading: false,
};

export const slice = createSlice({
  name: "teamReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<Team[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setLoading, setList } = slice.actions;

export const getTeamListByUserID = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const teams = await TeamService.getTeamListByUserID(userID);
    dispatch(setList(teams));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export default slice.reducer;
