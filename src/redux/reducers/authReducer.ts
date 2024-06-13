import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import config from "src/config";
import AuthService from "src/services/authService";
import BlockedUserService from "src/services/blockedUserService";
import CookieService from "src/services/cookieService";
import UserService from "src/services/userService";
import { UserMin } from "src/types/model";
import { AuthPayload } from "src/types/query";

import { AppDispatch } from "..";
import { catchErrorMessage } from "./messageReducer";
import {
  clearCurrent as clearCurrentScheme,
  clearFavoriteList,
  clearList as clearSchemeList,
  clearSharedList,
} from "./schemeReducer";
import { setIntialized } from "./uploadReducer";

export type AuthReducerState = {
  user: UserMin | undefined;
  loading: boolean;
  previousPath: string | null;
  blockedUsers: number[];
  blockedBy: number[];
};

const initialState: AuthReducerState = {
  user: undefined,
  loading: false,
  previousPath: null,
  blockedUsers: [],
  blockedBy: [],
};

export const slice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserMin | undefined>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPreviousPath: (state, action: PayloadAction<string | null>) => {
      state.previousPath = action.payload;
    },
    setBlockedUsers: (state, action: PayloadAction<number[]>) => {
      state.blockedUsers = action.payload;
    },
    setBlockedBy: (state, action: PayloadAction<number[]>) => {
      state.blockedBy = action.payload;
    },
  },
});

const { setUser, setLoading, setBlockedUsers, setBlockedBy } = slice.actions;
export const { setPreviousPath } = slice.actions;

export const signInWithCookie = (
  callback?: () => void,
  fallback?: (error?: unknown) => void
) => async (dispatch: AppDispatch) => {
  const siteLogin = CookieService.getSiteLogin();
  if (siteLogin && Object.keys(siteLogin).length === 2) {
    dispatch(setLoading(true));

    try {
      const user = await AuthService.getMe();
      dispatch(setBlockedUsers(user.blockedUsers.map((item) => item.userid)));
      dispatch(
        setBlockedBy(user.blockedByUsers.map((item) => item.blocker_id))
      );
      dispatch(setUser(_.omit(user, ["blockedUsers", "blockedByUsers"])));
      callback?.();
    } catch (error) {
      console.log("error: ", error);
      fallback?.(error);
    }
    dispatch(setLoading(false));
  } else {
    fallback?.();
  }
};

export const signIn = (
  payload: AuthPayload,
  callback?: (user: UserMin) => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await AuthService.signIn(payload);
    CookieService.setSiteLogin(response.token);
    dispatch(setUser(response.user));
    callback?.(response.user);
  } catch (error) {
    dispatch(catchErrorMessage(error));
  }
  dispatch(setLoading(false));
};

export const signOut = () => async (dispatch: AppDispatch) => {
  CookieService.clearSiteLogin();
  dispatch(clearSchemeList());
  dispatch(clearCurrentScheme());
  dispatch(clearSharedList());
  dispatch(clearFavoriteList());
  dispatch(setUser(undefined));
  dispatch(setIntialized(false));
  window.location.href = config.parentAppURL + "/logout";
};

export const getBlockedUsers = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const blockedUserList = await BlockedUserService.getBlockedUserListByBlocker(
      userID
    );
    dispatch(setBlockedUsers(blockedUserList.map((item) => item.userid)));
  } catch (err: unknown) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const getBlockedBy = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const blockedUserList = await BlockedUserService.getBlockedUserListByBlockedUser(
      userID
    );
    dispatch(setBlockedBy(blockedUserList.map((item) => item.blocker_id)));
  } catch (err: unknown) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const updateUser = (user: UserMin) => async (dispatch: AppDispatch) => {
  dispatch(setUser(user));
  await UserService.updateUser(user.id, user);
};

export default slice.reducer;
