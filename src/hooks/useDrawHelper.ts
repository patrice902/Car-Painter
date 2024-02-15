import { KonvaEventObject } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInterval from "react-useinterval";
import { DefaultLayer } from "src/constant";
import {
  getCenterOfPoints,
  getDistance,
  getRelativePointerPosition,
  removeDuplicatedPointFromEnd,
} from "src/helper";
import { RootState } from "src/redux";
import {
  setContextMenu,
  setIsDraggalbe,
  setMouseMode,
  setPaintingGuides,
  setZoom,
} from "src/redux/reducers/boardReducer";
import {
  createShape,
  setCloningLayer,
  setCurrent as setCurrentLayer,
  setDrawingStatus,
} from "src/redux/reducers/layerReducer";
import {
  DrawingLayerJSON,
  LineObjLayerData,
  Position,
  RectObjLayerData,
  ShapeObjLayerData,
} from "src/types/common";
import {
  DrawingStatus,
  LayerTypes,
  MouseModes,
  PaintingGuides,
} from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { ArrowKeys } from "./withKeyEvent";

export const useDrawHelper = (stageRef: RefObject<Stage | undefined>) => {
  const [prevPosition, setPrevPosition] = useState<Position>();
  const [previousGuide, setPreviousGuide] = useState<PaintingGuides[]>([]);
  const [previousPressedEventKey, setPreviousPressedEventKey] = useState<
    string | null
  >();
  const [tick, setTick] = useState(0);
  const [showGuideForRepositioning, setShowGuideForRepositioning] = useState(
    false
  );
  const timerForGuideRepositioning = useRef<ReturnType<typeof setTimeout>>();

  const drawingLayerRef = useRef<BuilderLayerJSON<ShapeObjLayerData>>();
  const prevTick = useRef(0);
  const currentTick = useRef(0);

  const dispatch = useDispatch();

  const mouseMode = useSelector(
    (state: RootState) => state.boardReducer.mouseMode
  );
  const pressedKey = useSelector(
    (state: RootState) => state.boardReducer.pressedKey
  );
  const pressedEventKey = useSelector(
    (state: RootState) => state.boardReducer.pressedEventKey
  );
  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );
  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );
  const paintingGuides = useSelector(
    (state: RootState) => state.boardReducer.paintingGuides
  );
  const drawingStatus = useSelector(
    (state: RootState) => state.layerReducer.drawingStatus
  );

  let lastCenter: Position | null = null;
  let lastDist = 0;

  useEffect(() => {
    switch (drawingStatus) {
      case DrawingStatus.ADD_TO_SHAPE:
        if (drawingLayerRef.current) {
          const layer = {
            ...(drawingLayerRef.current ?? {}),
          };
          if ((layer.layer_data as LineObjLayerData).points) {
            (layer.layer_data as LineObjLayerData).points = removeDuplicatedPointFromEnd(
              (layer.layer_data as LineObjLayerData).points
            );
          }

          // Adjusting Negative width
          if ((layer.layer_data as RectObjLayerData).width < 0) {
            (layer.layer_data as RectObjLayerData).left -= Math.abs(
              (layer.layer_data as RectObjLayerData).width
            );
            (layer.layer_data as RectObjLayerData).width = -(layer.layer_data as RectObjLayerData)
              .width;
          }

          // Adjusting Negative height
          if ((layer.layer_data as RectObjLayerData).height < 0) {
            (layer.layer_data as RectObjLayerData).top -= Math.abs(
              (layer.layer_data as RectObjLayerData).height
            );
            (layer.layer_data as RectObjLayerData).height = -(layer.layer_data as RectObjLayerData)
              .height;
          }

          if (currentScheme) {
            dispatch(createShape(currentScheme.id, layer));
          }
          dispatch(setMouseMode(MouseModes.DEFAULT));
        }
        break;
      case DrawingStatus.CLEAR_COMMAND:
        // setDrawingLayer(null);
        drawingLayerRef.current = undefined;
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
    (e: KonvaEventObject<Event>) => {
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
      if (!stageRef.current || !currentScheme) return;

      const position = getRelativePointerPosition(stageRef.current);

      if (!position) return;

      if (!drawingLayerRef.current) {
        const newLayer: DrawingLayerJSON = {
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
        drawingLayerRef.current = newLayer as BuilderLayerJSON<ShapeObjLayerData>;
        dispatch(setDrawingStatus(DrawingStatus.DRAWING_SHAPE));
      } else {
        if (
          [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
            mouseMode
          )
        ) {
          const layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerRef.current.layer_data,
              points: removeDuplicatedPointFromEnd(
                (drawingLayerRef.current.layer_data as LineObjLayerData).points
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
  }, [dispatch, mouseMode, currentScheme, drawingLayerRef, stageRef]);

  const onContentMousemove = useCallback(() => {
    if (
      mouseMode !== MouseModes.DEFAULT &&
      drawingLayerRef.current &&
      stageRef.current
    ) {
      const position = getRelativePointerPosition(stageRef.current);
      if (!position) return;

      const drawingLayerData = drawingLayerRef.current
        .layer_data as LineObjLayerData;

      const width = position.x - drawingLayerData.left;
      const height = position.y - drawingLayerData.top;
      const positionX = position.x - drawingLayerData.left;
      const positionY = position.y - drawingLayerData.top;
      if (
        drawingLayerData.points.length < 2 ||
        positionX !==
          drawingLayerData.points[drawingLayerData.points.length - 2] ||
        positionY !==
          drawingLayerData.points[drawingLayerData.points.length - 1]
      ) {
        if (
          currentTick.current - prevTick.current > 1 ||
          drawingLayerData.points.length < 2 ||
          Math.abs(
            positionX -
              drawingLayerData.points[drawingLayerData.points.length - 2]
          ) > 10 ||
          Math.abs(
            positionY -
              drawingLayerData.points[drawingLayerData.points.length - 1]
          ) > 10
        ) {
          const layer = {
            ...drawingLayerRef.current,
            layer_data: {
              ...drawingLayerData,
              points: [...drawingLayerData.points],
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
    if (!stageRef.current) return;

    const position = getRelativePointerPosition(stageRef.current);

    if (position) setPrevPosition(position);
  }, [mouseMode, stageRef, dispatch]);

  const onDoubleClick = useCallback(() => {
    if (!stageRef.current) return;

    const position = getRelativePointerPosition(stageRef.current);

    if (
      [MouseModes.LINE, MouseModes.ARROW, MouseModes.POLYGON].includes(
        mouseMode
      ) &&
      drawingLayerRef.current &&
      position &&
      prevPosition?.x === position.x &&
      prevPosition?.y === position.y
    ) {
      dispatch(setDrawingStatus(DrawingStatus.ADD_TO_SHAPE));
    }
  }, [stageRef, mouseMode, prevPosition, dispatch]);

  const handleShowGuideForRepositioning = useCallback(
    (show = true) => {
      setShowGuideForRepositioning(show);
      if (!show) {
        dispatch(setPaintingGuides([...previousGuide]));
        setPreviousGuide([]);
      } else if (!previousGuide.length) {
        setPreviousGuide([...paintingGuides]);
        const newPaintingGuides = [...paintingGuides];
        if (
          currentScheme?.guide_data.show_wireframe &&
          !newPaintingGuides.includes(PaintingGuides.WIREFRAME)
        ) {
          newPaintingGuides.push(PaintingGuides.WIREFRAME);
        }
        if (
          currentScheme?.guide_data.show_numberBlocks &&
          !newPaintingGuides.includes(PaintingGuides.NUMBERBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.NUMBERBLOCKS);
        }
        if (
          currentScheme?.guide_data.show_sponsor &&
          !newPaintingGuides.includes(PaintingGuides.SPONSORBLOCKS)
        ) {
          newPaintingGuides.push(PaintingGuides.SPONSORBLOCKS);
        }
        if (
          currentScheme?.guide_data.show_grid &&
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
        currentScheme?.guide_data.show_wireframe ||
        currentScheme?.guide_data.show_numberBlocks ||
        currentScheme?.guide_data.show_sponsor ||
        currentScheme?.guide_data.show_grid
      ) {
        handleShowGuideForRepositioning(true);
      }
      dispatch(setDrawingStatus(DrawingStatus.TRANSFORMING_SHAPE));
      if (layer && pressedKey === "alt") {
        dispatch(setCloningLayer({ ...layer, id: "cloning-layer" }));
      }
    },
    [dispatch, handleShowGuideForRepositioning, currentScheme, pressedKey]
  );
  const onLayerDragEnd = useCallback(() => {
    if (
      currentScheme?.guide_data.show_wireframe ||
      currentScheme?.guide_data.show_numberBlocks ||
      currentScheme?.guide_data.show_sponsor ||
      currentScheme?.guide_data.show_grid
    )
      handleShowGuideForRepositioning(false);
    dispatch(setDrawingStatus(null));
  }, [dispatch, handleShowGuideForRepositioning, currentScheme]);

  useEffect(() => {
    // Show/hide Guide on pressing arrow keys
    if (
      currentLayer &&
      ![LayerTypes.CAR, LayerTypes.BASE].includes(currentLayer.layer_type)
    ) {
      if (
        pressedEventKey &&
        ArrowKeys.includes(pressedEventKey) &&
        !showGuideForRepositioning
      ) {
        if (timerForGuideRepositioning.current) {
          clearTimeout(timerForGuideRepositioning.current);
        }

        handleShowGuideForRepositioning(true);
      }

      if (
        !pressedEventKey &&
        previousPressedEventKey &&
        ArrowKeys.includes(previousPressedEventKey) &&
        showGuideForRepositioning
      ) {
        if (timerForGuideRepositioning.current) {
          clearTimeout(timerForGuideRepositioning.current);
        }

        timerForGuideRepositioning.current = setTimeout(() => {
          if (showGuideForRepositioning) {
            handleShowGuideForRepositioning(false);
          }
        }, 500);
      }
    }
    setPreviousPressedEventKey(pressedEventKey);

    return () => {
      if (timerForGuideRepositioning.current) {
        clearTimeout(timerForGuideRepositioning.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressedEventKey]);

  const onDragEnd = undefined;

  const onContextMenu = useCallback(
    (e: KonvaEventObject<Event>) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      if (e.target !== stage && stage) {
        const position = stage.getPointerPosition();
        if (position) {
          dispatch(
            setContextMenu({
              x: position.x,
              y: position.y,
            })
          );
        }
      }
    },
    [dispatch]
  );

  const onTap = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      if (mouseMode === MouseModes.DEFAULT) {
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          e.evt.preventDefault();
        } else {
          onMouseDown(e);
        }
      } else {
        onContentMouseDown();
      }
    },
    [mouseMode, onMouseDown, onContentMouseDown]
  );

  const onTouchStart = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      if (mouseMode === MouseModes.DEFAULT) {
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          e.evt.preventDefault();
        } else {
          onMouseDown(e);
        }
      } else {
        onContentMouseDown();
      }
    },
    [mouseMode, onMouseDown, onContentMouseDown]
  );

  const onTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    if (mouseMode === MouseModes.DEFAULT) {
      e.evt.preventDefault();
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = stageRef.current;

      if (stage && touch1 && touch2) {
        dispatch(setIsDraggalbe(false));

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenterOfPoints(p1, p2);
          return;
        }
        const newCenter = getCenterOfPoints(p1, p2);

        const dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        const scale = stage.scaleX() * (dist / lastDist) * (dist / lastDist);

        dispatch(setZoom(scale));

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x;
        const dy = newCenter.y - lastCenter.y;

        const newPos = {
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

  const onTouchEnd = () => {
    if (mouseMode === MouseModes.DEFAULT) {
      lastCenter = null;
      lastDist = 0;
      dispatch(setIsDraggalbe(true));
    } else {
      onContentMouseup();
    }
  };

  const onDbltap = (e: KonvaEventObject<TouchEvent>) => {
    if (mouseMode === MouseModes.DEFAULT) {
      onContextMenu(e);
    } else {
      onDoubleClick();
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
