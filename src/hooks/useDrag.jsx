import { useCallback, useMemo, useState } from "react";
import Konva from "konva";
import { PaintingGuides } from "constant";
import { getCenterOfPoints, getDistance, mathRound2 } from "helper";
import { useReducerRef } from "./useReducerRef";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setZoom } from "redux/reducers/boardReducer";

export const useDrag = ({
  stageRef,
  shapeRef,
  paintingGuides,
  guideData,
  frameSize,
  layer,
  cloningLayer,
  offsetsFromStroke,
  // opacity,
  onSelect,
  onChange,
  onDragStart,
  onDragEnd,
  onCloneMove,
  onSetTransformingLayer,
}) => {
  const GUIDELINE_ID = "snapping-guide-line";

  const dispatch = useDispatch();
  const [dragEnabled, setDragEnabled] = useState(true);
  const [, setDragging] = useState(false);
  const [lastDist, setLastDist] = useState(0);
  const [lastCenter, setLastCenter] = useState(null);
  const [, layerRef] = useReducerRef(layer);
  const [, cloningLayerRef] = useReducerRef(cloningLayer);
  const pressedKey = useSelector((state) => state.boardReducer.pressedKey);

  const GUIDELINE_OFFSET = useMemo(
    () => (guideData ? Math.max(guideData.grid_padding / 10, 2) : 10),
    [guideData]
  );
  const getShapeClientRect = useCallback(() => {
    return shapeRef.current.getClientRect({
      relativeTo: shapeRef.current.getParent().getParent(),
      skipShadow: true,
    });
  }, [shapeRef]);

  const getLineGuideStops = useCallback(() => {
    var vertical = Array.from(
      Array(Math.round(frameSize.width / guideData.grid_padding))
    ).map((e, i) => guideData.grid_padding * i);
    var horizontal = Array.from(
      Array(Math.round(frameSize.height / guideData.grid_padding))
    ).map((e, i) => guideData.grid_padding * i);
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  }, [frameSize, guideData]);

  const getObjectSnappingEdges = useCallback(() => {
    var box = getShapeClientRect();
    var pos = shapeRef.current.position();

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(pos.x - box.x),
          snap: "start",
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(pos.x - box.x - box.width / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(pos.x - box.x - box.width),
          snap: "end",
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(pos.y - box.y),
          snap: "start",
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(pos.y - box.y - box.height / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(pos.y - box.y - box.height),
          snap: "end",
        },
      ],
    };
  }, [shapeRef, getShapeClientRect]);

  // find all snapping possibilities
  const getGuides = useCallback(
    (lineGuideStops, itemBounds) => {
      var resultV = [];
      var resultH = [];

      lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
          var diff = Math.abs(lineGuide - itemBound.guide);
          // if the distance between guild line and object snap point is close we can consider this for snapping
          if (diff < GUIDELINE_OFFSET) {
            resultV.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
          var diff = Math.abs(lineGuide - itemBound.guide);
          if (diff < GUIDELINE_OFFSET) {
            resultH.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      var guides = [];

      // find closest snap
      var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
      var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
      if (minV) {
        guides.push({
          lineGuide: minV.lineGuide,
          offset: minV.offset,
          orientation: "V",
          snap: minV.snap,
        });
      }
      if (minH) {
        guides.push({
          lineGuide: minH.lineGuide,
          offset: minH.offset,
          orientation: "H",
          snap: minH.snap,
        });
      }
      return guides;
    },
    [GUIDELINE_OFFSET]
  );

  const drawGuides = useCallback(
    (guides) => {
      guides.forEach((lg) => {
        var layer = stageRef.current.findOne(".layer-guide-top");
        var line;
        if (lg.orientation === "H") {
          line = new Konva.Line({
            points: [0, 0, frameSize.width, 0],
            stroke: "rgb(255, 0, 0)",
            strokeWidth: 1,
            name: GUIDELINE_ID,
            dash: [4, 6],
          });
          layer.add(line);
          line.position({
            x: 0,
            y: lg.lineGuide,
          });
        } else if (lg.orientation === "V") {
          line = new Konva.Line({
            points: [0, 0, 0, frameSize.height],
            stroke: "rgb(255, 0, 0)",
            strokeWidth: 1,
            name: GUIDELINE_ID,
            dash: [4, 6],
          });
          layer.add(line);
          line.position({
            x: lg.lineGuide,
            y: 0,
          });
        }
      });
    },
    [frameSize, stageRef]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.evt.preventDefault();
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = stageRef.current;
      if (!stage) {
        return;
      }

      if (touch1 && touch2) {
        setDragEnabled(false);
        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          setLastCenter(getCenterOfPoints(p1, p2));
          return;
        }
        var newCenter = getCenterOfPoints(p1, p2);

        var dist = getDistance(p1, p2);

        const targetDist = lastDist || dist;
        const targetCenter = lastCenter || newCenter;

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX() * (dist / targetDist);

        dispatch(setZoom(scale));

        // calculate new position of the stage
        var dx = newCenter.x - targetCenter.x;
        var dy = newCenter.y - targetCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        setLastDist(dist);
        setLastCenter(newCenter);
      }
    },
    [dispatch, lastCenter, lastDist, stageRef]
  );

  const handleTouchEnd = useCallback((e) => {
    setDragEnabled(true);
    setLastDist(0);
    setLastCenter(null);
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (paintingGuides.includes(PaintingGuides.GRID) && guideData.snap_grid) {
        // clear all previous lines on the screen
        stageRef.current.find("." + GUIDELINE_ID).forEach((l) => l.destroy());

        // find possible snapping lines
        var lineGuideStops = getLineGuideStops(e.target);
        // find snapping points of current object
        var itemBounds = getObjectSnappingEdges(e.target);

        // now find where can we snap current object
        var guides = getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        if (!guides.length) {
          return;
        }

        drawGuides(guides);

        var pos = e.target.position();
        // now force object position
        guides.forEach((lg) => {
          switch (lg.snap) {
            case "start": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            case "center": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            case "end": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            default:
              break;
          }
        });
        e.target.position(pos);
      }

      // var box = getShapeClientRect();
      // if (
      //   box.x < 0 ||
      //   box.y < 0 ||
      //   box.x + box.width > frameSize.width ||
      //   box.y + box.height > frameSize.height
      // ) {
      //   e.target.opacity(opacity / 2);
      // } else {
      //   e.target.opacity(opacity);
      // }

      const left = mathRound2(
        e.target.x() - (offsetsFromStroke ? offsetsFromStroke.x : 0)
      );
      const top = mathRound2(
        e.target.y() - (offsetsFromStroke ? offsetsFromStroke.y : 0)
      );
      if (onSetTransformingLayer) {
        onSetTransformingLayer({
          ...layerRef.current,
          layer_data: {
            ...layerRef.current.layer_data,
            left,
            top,
          },
        });
      }
    },
    [
      paintingGuides,
      guideData,
      stageRef,
      layerRef,
      getLineGuideStops,
      getObjectSnappingEdges,
      getGuides,
      drawGuides,
      onSetTransformingLayer,
      offsetsFromStroke,
      // getShapeClientRect,
      // frameSize,
      // opacity,
    ]
  );

  const handleDragStart = (e) => {
    setDragging(true);
    if (onDragStart) onDragStart(layerRef.current);
    if (onSetTransformingLayer) {
      onSetTransformingLayer(layerRef.current);
    }
    if (pressedKey !== "alt") {
      onSelect();
    }
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    // e.target.opacity(opacity);
    stageRef.current.find("." + GUIDELINE_ID).forEach((l) => l.destroy());
    const left = mathRound2(
      e.target.x() - (offsetsFromStroke ? offsetsFromStroke.x : 0)
    );
    const top = mathRound2(
      e.target.y() - (offsetsFromStroke ? offsetsFromStroke.y : 0)
    );

    if (cloningLayerRef.current && onCloneMove) {
      onCloneMove({
        ...cloningLayerRef.current,
        layer_data: {
          ...cloningLayerRef.current.layer_data,
          left,
          top,
        },
      });
      e.target.x(
        layerRef.current.layer_data.left +
          (offsetsFromStroke ? offsetsFromStroke.x : 0)
      );
      e.target.y(
        layerRef.current.layer_data.top +
          (offsetsFromStroke ? offsetsFromStroke.y : 0)
      );
    } else if (onChange) {
      onSelect();
      onChange({ left, top });
    }
    if (onDragEnd) onDragEnd();
    if (onSetTransformingLayer) {
      onSetTransformingLayer(null);
    }
  };

  return {
    dragEnabled,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleTouchMove,
    handleTouchEnd,
  };
};
