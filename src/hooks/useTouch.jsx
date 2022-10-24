import { useDispatch, useSelector } from "react-redux";
import { setIsDraggalbe, setZoom } from "redux/reducers/boardReducer";
import { setCurrent as setCurrentLayer } from "redux/reducers/layerReducer";
import { getCenterOfPoints, getDistance } from "helper";
import { useCallback } from "react";
import { MouseModes } from "constant";

export const useTouch = (stageRef) => {
  const dispatch = useDispatch();

  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const currentLayer = useSelector((state) => state.layerReducer.current);

  let lastCenter = null;
  let lastDist = 0;

  const onTouchStart = useCallback(
    (e) => {
      if (mouseMode === MouseModes.DEFAULT) {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty && currentLayer) {
          dispatch(setCurrentLayer(null));
        }
      }
    },
    [dispatch, mouseMode, currentLayer]
  );

  const onTouchMove = (e) => {
    e.evt.preventDefault();
    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];
    const stage = stageRef.current;

    if (stage !== null) {
      if (touch1 && touch2) {
        dispatch(setIsDraggalbe(false));

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenterOfPoints(p1, p2);
          return;
        }
        var newCenter = getCenterOfPoints(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX() * (dist / lastDist) * (dist / lastDist);

        dispatch(setZoom(scale));

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        lastDist = dist;
        lastCenter = newCenter;
      }
    }
  };

  function onTouchEnd() {
    lastCenter = null;
    lastDist = 0;
    dispatch(setIsDraggalbe(true));
  }

  return { onTouchStart, onTouchMove, onTouchEnd };
};
