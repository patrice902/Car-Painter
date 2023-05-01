import { Stage } from "konva/types/Stage";
import { RefObject, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mathRound4 } from "src/helper";
import { RootState } from "src/redux";
import { setZoom } from "src/redux/reducers/boardReducer";

export const useZoom = (stageRef: RefObject<Stage | undefined>) => {
  const scaleBy = 1.2;
  const dispatch = useDispatch();

  const zoom = useSelector((state: RootState) => state.boardReducer.zoom);
  const frameSize = useSelector(
    (state: RootState) => state.boardReducer.frameSize
  );
  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );

  const onZoom = useCallback(
    (newScale) => {
      if (currentLayer && currentLayer.layer_data && stageRef.current) {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const selectedNode = stage.findOne("." + currentLayer.id);

        const { x: pointerX, y: pointerY } = selectedNode.getAbsolutePosition();
        const mousePointTo = {
          x: (pointerX - stage.x()) / oldScale,
          y: (pointerY - stage.y()) / oldScale,
        };

        dispatch(setZoom(newScale));

        const newPos = {
          x: pointerX - mousePointTo.x * newScale,
          y: pointerY - mousePointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
      } else {
        dispatch(setZoom(newScale));
      }
    },
    [dispatch, currentLayer, stageRef]
  );

  const onWheel = useCallback(
    (event) => {
      event.evt.preventDefault();
      const stage = stageRef.current;
      if (stage) {
        const width = stage.attrs.width || 1024;
        const height = stage.attrs.height || 1024;
        const fitZoom = mathRound4(
          Math.min(
            width / (frameSize.width || 1024),
            height / (frameSize.height || 1024)
          )
        );

        if (event.evt.ctrlKey) {
          // Zooming
          const oldScale = stage.scaleX();
          const { x: pointerX, y: pointerY } = stage.getPointerPosition() ?? {
            x: 0,
            y: 0,
          };
          const mousePointTo = {
            x: (pointerX - stage.x()) / oldScale,
            y: (pointerY - stage.y()) / oldScale,
          };
          const newScale = Math.max(
            Math.min(
              event.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy,
              10
            ),
            0.1
          );
          dispatch(setZoom(newScale));
          const newPos = {
            x: pointerX - mousePointTo.x * newScale,
            y: pointerY - mousePointTo.y * newScale,
          };
          stage.position(newPos);
          stage.batchDraw();
        } else if (event.evt.shiftKey) {
          // PanningX axis
          const newX = stage.x() - event.evt.deltaY;
          const virtualMinX = stage.width() - (frameSize.width * zoom) / 2;
          const virtualMaxX = (frameSize.width * zoom) / 2;

          const offsetX = zoom >= fitZoom ? 100 : 0;
          const minX = Math.min(virtualMinX, virtualMaxX) - offsetX;
          const maxX = Math.max(virtualMinX, virtualMaxX) + offsetX;

          const newPos = {
            x: Math.min(Math.max(newX, minX), maxX),
            y: stage.y(),
          };
          stage.position(newPos);
          stage.batchDraw();
        } else {
          // PanningY axis
          const newY = stage.y() - event.evt.deltaY;
          const virtualMinY = stage.height() - (frameSize.height * zoom) / 2;
          const virtualMaxY = (frameSize.height * zoom) / 2;

          const offsetY = zoom >= fitZoom ? 100 : 0;
          const minY = Math.min(virtualMinY, virtualMaxY) - offsetY;
          const maxY = Math.max(virtualMinY, virtualMaxY) + offsetY;

          const newPos = {
            x: stage.x(),
            y: Math.min(Math.max(newY, minY), maxY),
          };
          stage.position(newPos);
          stage.batchDraw();
        }
      }
    },
    [dispatch, stageRef, frameSize, zoom]
  );

  const onZoomIn = useCallback(() => {
    const newScale = mathRound4(Math.max(Math.min(zoom * 1.25, 10), 0.1));
    onZoom(newScale);
  }, [zoom, onZoom]);

  const onZoomOut = useCallback(() => {
    const newScale = mathRound4(Math.max(Math.min(zoom / 1.25, 10), 0.1));
    onZoom(newScale);
  }, [zoom, onZoom]);

  const onZoomFit = useCallback(() => {
    if (stageRef.current) {
      const width = stageRef.current.attrs.width || 1024;
      const height = stageRef.current.attrs.height || 1024;
      const newZoom = mathRound4(
        Math.min(
          width / (frameSize.width || 1024),
          height / (frameSize.height || 1024)
        )
      );

      stageRef.current.x(width / 2);
      stageRef.current.y(height / 2);
      dispatch(setZoom(newZoom));
    }
  }, [dispatch, stageRef, frameSize]);

  return { zoom, onZoomIn, onZoomOut, onZoomFit, onWheel };
};
