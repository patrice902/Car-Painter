import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modifyFileName } from "src/helper";
import FavoriteUploadService from "src/services/favoriteUploadService";
import SharedUploadService from "src/services/sharedUploadService";
import UploadService from "src/services/uploadService";
import {
  BuilderUploadWithUser,
  FavoriteUpload,
  SharedUploadWithInfo,
} from "src/types/model";
import {
  FavoriteUploadPayload,
  SharedUploadByCodePayload,
} from "src/types/query";

import { AppDispatch } from "..";
import { catchErrorMessage, setMessage } from "./messageReducer";

export type UploadReducerState = {
  list: BuilderUploadWithUser[];
  favoriteUploadList: FavoriteUpload[];
  sharedUploadList: SharedUploadWithInfo[];
  current?: BuilderUploadWithUser | null;
  loading: boolean;
  initialized: boolean;
};

const initialState: UploadReducerState = {
  list: [],
  favoriteUploadList: [],
  sharedUploadList: [],
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
    setList: (state, action: PayloadAction<BuilderUploadWithUser[]>) => {
      state.list = action.payload;
      state.initialized = true;
    },
    setIntialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    insertToList: (state, action: PayloadAction<BuilderUploadWithUser>) => {
      state.list.push(action.payload);
    },
    concatList: (state, action: PayloadAction<BuilderUploadWithUser[]>) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action: PayloadAction<BuilderUploadWithUser>) => {
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
    setCurrent: (
      state,
      action: PayloadAction<BuilderUploadWithUser | null>
    ) => {
      state.current = action.payload;
    },
    setFavoriteUploadList: (state, action: PayloadAction<FavoriteUpload[]>) => {
      state.favoriteUploadList = [...action.payload];
    },
    insertToFavoriteUploadList: (
      state,
      action: PayloadAction<FavoriteUpload>
    ) => {
      const favorite = { ...action.payload };
      state.favoriteUploadList.push(favorite);
    },
    deleteFavoriteUploadListItem: (state, action: PayloadAction<number>) => {
      state.favoriteUploadList = state.favoriteUploadList.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearFavoriteUploadList: (state) => {
      state.favoriteUploadList = [];
    },
    setSharedUploadList: (
      state,
      action: PayloadAction<SharedUploadWithInfo[]>
    ) => {
      state.sharedUploadList = [...action.payload];
    },
    insertToSharedUploadList: (
      state,
      action: PayloadAction<SharedUploadWithInfo>
    ) => {
      const favorite = { ...action.payload };
      state.sharedUploadList.push(favorite);
    },
    deleteSharedUploadListItem: (state, action: PayloadAction<number>) => {
      state.sharedUploadList = state.sharedUploadList.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearSharedUploadList: (state) => {
      state.sharedUploadList = [];
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
  setFavoriteUploadList,
  insertToFavoriteUploadList,
  deleteFavoriteUploadListItem,
  clearFavoriteUploadList,
  setSharedUploadList,
  insertToSharedUploadList,
  deleteSharedUploadListItem,
  clearSharedUploadList,
} = slice.actions;

export const getUploadListByUserID = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const uploads = await UploadService.getUploadListByUserID(userID);
    dispatch(setList(uploads));
  } catch (err) {
    dispatch(catchErrorMessage(err));
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
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const deleteUpload = (
  upload: { id: number },
  deleteFromAll: boolean,
  userID?: number
) => async (dispatch: AppDispatch) => {
  // dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(upload));
    await UploadService.deleteUpload(upload.id, deleteFromAll, userID);
    dispatch(
      setMessage({
        message: "Deleted your uploaded file successfully!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
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
    const sharedList = await SharedUploadService.getSharedUploadListByUserID(
      userID
    );
    dispatch(setSharedUploadList(sharedList));

    dispatch(
      setMessage({
        message: "Removed your legacy uploads successfully!",
        type: "success",
      })
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  // dispatch(setLoading(false));
};

export const getFavoriteUploadList = (
  userID: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const list = await FavoriteUploadService.getFavoriteUploadListByUserID(
      userID
    );
    dispatch(setFavoriteUploadList(list));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  callback?.();
};

export const createFavoriteUpload = (
  payload: FavoriteUploadPayload,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const favoriteUpload = await FavoriteUploadService.createFavoriteUpload(
      payload
    );
    dispatch(insertToFavoriteUploadList(favoriteUpload));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const deleteFavoriteUploadItem = (
  id: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    await FavoriteUploadService.deleteFavoriteUpload(id);
    dispatch(deleteFavoriteUploadListItem(id));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const getSharedUploadList = (
  userID: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const list = await SharedUploadService.getSharedUploadListByUserID(userID);
    dispatch(setSharedUploadList(list));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  callback?.();
};

export const createSharedUploadByCode = (
  payload: SharedUploadByCodePayload,
  callback?: () => void,
  fallback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const sharedUpload = await SharedUploadService.createSharedUploadByCode(
      payload
    );
    dispatch(insertToSharedUploadList(sharedUpload));
    callback?.();
  } catch (err) {
    fallback?.();
    dispatch(catchErrorMessage(err));
  }
};

export const deleteSharedUploadItem = (
  id: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    await SharedUploadService.deleteSharedUpload(id);
    dispatch(deleteSharedUploadListItem(id));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export default slice.reducer;
