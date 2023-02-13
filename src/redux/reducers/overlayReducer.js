import { createSlice } from "@reduxjs/toolkit";
import { modifyFileName } from "helper";
import OverlayService from "services/overlayService";

import { setMessage } from "./messageReducer";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "overlayReducer",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    insertToList: (state, action) => {
      state.list.push(action.payload);
    },
    concatList: (state, action) => {
      state.list = state.list.concat(action.payload);
    },
    updateListItem: (state, action) => {
      let overlayList = [...state.list];
      let foundIndex = overlayList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        overlayList[foundIndex] = action.payload;
        state.list = overlayList;
      }
    },
    deleteListItem: (state, action) => {
      let overlayList = [...state.list];
      let foundIndex = overlayList.findIndex(
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
    setCurrent: (state, action) => {
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

export const getOverlayList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const overlays = await OverlayService.getOverlayList();
    dispatch(setList(overlays));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndCreateOverlay = (
  { name, overlay_file, overlay_thumb, color, stroke_scale, legacy_mode },
  callback
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("stroke_scale", stroke_scale);
    formData.append("legacy_mode", legacy_mode);

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

    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndUpdateOverlay = (
  id,
  { name, overlay_file, overlay_thumb, color, stroke_scale, legacy_mode },
  callback
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("stroke_scale", stroke_scale);
    formData.append("legacy_mode", legacy_mode);

    const fileNames = [];
    fileNames.push(overlay_file ? modifyFileName(overlay_file) : undefined);
    fileNames.push(overlay_thumb ? modifyFileName(overlay_thumb) : undefined);
    formData.append("fileNames", JSON.stringify(fileNames));

    if (overlay_file) formData.append("overlay_file", overlay_file);
    if (overlay_thumb) formData.append("overlay_thumb", overlay_thumb);

    const overlay = await OverlayService.uploadAndUpdate(id, formData);
    dispatch(updateListItem({ id, ...overlay }));
    dispatch(
      setMessage({
        message: `Update a graphic successfully!`,
        type: "success",
      })
    );

    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const deleteOverlay = (id, callback) => async (dispatch) => {
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

    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
