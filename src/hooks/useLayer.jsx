import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  setFrameSizeToMax,
  setShowProperties,
} from "redux/reducers/boardReducer";
import {
  setLoadedStatus,
  updateLayer,
  setCurrent as setCurrentLayer,
  setCloningLayer,
  insertToCloningQueue,
  deleteCloningQueueByID,
  cloneLayer,
  updateLayerOnly,
} from "redux/reducers/layerReducer";

export const useLayer = () => {
  const dispatch = useDispatch();

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const layerList = useSelector((state) => state.layerReducer.list);
  const frameSize = useSelector((state) => state.boardReducer.frameSize);
  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const cloningLayer = useSelector((state) => state.layerReducer.cloningLayer);
  const cloningQueue = useSelector((state) => state.layerReducer.cloningQueue);

  const onLoadLayer = useCallback(
    (layerID, flag) => {
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
        cloneLayer(movedLayer, true, true, {}, () => {
          dispatch(deleteCloningQueueByID(newQueueID));
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
