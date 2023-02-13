import {
  DefaultLayer,
  DrawingStatus,
  LayerTypes,
  MouseModes,
  PaintingGuides,
} from "constant";
import {
  getCenterOfPoints,
  getDistance,
  getRelativePointerPosition,
  removeDuplicatedPointFromEnd,
} from "helper";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInterval from "react-useinterval";
import {
  setContextMenu,
  setIsDraggalbe,
  setMouseMode,
  setPaintingGuides,
  setZoom,
} from "redux/reducers/boardReducer";
import {
  createShape,
  setCloningLayer,
  setCurrent as setCurrentLayer,
  setDrawingStatus,
} from "redux/reducers/layerReducer";

export const useDrawHelper = (stageRef) => {
  const [prevPosition, setPrevPosition] = useState({});
  const [previousGuide, setPreviousGuide] = useState([]);
  const [tick, setTick] = useState(0);

  const drawingLayerRef = useRef(null);
  const prevTick = useRef(0);
  const currentTick = useRef(0);

  const dispatch = useDispatch();

  const mouseMode = useSelector((state) => state.boardReducer.mouseMode);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );
  const drawingStatus = useSelector(
    (state) => state.layerReducer.drawingStatus
  );

  let lastCenter = null;
  let lastDist = 0;

  useEffect(() => {
    switch (drawingStatus) {
      case DrawingStatus.ADD_TO_SHAPE:
        if (drawingLayerRef.current) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: removeDuplicatedPointFromEnd(
                drawingLayerRef.current.layer_data.points
              ),
            },
          };
          dispatch(createShape(currentScheme.id, layer));
          dispatch(setMouseMode(MouseModes.DEFAULT));
        }
        break;
      case DrawingStatus.CLEAR_COMMAND:
        // setDrawingLayer(null);
        drawingLayerRef.current = null;
        dispatch(setDrawingStatus(null));
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawingStatus]);

  useEffect(() => {
    if (!currentLayer) {
      dispatch(setContextMenu(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayer]);

  useInterval(() => {
    if (mouseMode !== MouseModes.DEFAULT) {
      setTick(tick + 1);
    }
  }, 50 * (Math.min(currentTick.current - prevTick.current > 4 ? currentTick.current - prevTick.current : (currentTick.current - prevTick.current) / 2, 20) || 1));

  useInterval(() => {
    if (mouseMode !== MouseModes.DEFAULT) {
      currentTick.current = currentTick.current + 1;
    }
  }, 5);

  const onMouseDown = useCallback(
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
  const onContentMouseDown = useCallback(() => {
    if (mouseMode !== MouseModes.DEFAULT) {
      const position = getRelativePointerPosition(stageRef.current);
      if (!drawingLayerRef.current) {
        let newLayer = {
          ...DefaultLayer,
          layer_type: LayerTypes.SHAPE,
          layer_data: {
            ...DefaultLayer.layer_data,
            type: mouseMode,
            name: mouseMode,
            left: position.x,
            top: position.y,
            color: currentScheme.guide_data.default_shape_color || "#000000",
            opacity: currentScheme.guide_data.default_shape_opacity || 1,
            scolor: currentScheme.guide_data.default_shape_scolor || "#000000",
            stroke: currentScheme.guide_data.default_shape_stroke || 0,
          },
        };

        if (
          [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
            mouseMode
          )
        ) {
          newLayer.layer_data.stroke = 5;
          newLayer.layer_data.points = [0, 0, 0, 0];
        }
        if (mouseMode === MouseModes.PEN) {
          newLayer.layer_data.stroke = 5;
          newLayer.layer_data.points = [0, 0];
        }
        drawingLayerRef.current = newLayer;
        dispatch(setDrawingStatus(DrawingStatus.DRAWING_SHAPE));
      } else {
        if (
          [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
            mouseMode
          )
        ) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: removeDuplicatedPointFromEnd(
                drawingLayerRef.current.layer_data.points
              ),
            },
          };
          layer.layer_data.points = layer.layer_data.points.concat([
            position.x - drawingLayerRef.current.layer_data.left,
            position.y - drawingLayerRef.current.layer_data.top,
            position.x - drawingLayerRef.current.layer_data.left,
            position.y - drawingLayerRef.current.layer_data.top,
          ]);

          drawingLayerRef.current = layer;
          dispatch(setDrawingStatus(DrawingStatus.DRAWING_SHAPE));
        }
      }
    }
  }, [
    dispatch,
    mouseMode,
    currentScheme.guide_data,
    drawingLayerRef,
    stageRef,
  ]);
  const onContentMousemove = useCallback(() => {
    if (mouseMode !== MouseModes.DEFAULT && drawingLayerRef.current) {
      const position = getRelativePointerPosition(stageRef.current);
      const width = position.x - drawingLayerRef.current.layer_data.left;
      const height = position.y - drawingLayerRef.current.layer_data.top;
      const positionX = position.x - drawingLayerRef.current.layer_data.left;
      const positionY = position.y - drawingLayerRef.current.layer_data.top;
      if (
        drawingLayerRef.current.layer_data.points.length < 2 ||
        positionX !==
          drawingLayerRef.current.layer_data.points[
            drawingLayerRef.current.layer_data.points.length - 2
          ] ||
        positionY !==
          drawingLayerRef.current.layer_data.points[
            drawingLayerRef.current.layer_data.points.length - 1
          ]
      ) {
        if (
          currentTick.current - prevTick.current > 1 ||
          drawingLayerRef.current.layer_data.points.length < 2 ||
          Math.abs(
            positionX -
              drawingLayerRef.current.layer_data.points[
                drawingLayerRef.current.layer_data.points.length - 2
              ]
          ) > 10 ||
          Math.abs(
            positionY -
              drawingLayerRef.current.layer_data.points[
                drawingLayerRef.current.layer_data.points.length - 1
              ]
          ) > 10
        ) {
          let layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: [...drawingLayerRef.current.layer_data.points],
              width: MouseModes.ELLIPSE === mouseMode ? Math.abs(width) : width,
              height:
                MouseModes.ELLIPSE === mouseMode ? Math.abs(height) : height,
              radius: Math.abs(width),
              innerRadius: Math.abs(width) / 2.5,
              outerRadius: Math.abs(width),
            },
          };
          if (
            [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
              mouseMode
            )
          ) {
            layer.layer_data.points.splice(-2, 2, positionX, positionY);
          }
          if (mouseMode === MouseModes.PEN) {
            layer.layer_data.points.push(positionX);
            layer.layer_data.points.push(positionY);
          }
          drawingLayerRef.current = layer;
        }
      }
      prevTick.current = currentTick.current;
    }
  }, [mouseMode, drawingLayerRef, stageRef, currentTick]);
  const onContentMouseup = useCallback(() => {
    if (
      ![
        MouseModes.DEFAULT,
        MouseModes.LINE,
        MouseModes.ARROW,
        MouseModes.POLYGON,
      ].includes(mouseMode)
    ) {
      dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
    }
    const position = getRelativePointerPosition(stageRef.current);
    setPrevPosition(position);
  }, [mouseMode, stageRef, dispatch]);
  const onDoubleClick = useCallback(() => {
    const position = getRelativePointerPosition(stageRef.current);
    if (
      [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
        mouseMode
      ) &&
      drawingLayerRef.current &&
      prevPosition.x === position.x &&
      prevPosition.y === position.y
    ) {
      dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
    }
  }, [stageRef, mouseMode, prevPosition, dispatch]);

  const showGuideForRepositioning = useCallback(
    (show = true) => {
      if (!show) {
        dispatch(setPaintingGuides([...previousGuide]));
        setPreviousGuide([]);
      } else if (!previousGuide.length) {
        setPreviousGuide([...paintingGuides]);
        let newPaintingGuides = [...paintingGuides];
        if (
          currentScheme.guide_data.show_wireframe &&
          !newPaintingGuides.includes(PaintingGuides.WIREFRAME)
        ) {
          newPaintingGuides.push(PaintingGuides.WIREFRAME);
        }
        if (
          currentScheme.guide_data.show_numberBlocks &&
          !newPaintingGuides.includes(PaintingGuides.NUMBERBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.NUMBERBLOCKS);
        }
        if (
          currentScheme.guide_data.show_sponsor &&
          !newPaintingGuides.includes(PaintingGuides.SPONSORBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.SPONSORBLOCKS);
        }
        if (
          currentScheme.guide_data.show_grid &&
          !newPaintingGuides.includes(PaintingGuides.GRID)
        ) {
          newPaintingGuides.push(PaintingGuides.GRID);
        }
        dispatch(setPaintingGuides(newPaintingGuides));
      }
    },
    [dispatch, paintingGuides, previousGuide, setPreviousGuide, currentScheme]
  );
  const onLayerDragStart = useCallback(
    (layer) => {
      if (
        currentScheme.guide_data.show_wireframe ||
        currentScheme.guide_data.show_numberBlocks ||
        currentScheme.guide_data.show_sponsor ||
        currentScheme.guide_data.show_grid
      ) {
        showGuideForRepositioning(true);
      }
      dispatch(setDrawingStatus(DrawingStatus.TRANSFORMING_SHAPE));
      if (layer && pressedKey === "alt") {
        dispatch(setCloningLayer({ ...layer, id: "cloning-layer" }));
      }
    },
    [dispatch, showGuideForRepositioning, currentScheme, pressedKey]
  );
  const onLayerDragEnd = useCallback(() => {
    if (
      currentScheme.guide_data.show_wireframe ||
      currentScheme.guide_data.show_numberBlocks ||
      currentScheme.guide_data.show_sponsor ||
      currentScheme.guide_data.show_grid
    )
      showGuideForRepositioning(false);
    dispatch(setDrawingStatus(null));
  }, [dispatch, showGuideForRepositioning, currentScheme]);

  const onDragEnd = useCallback(() => {}, []);

  const onContextMenu = useCallback(
    (e) => {
      e.evt.preventDefault(true);
      const stage = e.target.getStage();
      if (e.target !== stage) {
        const position = stage.getPointerPosition();
        dispatch(
          setContextMenu({
            x: position.x,
            y: position.y,
          })
        );
      }
    },
    [dispatch]
  );

  const onTap = useCallback(
    (e) => {
      if (mouseMode === MouseModes.DEFAULT) {
        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          e.evt.preventDefault();
        } else {
          onMouseDown(e);
        }
      } else {
        onContentMouseDown(e);
      }
    },
    [mouseMode, onMouseDown, onContentMouseDown]
  );

  const onTouchStart = useCallback(
    (e) => {
      if (mouseMode === MouseModes.DEFAULT) {
        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          e.evt.preventDefault();
        } else {
          onMouseDown(e);
        }
      } else {
        onContentMouseDown(e);
      }
    },
    [mouseMode, onMouseDown, onContentMouseDown]
  );

  const onTouchMove = (e) => {
    if (mouseMode === MouseModes.DEFAULT) {
      e.evt.preventDefault();
      var touch1 = e.evt.touches[0];
      var touch2 = e.evt.touches[1];
      const stage = stageRef.current;

      if (stage && touch1 && touch2) {
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
    } else {
      onContentMousemove();
    }
  };

  const onTouchEnd = (e) => {
    if (mouseMode === MouseModes.DEFAULT) {
      lastCenter = null;
      lastDist = 0;
      dispatch(setIsDraggalbe(true));
    } else {
      onContentMouseup(e);
    }
  };

  const onDbltap = (e) => {
    if (mouseMode === MouseModes.DEFAULT) {
      onContextMenu(e);
    } else {
      onDoubleClick(e);
    }
  };

  return {
    drawingLayerRef,
    onMouseDown,
    onContentMouseup,
    onContentMousemove,
    onContentMouseDown,
    onDoubleClick,
    onLayerDragStart,
    onLayerDragEnd,
    onDragEnd,
    onContextMenu,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTap,
    onDbltap,
  };
};
