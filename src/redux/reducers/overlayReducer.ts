import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modifyFileName } from "src/helper";
import FavoriteOverlayService from "src/services/favoriteOverlayService";
import OverlayService from "src/services/overlayService";
import { BuilderOverlay, FavoriteOverlay } from "src/types/model";
import { FavoriteOverlayPayload } from "src/types/query";

import { AppDispatch } from "..";
import { setMessage } from "./messageReducer";

export type OverlayReducerState = {
  list: BuilderOverlay[];
  favoriteOverlayList: FavoriteOverlay[];
  current?: BuilderOverlay | null;
  loading: boolean;
};

const initialState: OverlayReducerState = {
  list: [],
  favoriteOverlayList: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "overlayReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<BuilderOverlay[]>) => {
      state.list = action.payload;
    },
    insertToList: (state, action: PayloadAction<BuilderOverlay>) => {
      state.list.push(action.payload);
    },
    concatList: (state, action: PayloadAction<BuilderOverlay[]>) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action: PayloadAction<BuilderOverlay>) => {
      const overlayList = [...state.list];
      const foundIndex = overlayList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        overlayList[foundIndex] = action.payload;
        state.list = overlayList;
      }
    },
    deleteListItem: (state, action: PayloadAction<{ id: number }>) => {
      const overlayList = [...state.list];
      const foundIndex = overlayList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        overlayList.splice(foundIndex, 1);
        state.list = overlayList;
      }
      if (state.current && state.current.id === action.payload.id) {
        state.current = null;
      }
    },
    setCurrent: (state, action: PayloadAction<BuilderOverlay | null>) => {
      state.current = action.payload;
    },
    setFavoriteOverlayList: (
      state,
      action: PayloadAction<FavoriteOverlay[]>
    ) => {
      state.favoriteOverlayList = [...action.payload];
    },
    insertToFavoriteOverlayList: (
      state,
      action: PayloadAction<FavoriteOverlay>
    ) => {
      const favorite = { ...action.payload };
      state.favoriteOverlayList.push(favorite);
    },
    deleteFavoriteOverlayListItem: (state, action: PayloadAction<number>) => {
      state.favoriteOverlayList = state.favoriteOverlayList.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearFavoriteOverlayList: (state) => {
      state.favoriteOverlayList = [];
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
  deleteListItem,
  setFavoriteOverlayList,
  insertToFavoriteOverlayList,
  deleteFavoriteOverlayListItem,
  clearFavoriteOverlayList,
} = slice.actions;

export default slice.reducer;

export const getOverlayList = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const overlays = await OverlayService.getOverlayList();
    dispatch(setList(overlays));
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndCreateOverlay = (
  {
    name,
    overlay_file,
    overlay_thumb,
    color,
    stroke_scale,
    legacy_mode,
  }: {
    name: string;
    overlay_file: File;
    overlay_thumb: File;
    color: string;
    stroke_scale: number;
    legacy_mode: number;
  },
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("stroke_scale", stroke_scale.toString());
    formData.append("legacy_mode", legacy_mode.toString());

    const fileNames = [];
    fileNames.push(modifyFileName(overlay_file));
    fileNames.push(modifyFileName(overlay_thumb));
    formData.append("fileNames", JSON.stringify(fileNames));

    formData.append("overlay_file", overlay_file);
    formData.append("overlay_thumb", overlay_thumb);

    const overlay = await OverlayService.uploadAndCreate(formData);
    dispatch(insertToList(overlay));
    dispatch(
      setMessage({
        message: `Create a graphic successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndUpdateOverlay = (
  id: number,
  {
    name,
    overlay_file,
    overlay_thumb,
    color,
    stroke_scale,
    legacy_mode,
  }: {
    name: string;
    overlay_file?: File;
    overlay_thumb?: File;
    color: string;
    stroke_scale: number;
    legacy_mode: number;
  },
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("stroke_scale", stroke_scale.toString());
    formData.append("legacy_mode", legacy_mode.toString());

    const fileNames = [];
    fileNames.push(overlay_file ? modifyFileName(overlay_file) : undefined);
    fileNames.push(overlay_thumb ? modifyFileName(overlay_thumb) : undefined);
    formData.append("fileNames", JSON.stringify(fileNames));

    if (overlay_file) formData.append("overlay_file", overlay_file);
    if (overlay_thumb) formData.append("overlay_thumb", overlay_thumb);

    const overlay = await OverlayService.uploadAndUpdate(id, formData);
    dispatch(updateListItem(overlay));
    dispatch(
      setMessage({
        message: `Update a graphic successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const deleteOverlay = (id: number, callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    await OverlayService.deleteOverlay(id);
    dispatch(deleteListItem({ id }));
    dispatch(
      setMessage({
        message: `Removed a graphic successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const getFavoriteOverlayList = (
  userID: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const list = await FavoriteOverlayService.getFavoriteOverlayListByUserID(
      userID
    );
    dispatch(setFavoriteOverlayList(list));
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  callback?.();
};

export const createFavoriteOverlay = (
  payload: FavoriteOverlayPayload,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const favoriteLogo = await FavoriteOverlayService.createFavoriteOverlay(
      payload
    );
    dispatch(insertToFavoriteOverlayList(favoriteLogo));
    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
};

export const deleteFavoriteOverlayItem = (
  id: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    await FavoriteOverlayService.deleteFavoriteOverlay(id);
    dispatch(deleteFavoriteOverlayListItem(id));
    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
};
