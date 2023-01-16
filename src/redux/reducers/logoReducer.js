import { createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./messageReducer";
import LogoService from "services/logoService";
import { modifyFileName } from "helper";

const initialState = {
  list: [],
  current: null,
  loading: false,
};

export const slice = createSlice({
  name: "logoReducer",
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
} = slice.actions;

export default slice.reducer;

export const getLogoList = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const overlays = await LogoService.getLogoList();
    dispatch(setList(overlays));
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};

export const uploadAndCreateLogo = (
  { name, source_file, preview_file, type, active, enable_color },
  callback
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("active", active);
    formData.append("enable_color", enable_color);

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

    if (callback) callback();
  } catch (err) {
    dispatch(setMessage({ message: err.message }));
  }
  dispatch(setLoading(false));
};
