import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  setFrameSizeToMax,
  setShowProperties,
} from "src/redux/reducers/boardReducer";
import {
  cloneLayer,
  deleteCloningQueueByID,
  insertToCloningQueue,
  setCloningLayer,
  setCurrent as setCurrentLayer,
  setLoadedStatus,
  updateLayer,
  updateLayerOnly,
} from "src/redux/reducers/layerReducer";
import { v4 as uuidv4 } from "uuid";

export const useLayer = () => {
  const dispatch = useDispatch();

  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );
  const layerList = useSelector((state: RootState) => state.layerReducer.list);
  const frameSize = useSelector(
    (state: RootState) => state.boardReducer.frameSize
  );
  const loadedStatuses = useSelector(
    (state: RootState) => state.layerReducer.loadedStatuses
  );
  const cloningLayer = useSelector(
    (state: RootState) => state.layerReducer.cloningLayer
  );
  const cloningQueue = useSelector(
    (state: RootState) => state.layerReducer.cloningQueue
  );

  const onLoadLayer = useCallback(
    (layerID: string | number, flag: boolean) => {
      dispatch(setLoadedStatus({ key: layerID, value: flag }));
    },
    [dispatch]
  );

  const onExpandFrameFromImage = useCallback(
    (size) => {
      if (frameSize.width < size.width || frameSize.height < size.height) {
        dispatch(
          setFrameSizeToMax({
            width: Math.max(frameSize.width, size.width),
            height: Math.max(frameSize.height, size.height),
          })
        );
      }
    },
    [dispatch, frameSize]
  );

  const onLayerDataChange = useCallback(
    (layer, values, pushingToHistory = true) => {
      dispatch(
        updateLayer(
          {
            id: layer.id,
            layer_data: {
              ...values,
            },
          },
          pushingToHistory
        )
      );
    },
    [dispatch]
  );

  const onLayerDataChangeOnly = useCallback(
    (layer, values) => {
      dispatch(
        updateLayerOnly({
          id: layer.id,
          layer_data: {
            ...values,
          },
        })
      );
    },
    [dispatch]
  );

  const onDblClickLayer = useCallback(() => {
    dispatch(setShowProperties(true));
  }, [dispatch]);

  const onLayerSelect = useCallback(
    (layer) => {
      dispatch(setCurrentLayer(layer));
    },
    [dispatch]
  );

  const onCloneMoveLayer = useCallback(
    (movedLayer) => {
      const newQueueID = `cloning-layer-${uuidv4()}`;
      dispatch(setCloningLayer(null));
      dispatch(insertToCloningQueue({ ...movedLayer, id: newQueueID }));
      dispatch(
        cloneLayer({
          layerToClone: movedLayer,
          samePosition: true,
          pushingToHistory: true,
          callback: () => {
            dispatch(deleteCloningQueueByID(newQueueID));
          },
        })
      );
    },
    [dispatch]
  );

  return {
    currentLayer,
    layerList,
    loadedStatuses,
    cloningLayer,
    cloningQueue,
    onLoadLayer,
    onLayerDataChange,
    onLayerDataChangeOnly,
    onLayerSelect,
    onCloneMoveLayer,
    onDblClickLayer,
    onExpandFrameFromImage,
  };
};
