import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { DefaultSettingsFormValues } from "src/components/dialogs/DefaultSettingsDialog/DefaultSettingsDialog.model";
import {
  mergeTwoScheme,
  parseScheme,
  stringifySchemeGuideData,
} from "src/helper";
import FavoriteSchemeService from "src/services/favoriteSchemeService";
import SchemeService from "src/services/schemeService";
import SharedSchemeService from "src/services/sharedSchemeService";
import { DefaultLayerData } from "src/types/common";
import { HistoryActions } from "src/types/enum";
import { BuilderScheme, CarMake, SharedScheme, User } from "src/types/model";
import {
  BuilderSchemeJSON,
  BuilderSchemeJSONForGetListByUserId,
  FavoriteSchemeForGetListByUserId,
  FavoriteSchemePayload,
  SharedSchemeForGetListByUserId,
  SharedSchemePayload,
  SharedSchemeWithUser,
} from "src/types/query";
import socketClient from "src/utils/socketClient";

import { AppDispatch, GetState } from "..";
import { updateUser } from "./authReducer";
import { setList as setBasePaintList } from "./basePaintReducer";
import { pushToActionHistory } from "./boardReducer";
import { setCurrent as setCurrentCarMake } from "./carMakeReducer";
import {
  setList as setLayerList,
  setLoadedStatusAll,
  updateLayer,
} from "./layerReducer";
import { catchErrorMessage, setMessage } from "./messageReducer";

export type SchemeReducerState = {
  list: BuilderSchemeJSONForGetListByUserId[];
  publicList: BuilderSchemeJSONForGetListByUserId[];
  favoriteList: FavoriteSchemeForGetListByUserId[];
  sharedList: SharedSchemeForGetListByUserId[];
  sharedUsers: SharedSchemeWithUser[];
  current?: BuilderSchemeJSON | null;
  owner?: User | null;
  lastModifier?: User | null;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  submittingShowroom: boolean;
  socketConnected: boolean;
};

const initialState: SchemeReducerState = {
  list: [],
  favoriteList: [],
  sharedList: [],
  publicList: [],
  sharedUsers: [],
  current: null,
  owner: null,
  lastModifier: null,
  loading: false,
  loaded: false,
  saving: false,
  submittingShowroom: false,
  socketConnected: true,
};

export const slice = createSlice({
  name: "schemeReducer",
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },
    setSubmittingShowroom: (state, action: PayloadAction<boolean>) => {
      state.submittingShowroom = action.payload;
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    setList: (
      state,
      action: PayloadAction<BuilderScheme[] | BuilderSchemeJSON[]>
    ) => {
      state.list = action.payload.map(
        (item) => parseScheme(item) as BuilderSchemeJSON
      ) as BuilderSchemeJSONForGetListByUserId[];
    },
    clearList: (state) => {
      state.list = [];
    },
    insertToList: (
      state,
      action: PayloadAction<BuilderScheme | BuilderSchemeJSON>
    ) => {
      state.list.push(
        parseScheme(action.payload) as BuilderSchemeJSONForGetListByUserId
      );
    },
    updateListItem: (
      state,
      action: PayloadAction<Partial<BuilderScheme | BuilderSchemeJSON>>
    ) => {
      const schemeList = [...state.list];
      const foundIndex = schemeList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        schemeList[foundIndex] = mergeTwoScheme(
          schemeList[foundIndex],
          action.payload
        ) as BuilderSchemeJSONForGetListByUserId;
        state.list = schemeList;
      }
    },
    deleteListItem: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((item) => item.id !== +action.payload);
    },
    setPublicList: (
      state,
      action: PayloadAction<BuilderScheme[] | BuilderSchemeJSON[]>
    ) => {
      state.publicList = action.payload.map(
        (item) => parseScheme(item) as BuilderSchemeJSON
      ) as BuilderSchemeJSONForGetListByUserId[];
    },
    clearPublicList: (state) => {
      state.publicList = [];
    },
    setFavoriteList: (
      state,
      action: PayloadAction<FavoriteSchemeForGetListByUserId[]>
    ) => {
      state.favoriteList = [...action.payload];
    },
    insertToFavoriteList: (
      state,
      action: PayloadAction<FavoriteSchemeForGetListByUserId>
    ) => {
      const favorite = { ...action.payload };
      state.favoriteList.push(favorite);
    },
    deleteFavoriteListItem: (state, action: PayloadAction<number>) => {
      state.favoriteList = state.favoriteList.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearFavoriteList: (state) => {
      state.favoriteList = [];
    },
    setSharedList: (
      state,
      action: PayloadAction<SharedSchemeForGetListByUserId[]>
    ) => {
      state.sharedList = [...action.payload];
    },
    updateSharedListItem: (
      state,
      action: PayloadAction<SharedSchemeForGetListByUserId>
    ) => {
      const sharedList = [...state.sharedList];
      const foundIndex = sharedList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        sharedList[foundIndex] = action.payload;
        state.sharedList = sharedList;
      }
    },
    deleteSharedListItem: (state, action: PayloadAction<number>) => {
      state.sharedList = state.sharedList.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearSharedList: (state) => {
      state.sharedList = [];
    },
    setSharedUsers: (state, action: PayloadAction<SharedSchemeWithUser[]>) => {
      state.sharedUsers = [...action.payload];
    },
    updateSharedUser: (state, action: PayloadAction<SharedSchemeWithUser>) => {
      const sharedUsers = [...state.sharedUsers];
      const foundIndex = sharedUsers.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        sharedUsers[foundIndex] = action.payload;
        state.sharedUsers = sharedUsers;
      }
    },
    insertToSharedUsers: (
      state,
      action: PayloadAction<SharedSchemeWithUser>
    ) => {
      const sharedUser = { ...action.payload };
      state.sharedUsers.push(sharedUser);
    },
    deleteSharedUser: (state, action: PayloadAction<number>) => {
      state.sharedUsers = state.sharedUsers.filter(
        (item) => item.id !== +action.payload
      );
    },
    clearSharedUsers: (state) => {
      state.sharedUsers = [];
    },
    setCurrent: (
      state,
      action: PayloadAction<Partial<BuilderScheme | BuilderSchemeJSON>>
    ) => {
      state.current = mergeTwoScheme(state.current, action.payload);
    },
    setOwner: (state, action: PayloadAction<User | null>) => {
      state.owner = action.payload;
    },
    setLastModifier: (state, action: PayloadAction<User | null>) => {
      state.lastModifier = action.payload;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
    setCurrentName: (state, action: PayloadAction<string>) => {
      if (state.current) {
        state.current = {
          ...state.current,
          name: action.payload,
        };
      }
    },
    setCurrentBaseColor: (state, action: PayloadAction<string>) => {
      if (state.current) {
        state.current = {
          ...state.current,
          base_color: action.payload,
        };
      }
    },
  },
});

const {
  setLoading,
  setList,
  insertToList,
  setSharedList,
  setFavoriteList,
  setPublicList,
  deleteFavoriteListItem,
  updateSharedListItem,
  deleteSharedListItem,
  setSharedUsers,
  updateSharedUser,
  deleteSharedUser,
  insertToSharedUsers,
  insertToFavoriteList,
} = slice.actions;
export const {
  setSaving,
  setSubmittingShowroom,
  setLoaded,
  setCurrent,
  setOwner,
  setLastModifier,
  updateListItem,
  deleteListItem,
  clearCurrent,
  clearList,
  clearFavoriteList,
  clearSharedList,
  clearSharedUsers,
  reset,
  setCurrentName,
  setCurrentBaseColor,
  setSocketConnected,
} = slice.actions;

export const getSchemeList = (userID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const schemes = await SchemeService.getSchemeListByUserID(userID);
    dispatch(setList(schemes.filter((scheme) => !scheme.carMake.deleted)));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const getPublicSchemeList = (callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const schemes = await SchemeService.getPublicSchemeList();
    dispatch(
      setPublicList(schemes.filter((scheme) => !scheme.carMake.deleted))
    );
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createScheme = (
  carMake: CarMake,
  name: string,
  userID: number,
  legacy_mode = false,
  onOpen?: (id: number) => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const scheme = await SchemeService.createScheme(
      carMake.id,
      name,
      userID,
      legacy_mode
    );
    dispatch(insertToList(scheme));
    if (onOpen) onOpen(scheme.id);
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const deleteAndCreateNewCarMakeLayers = (schemeID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const scheme = await SchemeService.renewCarMakeLayers(schemeID);
    dispatch(setLayerList(scheme.layers));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const getScheme = (
  schemeID: number,
  callback?: (scheme: BuilderScheme, sharedUsers: SharedScheme[]) => void,
  fallback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await SchemeService.getScheme(schemeID);
    dispatch(
      setCurrent(
        _.omit(result.scheme, [
          "carMake",
          "layers",
          "sharedUsers",
          "user",
          "lastModifier",
        ])
      )
    );
    dispatch(setOwner(result.scheme.user));
    dispatch(setLastModifier(result.scheme.lastModifier));
    dispatch(setCurrentCarMake(result.carMake));
    const loadedStatuses: Record<number, boolean> = {};
    result.layers.map((item) => (loadedStatuses[item.id] = false));
    dispatch(setLoadedStatusAll(loadedStatuses));
    dispatch(setLayerList(result.layers));
    dispatch(setBasePaintList(result.basePaints));
    callback?.(result.scheme, result.sharedUsers);
  } catch (err) {
    console.log("error: ", err);
    dispatch(setMessage({ message: "No Project with that ID!" }));
    fallback?.();
  }
  dispatch(setLoading(false));
};

export const updateScheme = (
  payload: Partial<BuilderSchemeJSON>,
  pushingToHistory = true,
  update_thumbnail = true
) => async (dispatch: AppDispatch, getState: GetState) => {
  try {
    const currentScheme = getState().schemeReducer.current;
    const currentUser = getState().authReducer.user;
    let updatedScheme;
    const payloadForSocket = {
      ...payload,
      date_modified: Math.round(new Date().getTime() / 1000),
      last_modified_by: currentUser?.id,
    };
    let foundScheme;
    if (currentScheme && currentScheme.id === payload.id) {
      foundScheme = currentScheme;
      updatedScheme = {
        ...currentScheme,
        ...payloadForSocket,
      };
      if (payloadForSocket.guide_data) {
        updatedScheme.guide_data = {
          ...currentScheme.guide_data,
          ...payloadForSocket.guide_data,
        };
      }

      if (update_thumbnail) {
        updatedScheme.thumbnail_updated = 0;
        updatedScheme.race_updated = 0;
      }
      dispatch(setCurrent(updatedScheme));
    } else {
      const schemeList = getState().schemeReducer.list;
      foundScheme = schemeList.find((item) => item.id === payload.id);
      updatedScheme = {
        ...foundScheme,
        ...payloadForSocket,
      };
      if (payloadForSocket.guide_data) {
        updatedScheme.guide_data = {
          ...(currentScheme?.guide_data ?? {}),
          ...payloadForSocket.guide_data,
        };
      }
    }

    socketClient.emit("client-update-scheme", {
      data: stringifySchemeGuideData(payloadForSocket),
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });

    dispatch(updateListItem(updatedScheme));
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.SCHEME_CHANGE_ACTION,
          prev_data: currentScheme,
          next_data: parseScheme(updatedScheme),
        })
      );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const deleteScheme = (schemeID: number, callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));

  try {
    dispatch(deleteListItem(schemeID));
    await SchemeService.deleteScheme(schemeID);

    callback?.();
    dispatch(
      setMessage({ message: "Deleted Project successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const cloneScheme = (
  schemeID: number,
  callback?: (schemeID?: number) => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const scheme = await SchemeService.cloneScheme(schemeID);
    dispatch(insertToList(scheme));
    dispatch(
      setMessage({ message: "Cloned Project successfully!", type: "success" })
    );
    callback?.(scheme.id);
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const getSharedUsers = (schemeID: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    const sharedUsers = await SharedSchemeService.getSharedSchemeListBySchemeID(
      schemeID
    );
    dispatch(setSharedUsers(sharedUsers));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const updateSharedUserItem = (
  id: number,
  payload: Partial<SharedSchemePayload>,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const shared = await SharedSchemeService.updateSharedScheme(id, payload);
    dispatch(updateSharedUser(shared));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const deleteSharedUserItem = (
  id: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    await SharedSchemeService.deleteSharedScheme(id);
    dispatch(deleteSharedUser(id));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const getSharedList = (userID: number, callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  try {
    const list = await SharedSchemeService.getSharedSchemeListByUserID(userID);
    dispatch(setSharedList(list));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  callback?.();
};

export const updateSharedItem = (
  id: number,
  payload: Partial<SharedSchemePayload>,
  callback?: () => void,
  fallback?: () => void
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const shared = await SharedSchemeService.updateSharedScheme(id, payload);
    dispatch(updateSharedListItem(shared));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
    fallback?.();
  }
  dispatch(setLoading(false));
};

export const deleteSharedItem = (id: number) => async (
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    await SharedSchemeService.deleteSharedScheme(id);
    dispatch(deleteSharedListItem(id));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const getFavoriteList = (
  userID: number,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const list = await FavoriteSchemeService.getFavoriteSchemeListByUserID(
      userID
    );
    dispatch(setFavoriteList(list));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  callback?.();
};

export const createFavoriteScheme = (
  payload: FavoriteSchemePayload,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const favoriteScheme = await FavoriteSchemeService.createFavoriteScheme(
      payload
    );
    dispatch(insertToFavoriteList(favoriteScheme));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const deleteFavoriteItem = (id: number, callback?: () => void) => async (
  dispatch: AppDispatch
) => {
  try {
    await FavoriteSchemeService.deleteFavoriteScheme(id);
    dispatch(deleteFavoriteListItem(id));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const createSharedUser = (
  payload: SharedSchemePayload,
  callback?: () => void
) => async (dispatch: AppDispatch) => {
  try {
    const sharedUser = await SharedSchemeService.createSharedScheme(payload);
    dispatch(insertToSharedUsers(sharedUser));
    callback?.();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const submitDefaultSetting = (
  guide_data: DefaultSettingsFormValues,
  callback?: () => void
) => async (dispatch: AppDispatch, getState: GetState) => {
  const currentScheme = getState().schemeReducer.current;
  const currentLayer = getState().layerReducer.current;
  const currentUser = getState().authReducer.user;

  if (!currentScheme) return;

  if (currentLayer) {
    dispatch(
      updateLayer({
        id: currentLayer.id,
        layer_data: {
          ...currentLayer.layer_data,
          color: guide_data.default_shape_color,
          opacity: guide_data.default_shape_opacity,
          scolor: guide_data.default_shape_scolor,
          stroke: guide_data.default_shape_stroke,
        } as DefaultLayerData,
      })
    );
  } else {
    dispatch(
      updateScheme({
        ...currentScheme,
        guide_data: {
          ...currentScheme.guide_data,
          ...guide_data,
        },
      })
    );
  }

  const saved_colors = JSON.stringify(guide_data.saved_colors);
  if (currentUser && currentUser.saved_colors !== saved_colors) {
    dispatch(
      updateUser({
        ...currentUser,
        saved_colors,
      })
    );
  }

  callback?.();
};

export default slice.reducer;
