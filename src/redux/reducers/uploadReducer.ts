import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modifyFileName } from "src/helper";
import UploadService from "src/services/uploadService";
import { BuilderUpload } from "src/types/model";

import { AppDispatch } from "..";
import { setMessage } from "./messageReducer";

export type UploadReducerState = {
  list: BuilderUpload[];
  current?: BuilderUpload | null;
  loading: boolean;
  initialized: boolean;
};

const initialState: UploadReducerState = {
  list: [],
  current: null,
  loading: false,
  initialized: false,
};

export const slice = createSlice({
  name: "uploadReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setList: (state, action: PayloadAction<BuilderUpload[]>) => {
      state.list = action.payload;
      state.initialized = true;
    },
    setIntialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    insertToList: (state, action: PayloadAction<BuilderUpload>) => {
      state.list.push(action.payload);
    },
    concatList: (state, action: PayloadAction<BuilderUpload[]>) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action: PayloadAction<BuilderUpload>) => {
      const list = [...state.list];
      const foundIndex = list.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        list[foundIndex] = action.payload;
        state.list = list;
      }
    },
    deleteListItem: (state, action: PayloadAction<{ id: number }>) => {
      const list = [...state.list];
      const foundIndex = list.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        list.splice(foundIndex, 1);
        state.list = list;
      }
    },
    setCurrent: (state, action: PayloadAction<BuilderUpload | null>) => {
      state.current = action.payload;
    },
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  setList,
  concatList,
  insertToList,
  updateListItem,
  deleteListItem,
  setIntialized,
} = slice.actions;

export const getUploadListByUserID = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const uploads = await UploadService.getUploadListByUserID(userID);
    dispatch(setList(uploads));
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const uploadFiles = (
  userID: number,
  schemeID: number,
  files: File[],
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const formData = new FormData();
    formData.append("userID", userID.toString());
    formData.append("schemeID", schemeID.toString());
    const fileNames = [];
    const newNames: Record<string, string> = {};
    for (const file of files) {
      fileNames.push(file.name);
      newNames[file.name] = modifyFileName(file, userID);
    }
    formData.append("fileNames", JSON.stringify(fileNames));
    formData.append("newNames", JSON.stringify(newNames));
    for (const file of files) formData.append("files", file);

    const uploads = await UploadService.uploadFiles(formData);
    dispatch(concatList(uploads));
    dispatch(
      setMessage({
        message: `Uploaded ${files.length} ${
          files.length > 1 ? "files" : "file"
        } successfully!`,
        type: "success",
      })
    );
    callback?.();
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  dispatch(setLoading(false));
};

export const deleteUpload = (
  upload: { id: number },
  deleteFromAll: boolean
) => async (dispatch: AppDispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(upload));
    await UploadService.deleteUpload(upload.id, deleteFromAll);
    dispatch(
      setMessage({
        message: "Deleted your uploaded file successfully!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  // dispatch(setLoading(false));
};

export const deleteLegacyUploadsByUserID = (
  userID: number,
  deleteFromAll: boolean
) => async (dispatch: AppDispatch) => {
  // dispatch(setLoading(true));

  try {
    await UploadService.deleteLegacyByUserID(userID, deleteFromAll);
    const uploads = await UploadService.getUploadListByUserID(userID);
    dispatch(setList(uploads));
    dispatch(
      setMessage({
        message: "Removed your legacy uploads successfully!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(setMessage({ message: (err as Error).message }));
  }
  // dispatch(setLoading(false));
};

export default slice.reducer;
