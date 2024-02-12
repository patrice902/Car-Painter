import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import config from "src/config";
import { AllowedLayerProps, DefaultLayer } from "src/constant";
import {
  clearScrollPosition,
  decodeHtml,
  fitPoints,
  getAllowedLayerTypes,
  getNameFromUploadFileName,
  mergeTwoLayer,
  parseLayer,
  rotatePoint,
  stringifyLayerData,
} from "src/helper";
import LayerService from "src/services/layerService";
import {
  CarObjLayerData,
  DraftShapeLayerJSON,
  LineObjLayerData,
  MovableObjLayerData,
  Position,
  ShapeBaseObjLayerData,
  TextObjLayerData,
  UploadObjLayerData,
} from "src/types/common";
import {
  DrawingStatus,
  HistoryActions,
  LayerTypes,
  MouseModes,
} from "src/types/enum";
import {
  BuilderBase,
  BuilderBaseDataItem,
  BuilderLayer,
  BuilderLogo,
  BuilderOverlay,
  BuilderUpload,
} from "src/types/model";
import { BuilderLayerJSON, BuilderLayerPayload } from "src/types/query";
import socketClient from "src/utils/socketClient";

import { AppDispatch, GetState } from "..";
import { pushToActionHistory } from "./boardReducer";
import { catchErrorMessage, setMessage } from "./messageReducer";

export type LayerReducerState = {
  list: BuilderLayerJSON[];
  current: BuilderLayerJSON | null;
  hoveredJSON: Record<number, boolean>;
  clipboard: BuilderLayerJSON | null;
  cloningLayer: BuilderLayerJSON | null;
  cloningQueue: BuilderLayerJSON[];
  drawingStatus: DrawingStatus | null;
  loadedStatuses: Record<string | number, boolean>;
  loading: boolean;
};

const initialState: LayerReducerState = {
  list: [],
  current: null,
  hoveredJSON: {},
  clipboard: null,
  cloningLayer: null,
  cloningQueue: [],
  drawingStatus: null,
  loadedStatuses: {},
  loading: false,
};

export const slice = createSlice({
  name: "layerReducer",
  initialState,
  reducers: {
    reset: () => initialState,
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (
      state,
      action: PayloadAction<BuilderLayer[] | BuilderLayerJSON[]>
    ) => {
      state.list = action.payload.map((item) => parseLayer(item));
    },
    insertToList: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON>
    ) => {
      state.list.push(parseLayer(action.payload));
    },
    concatList: (
      state,
      action: PayloadAction<BuilderLayer[] | BuilderLayerJSON[]>
    ) => {
      state.list = state.list.concat(
        action.payload.map((item) => parseLayer(item))
      );
    },
    updateListItem: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON>
    ) => {
      const layerList = [...state.list];
      const foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        layerList[foundIndex] = parseLayer(action.payload);
        state.list = layerList;
      }
    },
    mergeListItemOnly: (
      state,
      action: PayloadAction<Partial<BuilderLayer | BuilderLayerJSON>>
    ) => {
      const layerList = [...state.list];
      const foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        const newLayer = mergeTwoLayer(
          layerList[foundIndex],
          action.payload as BuilderLayerJSON
        ) as BuilderLayerJSON;
        layerList[foundIndex] = newLayer;
        state.list = layerList;
      }
    },
    mergeListItem: (
      state,
      action: PayloadAction<Partial<BuilderLayer | BuilderLayerJSON>>
    ) => {
      const layerList = [...state.list];
      const foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        const newLayer = mergeTwoLayer(
          layerList[foundIndex],
          action.payload as BuilderLayerJSON
        ) as BuilderLayerJSON;
        layerList[foundIndex] = newLayer;
        state.list = layerList;

        if (state.current && state.current.id === newLayer.id) {
          state.current = newLayer;
        }
      }
    },
    mergeListItems: (
      state,
      action: PayloadAction<BuilderLayer[] | BuilderLayerJSON[]>
    ) => {
      const layerList = [...state.list];
      for (const layerItem of action.payload) {
        const foundIndex = layerList.findIndex(
          (item) => item.id === layerItem.id
        );
        if (foundIndex !== -1) {
          const newLayer = mergeTwoLayer(
            layerList[foundIndex],
            layerItem
          ) as BuilderLayerJSON;
          layerList[foundIndex] = newLayer;

          if (state.current && state.current.id === newLayer.id) {
            state.current = newLayer;
          }
        }
      }
      state.list = layerList;
    },
    deleteItemsByUploadID: (state, action: PayloadAction<number>) => {
      const layerList = [...state.list];
      state.list = layerList.filter(
        (item) =>
          item.layer_type !== LayerTypes.UPLOAD ||
          (item.layer_data as UploadObjLayerData).id !== action.payload
      );
    },
    deleteListItem: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON>
    ) => {
      const layerList = [...state.list];
      const foundIndex = layerList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (foundIndex !== -1) {
        layerList.splice(foundIndex, 1);
        state.list = layerList;
      }
      if (state.current && state.current.id === action.payload.id) {
        state.current = null;
      }
    },
    deleteListItems: (
      state,
      action: PayloadAction<(BuilderLayer | BuilderLayerJSON)[]>
    ) => {
      const layerList = [...state.list];
      state.list = layerList.filter((layer) =>
        action.payload.every((item) => item.id !== layer.id)
      );
      if (
        state.current &&
        action.payload.some((item) => item.id === state.current?.id)
      ) {
        state.current = null;
      }
    },
    setCurrent: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON | null>
    ) => {
      state.current = action.payload && parseLayer(action.payload);
    },
    mergeCurrent: (
      state,
      action: PayloadAction<Partial<BuilderLayer | BuilderLayerJSON>>
    ) => {
      state.current = mergeTwoLayer(
        state.current,
        action.payload as BuilderLayerJSON
      );
    },
    clearCurrent: (state) => {
      state.current = null;
    },
    setHoveredJSON: (state, action: PayloadAction<Record<number, boolean>>) => {
      state.hoveredJSON = action.payload;
    },
    setHoveredJSONItem: (
      state,
      action: PayloadAction<{ key: number; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state.hoveredJSON[key] = value;
    },
    setClipboard: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON | null>
    ) => {
      state.clipboard = action.payload && parseLayer(action.payload);
    },
    setCloningLayer: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON | null>
    ) => {
      state.cloningLayer = action.payload && parseLayer(action.payload);
    },
    setDrawingStatus: (state, action: PayloadAction<DrawingStatus | null>) => {
      state.drawingStatus = action.payload;
    },
    setLoadedStatusAll: (
      state,
      action: PayloadAction<Record<string | number, boolean>>
    ) => {
      state.loadedStatuses = action.payload;
    },
    setLoadedStatus: (
      state,
      action: PayloadAction<{ key: string | number; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state.loadedStatuses[key] = value;
    },
    insertToCloningQueue: (
      state,
      action: PayloadAction<BuilderLayer | BuilderLayerJSON>
    ) => {
      state.cloningQueue.push(parseLayer(action.payload));
    },
    deleteCloningQueueByID: (state, action: PayloadAction<string | number>) => {
      const cloningQueue = [...state.cloningQueue];
      state.cloningQueue = cloningQueue.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

const { setLoading } = slice.actions;
export const {
  setCurrent,
  mergeCurrent,
  setList,
  setDrawingStatus,
  insertToList,
  concatList,
  updateListItem,
  mergeListItem,
  mergeListItemOnly,
  mergeListItems,
  deleteListItem,
  deleteListItems,
  setClipboard,
  setCloningLayer,
  setHoveredJSON,
  setHoveredJSONItem,
  deleteItemsByUploadID,
  setLoadedStatusAll,
  setLoadedStatus,
  clearCurrent,
  reset,
  insertToCloningQueue,
  deleteCloningQueueByID,
} = slice.actions;

export default slice.reducer;

const shiftSimilarLayerOrders = (layer_type: LayerTypes, offset = 1) => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  const currentUser = getState().authReducer.user;
  const layerList = getState().layerReducer.list;
  const currentScheme = getState().schemeReducer.current;
  let filter: LayerTypes[] = [];

  if (currentScheme?.merge_layers) {
    if ([LayerTypes.BASE].includes(layer_type)) {
      filter = [LayerTypes.BASE];
    } else if (
      [
        LayerTypes.SHAPE,
        LayerTypes.OVERLAY,
        LayerTypes.LOGO,
        LayerTypes.TEXT,
        LayerTypes.UPLOAD,
      ].includes(layer_type)
    ) {
      filter = [
        LayerTypes.SHAPE,
        LayerTypes.OVERLAY,
        LayerTypes.LOGO,
        LayerTypes.TEXT,
        LayerTypes.UPLOAD,
      ];
    }
  } else {
    if ([LayerTypes.BASE].includes(layer_type)) {
      filter = [LayerTypes.BASE];
    } else if ([LayerTypes.SHAPE].includes(layer_type)) {
      filter = [LayerTypes.SHAPE];
    } else if ([LayerTypes.OVERLAY].includes(layer_type)) {
      filter = [LayerTypes.OVERLAY];
    } else if (
      [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(layer_type)
    ) {
      filter = [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD];
    }
  }

  const filteredLayers = layerList.filter((layerItem) =>
    filter.includes(layerItem.layer_type)
  );
  for (const layerItem of filteredLayers) {
    dispatch(
      mergeListItem({
        ...layerItem,
        layer_order: layerItem.layer_order + offset,
      })
    );
    socketClient.emit("client-update-layer", {
      data: {
        ...layerItem,
        layer_order: layerItem.layer_order + offset,
      },
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });
  }
};

export const reorderLayersOnCombination = () => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  const layerList = getState().layerReducer.list;
  const filteredLayers = layerList.filter((layerItem) =>
    [
      LayerTypes.OVERLAY,
      LayerTypes.LOGO,
      LayerTypes.UPLOAD,
      LayerTypes.SHAPE,
      LayerTypes.TEXT,
    ].includes(layerItem.layer_type)
  );
  const orderMap = {
    [LayerTypes.LOGO]: 0,
    [LayerTypes.UPLOAD]: 0,
    [LayerTypes.TEXT]: 0,
    [LayerTypes.SHAPE]: 1,
    [LayerTypes.OVERLAY]: 2,
  };
  const sortedLayers = _.sortBy(filteredLayers, [
    (o) =>
      orderMap[o.layer_type as keyof typeof orderMap] * 100 + o.layer_order,
  ]).map((layer, index) => ({ ...layer, layer_order: index + 1 }));

  dispatch(bulkUpdateLayer(sortedLayers, false));
};

export const createLayer = (
  layerInfo: BuilderLayerPayload,
  pushingToHistory = true,
  callback?: () => void
) => async (dispatch: AppDispatch, getState: GetState) => {
  const currentUser = getState().authReducer.user;
  const layer = await LayerService.createLayer(
    stringifyLayerData(layerInfo) as BuilderLayerPayload
  );
  socketClient.emit("client-create-layer", {
    data: layer,
    socketID: socketClient.socket?.id,
    userID: currentUser?.id,
  });

  dispatch(shiftSimilarLayerOrders(layer.layer_type));

  clearScrollPosition();

  dispatch(insertToList(layer));
  if (layer.layer_type !== LayerTypes.BASE) {
    dispatch(setCurrent(layer));
  }
  if (pushingToHistory) {
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_ADD_ACTION,
        data: parseLayer(layer),
      })
    );
  }
  callback?.();
};

export const createLayerList = (
  layersInfo: BuilderLayerPayload[],
  pushingToHistory = true,
  callback?: (layers?: BuilderLayer[]) => void
) => async (dispatch: AppDispatch, getState: GetState) => {
  const currentUser = getState().authReducer.user;
  const layers: BuilderLayer[] = [];
  for (const layerInfoItem of layersInfo) {
    layers.push(
      await LayerService.createLayer(
        stringifyLayerData(layerInfoItem) as BuilderLayerPayload
      )
    );
  }

  socketClient.emit("client-create-layer-list", {
    data: layers,
    socketID: socketClient.socket?.id,
    userID: currentUser?.id,
  });

  dispatch(shiftSimilarLayerOrders(layers[0].layer_type, layers.length));

  clearScrollPosition();

  dispatch(concatList(layers));
  if (pushingToHistory) {
    dispatch(
      pushToActionHistory({
        action: HistoryActions.LAYER_LIST_ADD_ACTION,
        data: layers.map((layer) => parseLayer(layer)),
      })
    );
  }

  callback?.(layers);
};

export const createLayersFromBasePaint = (
  schemeID: number,
  basePaintIndex: number
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const baseData = Array.from({ length: 3 }, (_, i) => i + 1); // There are 3 basepaints for each carMake.

    const layers: BuilderLayerPayload[] = [];
    let index = 0;
    for (const base_item of baseData) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.BASE];
      const layer: BuilderLayerPayload = {
        ...DefaultLayer,
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        layer_order: baseData.length - index,
        layer_data: JSON.stringify({
          ..._.pick(
            { ...DefaultLayer.layer_data },
            AllowedLayerTypes.filter((item) =>
              item.includes("layer_data.")
            ).map((item) => item.replaceAll("layer_data.", ""))
          ),
          name: `Base Pattern ${base_item}`,
          basePaintIndex,
          img: `${base_item}.png`,
          opacity: 1,
          color:
            base_item === 1
              ? "#ff0000"
              : base_item === 2
              ? "#00ff00"
              : "#0000ff",
        }),
      };
      layers.push(layer);
      index++;
    }
    dispatch(createLayerList(layers));
  } catch (err) {
    if (config.env === "development") {
      console.log("Error on [createLayersFromBasePaint]: ", err);
    }
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createLayersFromLegacyBasePaint = (
  schemeID: number,
  basePaintItem: BuilderBase
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const baseData = (basePaintItem.base_data as BuilderBaseDataItem[]) ?? [];

    const layers: BuilderLayerPayload[] = [];
    let index = 0;
    for (const base_item of baseData) {
      const AllowedLayerTypes = AllowedLayerProps[LayerTypes.BASE];
      const layer: BuilderLayerPayload = {
        ...DefaultLayer,
        layer_type: LayerTypes.BASE,
        scheme_id: schemeID,
        layer_order: baseData.length - index,
        layer_data: JSON.stringify({
          ..._.pick(
            {
              ...DefaultLayer.layer_data,
              ...base_item,
            },
            AllowedLayerTypes.filter((item) =>
              item.includes("layer_data.")
            ).map((item) => item.replaceAll("layer_data.", ""))
          ),
          id: basePaintItem.id,
          img: base_item.img,
          opacity: 1,
        }),
      };
      layers.push(layer);
      index++;
    }
    dispatch(createLayerList(layers));
  } catch (err) {
    if (config.env === "development") {
      console.log("Error on [createLayersFromLegacyBasePaint]: ", err);
    }
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createLayerFromOverlay = (
  schemeID: number,
  shape: BuilderOverlay,
  position: Position
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const guide_data = getState().schemeReducer.current?.guide_data;

    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.OVERLAY];
    const layer = {
      ...DefaultLayer,
      layer_type: LayerTypes.OVERLAY,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replaceAll("layer_data.", ""))
        ),
        id: shape.id,
        name: shape.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: shape.overlay_file,
        preview_file: shape.overlay_thumb,
        sizeLocked: false,
        color: guide_data?.default_shape_color ?? DefaultLayer.layer_data.color,
        opacity:
          guide_data?.default_shape_opacity ??
          (DefaultLayer.layer_data.opacity || 1),
        scolor:
          guide_data?.default_shape_scolor ?? DefaultLayer.layer_data.scolor,
        stroke:
          guide_data?.default_shape_stroke ??
          (DefaultLayer.layer_data.stroke || 1),
        stroke_scale: shape.stroke_scale,
      }),
    };
    dispatch(createLayer(layer));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createLayerFromLogo = (
  schemeID: number,
  logo: BuilderLogo,
  position: Position
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.LOGO];
    const layer = {
      ...DefaultLayer,
      layer_type: LayerTypes.LOGO,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replaceAll("layer_data.", ""))
        ),
        id: logo.id,
        name: logo.name,
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: logo.source_file,
        preview_file: logo.preview_file,
      }),
    };
    dispatch(createLayer(layer));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createLayerFromUpload = (
  schemeID: number,
  upload: BuilderUpload,
  position: Position
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.UPLOAD];
    const layer = {
      ...DefaultLayer,
      layer_type: LayerTypes.UPLOAD,
      scheme_id: schemeID,
      upload_id: upload.id,
      layer_data: JSON.stringify({
        ..._.pick(
          DefaultLayer.layer_data,
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replaceAll("layer_data.", ""))
        ),
        id: upload.id,
        name: getNameFromUploadFileName(upload.file_name, upload.user_id),
        rotation: -boardRotate,
        left: position.x,
        top: position.y,
        source_file: upload.file_name,
        preview_file: upload.file_name,
        fromOldSource: upload.legacy_mode,
      }),
    };
    dispatch(createLayer(layer));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const createTextLayer = (
  schemeID: number,
  textObj: TextObjLayerData,
  position: Position
) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true));

  try {
    const boardRotate = getState().boardReducer.boardRotate;
    const AllowedLayerTypes = AllowedLayerProps[LayerTypes.TEXT];
    const layer = {
      ...DefaultLayer,
      layer_type: LayerTypes.TEXT,
      scheme_id: schemeID,
      layer_data: JSON.stringify({
        ..._.pick(
          { ...DefaultLayer.layer_data, ...textObj },
          AllowedLayerTypes.filter((item) =>
            item.includes("layer_data.")
          ).map((item) => item.replaceAll("layer_data.", ""))
        ),
        name: decodeHtml(textObj.text),
        rotation: textObj.rotation - boardRotate,
        left: position.x,
        top: position.y,
      }),
    };
    dispatch(createLayer(layer));
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export type CloneLayerProps = {
  layerToClone: BuilderLayerJSON<MovableObjLayerData>;
  samePosition?: boolean;
  pushingToHistory?: boolean;
  centerPosition?: Position;
  mirrorRotation?: boolean;
  callback?: () => void;
};

export const cloneLayer = ({
  layerToClone,
  samePosition = false,
  pushingToHistory = true,
  centerPosition,
  mirrorRotation = false,
  callback,
}: CloneLayerProps) => async (dispatch: AppDispatch, getState: GetState) => {
  if (layerToClone) {
    dispatch(setLoading(true));
    try {
      const boardRotate = getState().boardReducer.boardRotate;
      const offset = rotatePoint(
        layerToClone.layer_data.width ? -layerToClone.layer_data.width / 2 : 0,
        layerToClone.layer_data.height
          ? -layerToClone.layer_data.height / 2
          : 0,
        mirrorRotation ? 180 - boardRotate : boardRotate
      );

      let newRotation = layerToClone.layer_data.rotation ?? 0;
      if (mirrorRotation) {
        if ((newRotation + 90) % 180 === 0) {
          newRotation = -newRotation;
        } else {
          newRotation = 180 - newRotation;
        }
      }

      const layer = {
        ..._.omit(layerToClone, ["id"]),
        layer_order: 1,
        layer_locked: 0,
        layer_data: JSON.stringify({
          ...layerToClone.layer_data,
          name: layerToClone.layer_data.name + " copy",
          left: samePosition
            ? layerToClone.layer_data.left
            : (centerPosition?.x ?? 0) + offset.x,
          top: samePosition
            ? layerToClone.layer_data.top
            : (centerPosition?.y ?? 0) + offset.y,
          rotation: newRotation,
        }),
      };
      dispatch(createLayer(layer, pushingToHistory, callback));
    } catch (err) {
      dispatch(catchErrorMessage(err));
    }
    dispatch(setLoading(false));
  }
};

export const cloneCarPartsLayer = (
  layersToClone: BuilderLayerJSON<CarObjLayerData>[],
  legacyMode?: boolean | null,
  callback?: (layers?: BuilderLayer[]) => void
) => async (dispatch: AppDispatch) => {
  if (layersToClone.length) {
    dispatch(setLoading(true));
    try {
      const layers = layersToClone.map((layer, index) => ({
        ..._.omit(layer, ["id"]),
        layer_type: LayerTypes.LOGO,
        layer_order: index + 1,
        layer_locked: 1,
        layer_data: JSON.stringify({
          ...layer.layer_data,
          left: 0,
          top: 0,
          width: legacyMode ? 1024 : 2048,
          height: legacyMode ? 1024 : 2048,
          fromCarParts: true,
        }),
      }));

      dispatch(shiftSimilarLayerOrders(LayerTypes.LOGO, layers.length));

      dispatch(createLayerList(layers, true, callback));
    } catch (err) {
      dispatch(catchErrorMessage(err));
    }
    dispatch(setLoading(false));
  }
};

export const createShape = (
  schemeID: number,
  newlayer: DraftShapeLayerJSON
) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const AllowedLayerTypes =
      AllowedLayerProps[LayerTypes.SHAPE][
        newlayer.layer_data
          .type as keyof typeof AllowedLayerProps[LayerTypes.SHAPE]
      ];
    const layerData = _.pick(
      {
        ...DefaultLayer.layer_data,
        ...newlayer.layer_data,
      },
      AllowedLayerTypes.filter((item) =>
        item.includes("layer_data.")
      ).map((item) => item.replaceAll("layer_data.", ""))
    ) as ShapeBaseObjLayerData;
    if (
      [
        MouseModes.PEN,
        MouseModes.LINE,
        MouseModes.POLYGON,
        MouseModes.ARROW,
      ].includes(layerData.type as MouseModes)
    ) {
      const { leftTopOffset, newPoints } = fitPoints(
        (layerData as LineObjLayerData).points
      );
      layerData.left = (layerData.left ?? 0) + leftTopOffset.x;
      layerData.top = (layerData.top ?? 0) + leftTopOffset.y;
      (layerData as LineObjLayerData).points = newPoints;
    }
    const layer = {
      ...DefaultLayer,
      ...newlayer,
      layer_type: LayerTypes.SHAPE,
      scheme_id: schemeID,
      layer_data: JSON.stringify(layerData),
    };
    dispatch(
      createLayer(layer, true, () =>
        dispatch(setDrawingStatus(DrawingStatus.CLEAR_COMMAND))
      )
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  dispatch(setLoading(false));
};

export const updateLayer = (
  layer: Partial<BuilderLayerJSON>,
  pushingToHistory = true,
  _previousLayer?: BuilderLayerJSON
) => async (dispatch: AppDispatch, getState: GetState) => {
  // dispatch(setLoading(true));
  try {
    const currentUser = getState().authReducer.user;
    const previousLayer =
      _previousLayer ??
      getState().layerReducer.list.find((item) => item.id === layer.id);
    const allowedLayerTypes = getAllowedLayerTypes(previousLayer);
    const pickedDefaultLayer = _.pick(
      {
        ...DefaultLayer,
        layer_data: _.pick(
          DefaultLayer.layer_data,
          allowedLayerTypes
            .filter((item) => item.includes("layer_data."))
            .map((item) => item.replaceAll("layer_data.", ""))
        ),
      },
      allowedLayerTypes.filter((item) => !item.includes("layer_data."))
    );
    const previousLayerWithDefault = {
      ...pickedDefaultLayer,
      ...previousLayer,
      layer_data: {
        ...pickedDefaultLayer.layer_data,
        ...previousLayer?.layer_data,
      },
    };

    dispatch(mergeListItem(layer));
    const currentLayer = getState().layerReducer.current;
    if (currentLayer && currentLayer.id === layer.id) {
      dispatch(mergeCurrent(layer));
    }
    // await LayerService.updateLayer(configuredLayer.id, {
    //   ...configuredLayer,
    //   layer_data: JSON.stringify(configuredLayer.layer_data),
    // });
    const layerForSocket = stringifyLayerData(layer as BuilderLayerJSON);

    socketClient.emit("client-update-layer", {
      data: layerForSocket,
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });

    if (pushingToHistory) {
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_CHANGE_ACTION,
          prev_data: previousLayerWithDefault,
          next_data: {
            ...previousLayerWithDefault,
            ...layer,
          },
        })
      );
    }
    clearScrollPosition();
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  // dispatch(setLoading(false));
};

export const bulkUpdateLayer = (
  layerList: Partial<BuilderLayerJSON>[],
  pushingToHistory = true
) => async (dispatch: AppDispatch, getState: GetState) => {
  try {
    const currentUser = getState().authReducer.user;

    const previousLayers = [];
    const layerListForSocket = [];
    for (const layer of layerList) {
      previousLayers.push(
        getState().layerReducer.list.find((item) => item.id === layer.id)
      );

      dispatch(mergeListItem(layer));
      const currentLayer = getState().layerReducer.current;
      if (currentLayer && currentLayer.id === layer.id) {
        dispatch(mergeCurrent(layer));
      }

      const layerForSocket = stringifyLayerData(layer);

      layerListForSocket.push(layerForSocket);
    }

    socketClient.emit("client-bulk-update-layer", {
      data: layerListForSocket,
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });

    if (pushingToHistory) {
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_BULK_CHANGE_ACTION,
          prev_data: previousLayers,
          next_data: layerList,
        })
      );
    }
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
};

export const updateLayerOnly = (layer: Partial<BuilderLayerJSON>) => async (
  dispatch: AppDispatch,
  getState: GetState
) => {
  dispatch(mergeListItem(layer));
  const currentLayer = getState().layerReducer.current;
  if (currentLayer && currentLayer.id === layer.id) {
    dispatch(mergeCurrent(layer));
  }
};

export const deleteLayer = (
  layer: BuilderLayerJSON,
  pushingToHistory = true
) => async (dispatch: AppDispatch, getState: GetState) => {
  // dispatch(setLoading(true));

  try {
    const currentUser = getState().authReducer.user;

    dispatch(deleteListItem(layer));
    dispatch(setCurrent(null));
    // await LayerService.deleteLayer(layer.id);
    socketClient.emit("client-delete-layer", {
      data: { ...layer },
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_DELETE_ACTION,
          data: layer,
        })
      );
    dispatch(
      setMessage({ message: "Deleted Layer successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  // dispatch(setLoading(false));
};

export const deleteLayerList = (
  layerList: BuilderLayerJSON[],
  pushingToHistory = true
) => async (dispatch: AppDispatch, getState: GetState) => {
  // dispatch(setLoading(true));

  try {
    const currentUser = getState().authReducer.user;

    dispatch(deleteListItems(layerList));
    dispatch(setCurrent(null));
    socketClient.emit("client-delete-layer-list", {
      data: layerList,
      socketID: socketClient.socket?.id,
      userID: currentUser?.id,
    });
    if (pushingToHistory)
      dispatch(
        pushToActionHistory({
          action: HistoryActions.LAYER_LIST_DELETE_ACTION,
          data: layerList,
        })
      );
    dispatch(
      setMessage({ message: "Deleted Layer successfully!", type: "success" })
    );
  } catch (err) {
    dispatch(catchErrorMessage(err));
  }
  // dispatch(setLoading(false));
};
