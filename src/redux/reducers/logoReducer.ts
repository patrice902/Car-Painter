import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modifyFileName } from "src/helper";
import LogoService from "src/services/logoService";
import { BuilderLogo } from "src/types/model";

import { AppDispatch } from "..";
import { setMessage } from "./messageReducer";

export type LogoReducerState = {
  list: BuilderLogo[];
  current?: BuilderLogo | null;
  loading: boolean;
};

const initialState: LogoReducerState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "logoReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<BuilderLogo[]>) => {
      state.list = action.payload;
    },
    insertToList: (state, action: PayloadAction<BuilderLogo>) => {
      state.list.push(action.payload);
    },
    concatList: (state, action: PayloadAction<BuilderLogo[]>) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action: PayloadAction<BuilderLogo>) => {
      const logoList = [...state.list];
      const foundIndex = logoList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        logoList[foundIndex] = action.payload;
        state.list = logoList;
      }
    },
    deleteListItem: (state, action: PayloadAction<{ id: number }>) => {
      const logoList = [...state.list];
      const foundIndex = logoList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        logoList.splice(foundIndex, 1);
        state.list = logoList;
      }
      if (state.current && state.current.id === action.payload.id) {
        state.current = null;
      }
    },
    setCurrent: (state, action: PayloadAction<BuilderLogo | null>) => {
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
  deleteListItem,
} = slice.actions;

export default slice.reducer;

export const getLogoList = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const overlays = await LogoService.getLogoList();
    dispatch(setList(overlays));
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndCreateLogo = (
  {
    name,
    source_file,
    preview_file,
    type,
    active,
    enable_color,
  }: {
    name: string;
    source_file: File;
    preview_file: File;
    type: string;
    active: number;
    enable_color: number;
  },
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("active", active.toString());
    formData.append("enable_color", enable_color.toString());

    const fileNames = [];
    fileNames.push(modifyFileName(source_file));
    fileNames.push(modifyFileName(preview_file));
    formData.append("fileNames", JSON.stringify(fileNames));

    formData.append("source_file", source_file);
    formData.append("preview_file", preview_file);

    const logo = await LogoService.uploadAndCreate(formData);
    dispatch(insertToList(logo));
    dispatch(
      setMessage({
        message: `Create a logo successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndUpdateLogo = (
  id: number,
  {
    name,
    source_file,
    preview_file,
    type,
    active,
    enable_color,
  }: {
    name: string;
    source_file?: File;
    preview_file?: File;
    type: string;
    active: number;
    enable_color: number;
  },
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("active", active.toString());
    formData.append("enable_color", enable_color.toString());

    const fileNames = [];
    fileNames.push(source_file ? modifyFileName(source_file) : undefined);
    fileNames.push(preview_file ? modifyFileName(preview_file) : undefined);
    formData.append("fileNames", JSON.stringify(fileNames));

    if (source_file) formData.append("source_file", source_file);
    if (preview_file) formData.append("preview_file", preview_file);

    const logo = await LogoService.uploadAndUpdate(id, formData);
    dispatch(updateListItem(logo));
    dispatch(
      setMessage({
        message: `Update a logo successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const deleteLogo = (id: number, callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    await LogoService.deleteLogo(id);
    dispatch(deleteListItem({ id }));
    dispatch(
      setMessage({
        message: `Removed a logo successfully!`,
        type: "success",
      })
    );

    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};
