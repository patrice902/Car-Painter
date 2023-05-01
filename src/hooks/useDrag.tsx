import Konva from "konva";
import { Layer } from "konva/types/Layer";
import { KonvaEventObject, Node } from "konva/types/Node";
import { Stage } from "konva/types/Stage";
import { RefObject, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCenterOfPoints, getDistance, mathRound2 } from "src/helper";
import { RootState } from "src/redux";
import { setZoom } from "src/redux/reducers/boardReducer";
import {
  DefaultLayerData,
  FrameSize,
  GuideData,
  MovableObjLayerData,
  OffsetsFromStroke,
  PartialAllLayerData,
  Position,
} from "src/types/common";
import { PaintingGuides } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { useReducerRef } from "./useReducerRef";

type UseDragProps = {
  stageRef?: RefObject<Stage>;
  shapeRef: RefObject<Node>;
  paintingGuides?: PaintingGuides[];
  guideData?: GuideData | null;
  frameSize?: FrameSize;
  layer?: BuilderLayerJSON<MovableObjLayerData>;
  cloningLayer?: BuilderLayerJSON<MovableObjLayerData>;
  offsetsFromStroke?: OffsetsFromStroke;
  onSelect?: () => void;
  onChange?: (
    values: Record<string, unknown>,
    pushingToHistory?: boolean
  ) => void;
  onDragStart?: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onDragEnd?: () => void;
  onCloneMove?: (
    layer: BuilderLayerJSON<DefaultLayerData & PartialAllLayerData>
  ) => void;
  onSetTransformingLayer?: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
};

type LineGuideStops = {
  vertical: number[];
  horizontal: number[];
};

type ObjectSnappingEdges = {
  vertical: {
    guide: number;
    offset: number;
    snap: string;
  }[];
  horizontal: {
    guide: number;
    offset: number;
    snap: string;
  }[];
};

type LineSnap = {
  lineGuide: number;
  offset: number;
  diff: number;
  snap: string;
};

type LineGuide = {
  lineGuide: number;
  offset: number;
  orientation: "V" | "H";
  snap: string;
};

export const useDrag = ({
  stageRef,
  shapeRef,
  paintingGuides,
  guideData,
  frameSize,
  layer,
  cloningLayer,
  offsetsFromStroke,
  onSelect,
  onChange,
  onDragStart,
  onDragEnd,
  onCloneMove,
  onSetTransformingLayer,
}: UseDragProps) => {
  const GUIDELINE_ID = "snapping-guide-line";

  const dispatch = useDispatch();
  const [dragEnabled, setDragEnabled] = useState(true);
  const [, setDragging] = useState(false);
  const [lastDist, setLastDist] = useState(0);
  const [lastCenter, setLastCenter] = useState<Position | null>(null);
  const [, layerRef] = useReducerRef(layer);
  const [, cloningLayerRef] = useReducerRef(cloningLayer);
  const pressedKey = useSelector(
    (state: RootState) => state.boardReducer.pressedKey
  );

  const GUIDELINE_OFFSET = useMemo(
    () => (guideData ? Math.max((guideData.grid_padding ?? 0) / 10, 2) : 10),
    [guideData]
  );

  const getShapeClientRect = useCallback(
    () =>
      shapeRef.current?.getClientRect({
        relativeTo: shapeRef.current.getParent().getParent(),
        skipShadow: true,
      }) ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    [shapeRef]
  );

  const getLineGuideStops = useCallback(() => {
    const gridPadding = guideData?.grid_padding ?? 1;

    const vertical = Array.from(
      Array(Math.round((frameSize?.width ?? 0) / gridPadding))
    ).map((e, i) => gridPadding * i);
    const horizontal = Array.from(
      Array(Math.round((frameSize?.height ?? 0) / gridPadding))
    ).map((e, i) => gridPadding * i);

    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  }, [frameSize, guideData]);

  const getObjectSnappingEdges = useCallback(() => {
    const box = getShapeClientRect();
    const pos = shapeRef.current?.position() ?? { x: 0, y: 0 };

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
    (lineGuideStops: LineGuideStops, itemBounds: ObjectSnappingEdges) => {
      const resultV: LineSnap[] = [];
      const resultH: LineSnap[] = [];

      lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
          const diff = Math.abs(lineGuide - itemBound.guide);
          // if the distance between guild line and object snap point is close we can consider this for snapping
          if (diff < GUIDELINE_OFFSET) {
            resultV.push({
              lineGuide,
              diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
          const diff = Math.abs(lineGuide - itemBound.guide);
          if (diff < GUIDELINE_OFFSET) {
            resultH.push({
              lineGuide,
              diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      const guides: LineGuide[] = [];

      // find closest snap
      const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
      const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
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
    (guides: LineGuide[]) => {
      guides.forEach((lg) => {
        const layer = stageRef?.current?.findOne(".layer-guide-top") as Layer;
        if (layer) {
          let line;
          if (lg.orientation === "H") {
            line = new Konva.Line({
              points: [0, 0, frameSize?.width ?? 0, 0],
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
              points: [0, 0, 0, frameSize?.height ?? 0],
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
      const stage = stageRef?.current;
      if (!stage) {
        return;
      }

      if (touch1 && touch2) {
        setDragEnabled(false);
        const p1: Position = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2: Position = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          setLastCenter(getCenterOfPoints(p1, p2));
          return;
        }
        const newCenter = getCenterOfPoints(p1, p2);

        const dist = getDistance(p1, p2);

        const targetDist = lastDist || dist;
        const targetCenter = lastCenter || newCenter;

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        const scale = stage.scaleX() * (dist / targetDist);

        dispatch(setZoom(scale));

        // calculate new position of the stage
        const dx = newCenter.x - targetCenter.x;
        const dy = newCenter.y - targetCenter.y;

        const newPos = {
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

  const handleTouchEnd = useCallback(() => {
    setDragEnabled(true);
    setLastDist(0);
    setLastCenter(null);
  }, []);

  const handleDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (
        paintingGuides?.includes(PaintingGuides.GRID) &&
        guideData?.snap_grid
      ) {
        // clear all previous lines on the screen
        for (const guideLine of stageRef?.current?.find("." + GUIDELINE_ID) ??
          []) {
          guideLine.destroy();
        }

        // find possible snapping lines
        const lineGuideStops = getLineGuideStops();
        // find snapping points of current object
        const itemBounds = getObjectSnappingEdges();

        // now find where can we snap current object
        const guides = getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        if (!guides.length) {
          return;
        }

        drawGuides(guides);

        const pos = e.target.position();
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

      const left = mathRound2(e.target.x() - (offsetsFromStroke?.x ?? 0));
      const top = mathRound2(e.target.y() - (offsetsFromStroke?.y ?? 0));

      if (layerRef.current) {
        onSetTransformingLayer?.({
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
    ]
  );

  const handleDragStart = () => {
    setDragging(true);
    onDragStart?.(layerRef.current);

    if (layerRef.current) onSetTransformingLayer?.(layerRef.current);

    if (pressedKey !== "alt") {
      onSelect?.();
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setDragging(false);

    for (const guideLine of stageRef?.current?.find("." + GUIDELINE_ID) ?? []) {
      guideLine.destroy();
    }

    const left = mathRound2(e.target.x() - (offsetsFromStroke?.x ?? 0));
    const top = mathRound2(e.target.y() - (offsetsFromStroke?.y ?? 0));

    if (cloningLayerRef.current && layerRef.current) {
      onCloneMove?.({
        ...cloningLayerRef.current,
        layer_data: {
          ...cloningLayerRef.current.layer_data,
          left,
          top,
        },
      });
      e.target.x(
        layerRef.current.layer_data.left + (offsetsFromStroke?.x ?? 0)
      );
      e.target.y(layerRef.current.layer_data.top + (offsetsFromStroke?.y ?? 0));
    } else if (onChange) {
      onSelect?.();
      onChange({ left, top });
    }
    onDragEnd?.();
    onSetTransformingLayer?.(null);
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
