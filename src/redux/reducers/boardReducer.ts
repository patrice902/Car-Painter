import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FrameSize, Position } from "src/types/common";
import {
  HistoryActions,
  MouseModes,
  PaintingGuides,
  ViewModes,
} from "src/types/enum";
import {
  BuilderLayerJSON,
  BuilderLayerPayload,
  BuilderSchemeJSON,
} from "src/types/query";

import { AppDispatch, GetState } from "..";
import {
  bulkUpdateLayer,
  createLayer,
  createLayerList,
  deleteLayer,
  deleteLayerList,
  updateLayer,
} from "./layerReducer";
import { updateScheme } from "./schemeReducer";

export type HistoryItem = {
  action: HistoryActions;
  data?: unknown;
  prev_data?: unknown;
  next_data?: unknown;
};

export type BoardReducerState = {
  frameSize: {
    width: number;
    height: number;
  };
  isAboveMobile: boolean;
  isDraggable: boolean;
  showProperties: boolean;
  showLayers: boolean;
  paintingGuides: PaintingGuides[];
  zoom: number;
  pressedKey?: string | null;
  pressedEventKey?: string | null;
  boardRotate: number;
  mouseMode: MouseModes;
  actionHistory: HistoryItem[];
  actionHistoryIndex: number;
  actionHistoryMoving: boolean;
  viewMode: ViewModes;
  downloadSpecTGA: boolean;
  specTGADataURL?: string | null;
  contextMenu?: Position | null;
};

const initialState: BoardReducerState = {
  frameSize: {
    width: 1024,
    height: 1024,
  },
  isAboveMobile: true,
  isDraggable: true,
  showProperties: true,
  showLayers: true,
  paintingGuides: [PaintingGuides.CARMASK],
  zoom: 1,
  pressedKey: null,
  pressedEventKey: null,
  boardRotate: 0,
  mouseMode: MouseModes.DEFAULT,
  actionHistory: [],
  actionHistoryIndex: -1,
  actionHistoryMoving: false,
  viewMode: ViewModes.NORMAL_VIEW,
  downloadSpecTGA: false,
  specTGADataURL: null,
  contextMenu: null,
};

export const slice = createSlice({
  name: "boardReducer",
  initialState,
  reducers: {
    reset: () => initialState,
    setFrameSize: (state, action: PayloadAction<FrameSize>) => {
      state.frameSize = action.payload;
    },
    clearFrameSize: (state) => {
      state.frameSize = initialState.frameSize;
    },
    setFrameSizeToMax: (state, action: PayloadAction<FrameSize>) => {
      const size = action.payload;
      const originSize = state.frameSize;
      state.frameSize = {
        width: Math.max(size.width, originSize.width),
        height: Math.max(size.height, originSize.height),
      };
    },
    setPressedKey: (state, action: PayloadAction<string | null>) => {
      state.pressedKey = action.payload;
    },
    setPressedEventKey: (state, action: PayloadAction<string | null>) => {
      state.pressedEventKey = action.payload;
    },
    setShowProperties: (state, action: PayloadAction<boolean>) => {
      state.showProperties = action.payload;
    },
    setShowLayers: (state, action: PayloadAction<boolean>) => {
      state.showLayers = action.payload;
    },
    setBoardRotate: (state, action: PayloadAction<number>) => {
      state.boardRotate = action.payload;
    },
    setPaintingGuides: (state, action: PayloadAction<PaintingGuides[]>) => {
      state.paintingGuides = [...action.payload];
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setMouseMode: (state, action: PayloadAction<MouseModes>) => {
      state.mouseMode = action.payload;
    },
    pushToActionHistory: (state, action: PayloadAction<HistoryItem>) => {
      let history = [...state.actionHistory];
      history = history.slice(0, state.actionHistoryIndex + 1);
      history.push(action.payload);
      state.actionHistory = history;
      state.actionHistoryIndex = state.actionHistory.length - 1;
    },
    setActionHistory: (state, action: PayloadAction<HistoryItem[]>) => {
      state.actionHistory = action.payload;
    },
    setActionHistoryIndex: (state, action: PayloadAction<number>) => {
      state.actionHistoryIndex = action.payload;
    },
    setActionHistoryMoving: (state, action: PayloadAction<boolean>) => {
      state.actionHistoryMoving = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewModes>) => {
      state.viewMode = action.payload;
    },
    setDownloadSpecTGA: (state, action: PayloadAction<boolean>) => {
      state.downloadSpecTGA = action.payload;
    },
    setSpecTGADataURL: (
      state,
      action: PayloadAction<string | undefined | null>
    ) => {
      state.specTGADataURL = action.payload;
    },
    setContextMenu: (
      state,
      action: PayloadAction<Position | undefined | null>
    ) => {
      state.contextMenu = action.payload;
    },
    setisAboveMobile: (state, action: PayloadAction<boolean>) => {
      state.isAboveMobile = action.payload;
    },
    setIsDraggalbe: (state, action: PayloadAction<boolean>) => {
      state.isDraggable = action.payload;
    },
  },
});

export const {
  setFrameSize,
  clearFrameSize,
  setFrameSizeToMax,
  setPaintingGuides,
  setZoom,
  setPressedKey,
  setPressedEventKey,
  setBoardRotate,
  setMouseMode,
  setShowProperties,
  setShowLayers,
  pushToActionHistory,
  setActionHistory,
  setActionHistoryIndex,
  setActionHistoryMoving,
  reset,
  setViewMode,
  setDownloadSpecTGA,
  setSpecTGADataURL,
  setContextMenu,
  setisAboveMobile,
  setIsDraggalbe,
} = slice.actions;

export default slice.reducer;

export const historyActionBack = () => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  const actionHistory = getState().boardReducer.actionHistory;
  const actionHistoryIndex = getState().boardReducer.actionHistoryIndex;
  const actionHistoryMoving = getState().boardReducer.actionHistoryMoving;
  if (actionHistoryMoving) {
    return;
  }
  if (actionHistoryIndex > -1) {
    switch (actionHistory[actionHistoryIndex].action) {
      case HistoryActions.LAYER_CHANGE_ACTION:
        dispatch(
          updateLayer(
            actionHistory[actionHistoryIndex].prev_data as BuilderLayerJSON,
            false
          )
        );
        break;
      case HistoryActions.LAYER_BULK_CHANGE_ACTION:
        dispatch(
          bulkUpdateLayer(
            actionHistory[actionHistoryIndex].prev_data as BuilderLayerJSON[],
            false
          )
        );
        break;
      case HistoryActions.LAYER_ADD_ACTION:
        dispatch(
          deleteLayer(
            actionHistory[actionHistoryIndex].data as BuilderLayerJSON,
            false
          )
        );
        break;
      case HistoryActions.LAYER_DELETE_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayer(
            actionHistory[actionHistoryIndex].data as BuilderLayerPayload,
            false,
            () => {
              dispatch(setActionHistoryMoving(false));
            }
          )
        );
        break;
      case HistoryActions.LAYER_LIST_ADD_ACTION:
        dispatch(
          deleteLayerList(
            actionHistory[actionHistoryIndex].data as BuilderLayerJSON[],
            false
          )
        );
        break;
      case HistoryActions.LAYER_LIST_DELETE_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayerList(
            actionHistory[actionHistoryIndex].data as BuilderLayerPayload[],
            false,
            () => {
              dispatch(setActionHistoryMoving(false));
            }
          )
        );
        break;
      case HistoryActions.SCHEME_CHANGE_ACTION:
        dispatch(
          updateScheme(
            actionHistory[actionHistoryIndex].prev_data as BuilderSchemeJSON,
            false
          )
        );
        break;
      default:
        break;
    }
    dispatch(setActionHistoryIndex(actionHistoryIndex - 1));
  }
};

export const historyActionUp = () => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  const actionHistory = getState().boardReducer.actionHistory;
  const actionHistoryIndex = getState().boardReducer.actionHistoryIndex;
  const actionHistoryMoving = getState().boardReducer.actionHistoryMoving;
  if (actionHistoryMoving) {
    return;
  }

  if (
    actionHistory.length > 0 &&
    actionHistoryIndex < actionHistory.length - 1
  ) {
    switch (actionHistory[actionHistoryIndex + 1].action) {
      case HistoryActions.LAYER_CHANGE_ACTION:
        dispatch(
          updateLayer(
            actionHistory[actionHistoryIndex + 1].next_data as BuilderLayerJSON,
            false
          )
        );
        break;
      case HistoryActions.LAYER_BULK_CHANGE_ACTION:
        dispatch(
          bulkUpdateLayer(
            actionHistory[actionHistoryIndex + 1]
              .next_data as BuilderLayerJSON[],
            false
          )
        );
        break;
      case HistoryActions.LAYER_ADD_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayer(
            actionHistory[actionHistoryIndex + 1].data as BuilderLayerPayload,
            false,
            () => {
              dispatch(setActionHistoryMoving(false));
            }
          )
        );
        break;
      case HistoryActions.LAYER_DELETE_ACTION:
        dispatch(
          deleteLayer(
            actionHistory[actionHistoryIndex + 1].data as BuilderLayerJSON,
            false
          )
        );
        break;
      case HistoryActions.LAYER_LIST_ADD_ACTION:
        dispatch(setActionHistoryMoving(true));
        dispatch(
          createLayerList(
            actionHistory[actionHistoryIndex + 1].data as BuilderLayerPayload[],
            false,
            () => {
              dispatch(setActionHistoryMoving(false));
            }
          )
        );
        break;
      case HistoryActions.LAYER_LIST_DELETE_ACTION:
        dispatch(
          deleteLayerList(
            actionHistory[actionHistoryIndex + 1].data as BuilderLayerJSON[],
            false
          )
        );
        break;
      case HistoryActions.SCHEME_CHANGE_ACTION:
        dispatch(
          updateScheme(
            actionHistory[actionHistoryIndex + 1]
              .next_data as BuilderSchemeJSON,
            false
          )
        );
        break;
      default:
        break;
    }
    dispatch(setActionHistoryIndex(actionHistoryIndex + 1));
  }
};
