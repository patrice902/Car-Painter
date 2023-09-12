import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DownloaderService from "src/services/downloaderService";

import { AppDispatch, GetState } from "..";
import { catchErrorMessage, setMessage } from "./messageReducer";

export type DownloaderReducerState = {
  iracing: boolean | null;
  loading: boolean;
  simPreviewing: boolean;
  askingSimPreviewByLatest: boolean;
};

const initialState: DownloaderReducerState = {
  iracing: null,
  loading: false,
  simPreviewing: false,
  askingSimPreviewByLatest: false,
};

export const slice = createSlice({
  name: "downloaderReducer",
  initialState,
  reducers: {
    setIracing: (state, action: PayloadAction<boolean | null>) => {
      state.iracing = action.payload;
    },
    setDownloading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSimPreviewing: (state, action: PayloadAction<boolean>) => {
      state.simPreviewing = action.payload;
    },
    setAskingSimPreviewByLatest: (state, action: PayloadAction<boolean>) => {
      state.askingSimPreviewByLatest = action.payload;
    },
  },
});

export const {
  setIracing,
  setDownloading,
  setSimPreviewing,
  setAskingSimPreviewByLatest,
} = slice.actions;

export const getDownloaderStatus = (
  onSuccess?: () => void,
  onError?: () => void
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setDownloading(true));
  let downloaderStatus = null;
  try {
    const result = await DownloaderService.getDownloaderStatus();
    if (result) {
      downloaderStatus = result.iracing === "True";
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (onError) {
      onError();
    }
  }
  const iracing = getState().downloaderReducer.iracing;
  if (downloaderStatus !== iracing) {
    dispatch(setIracing(downloaderStatus));
  }
  dispatch(setDownloading(false));
};

export const submitSimPreview = (
  schemeID: number,
  isCustomNumber: number,
  payload: FormData
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setSimPreviewing(true));
  try {
    const result = await DownloaderService.submitSimPreview(
      schemeID,
      isCustomNumber,
      payload
    );
    if (result) {
      dispatch(
        setMessage({
          message: "Submitted Sim Preview Successfully!",
          type: "success",
        })
      );
    }
  } catch (err) {
    const iracing = getState().downloaderReducer.iracing;
    if (!iracing) {
      dispatch(setMessage({ message: "Downloader is not running!" }));
    } else {
      console.log("Error: ", err);
      dispatch(catchErrorMessage(err));
    }
  }
  dispatch(setSimPreviewing(false));
};

export default slice.reducer;
