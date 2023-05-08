import Konva from "konva";
import { Image } from "konva/types/shapes/Image";
import _ from "lodash";
import React, { RefObject, useCallback, useEffect, useMemo } from "react";
import { Transformer } from "react-konva";
import { useSelector } from "react-redux";
import RotateIcon from "src/assets/rotate-left.svg";
import {
  getPointsBoxSize,
  getSnapRotation,
  isCenterBasedShape,
  rotateAroundCenter,
} from "src/helper";
import { RootState } from "src/redux";
import {
  ArcObjLayerData,
  CircleObjLayerData,
  LineObjLayerData,
  MovableObjLayerData,
  RectObjLayerData,
  ShapeObjLayerData,
  TextObjLayerData,
} from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";
import useImage from "use-image";

type TransformerComponentProps = {
  trRef: RefObject<Konva.Transformer>;
  selectedLayer: BuilderLayerJSON | undefined;
  hoveredTransform?: boolean;
};

const ANCHOR_SIZE_UPPER = 15;
const ANCHOR_SIZE_LOWER = 5;

export const TransformerComponent = React.memo(
  ({ trRef, selectedLayer, hoveredTransform }: TransformerComponentProps) => {
    const zoom = useSelector((state: RootState) => state.boardReducer.zoom);
    const pressedKey = useSelector(
      (state: RootState) => state.boardReducer.pressedKey
    );

    const minScaledSize = useMemo(() => {
      if (!selectedLayer) return 0;

      if (selectedLayer.layer_type === LayerTypes.TEXT) {
        const textLayerData = selectedLayer.layer_data as TextObjLayerData;

        return (
          textLayerData.size *
          Math.min(textLayerData.scaleX ?? 1, textLayerData.scaleY ?? 1)
        );
      }

      if (selectedLayer.layer_type === LayerTypes.SHAPE) {
        const shapeLayerData = selectedLayer.layer_data as ShapeObjLayerData;

        if ((shapeLayerData as CircleObjLayerData).radius) {
          return (shapeLayerData as CircleObjLayerData).radius;
        }

        if ((shapeLayerData as ArcObjLayerData).outerRadius) {
          return (shapeLayerData as ArcObjLayerData).outerRadius;
        }

        if ((shapeLayerData as LineObjLayerData).points) {
          const boundBox = getPointsBoxSize(
            (shapeLayerData as LineObjLayerData).points
          );

          return Math.min(boundBox.width, boundBox.height);
        }
      }

      const movableLayerData = selectedLayer.layer_data as MovableObjLayerData;

      if (!movableLayerData.width || !movableLayerData.height) {
        return ANCHOR_SIZE_UPPER;
      }

      return Math.min(movableLayerData.width, movableLayerData.height);
    }, [selectedLayer]);

    const anchorSize = useMemo(
      () =>
        _.clamp(
          (minScaledSize * zoom) / 5,
          ANCHOR_SIZE_LOWER,
          ANCHOR_SIZE_UPPER
        ),
      [zoom, minScaledSize]
    );

    const [icon] = useImage(RotateIcon);
    const keepRatio = useMemo(
      () =>
        selectedLayer &&
        ((selectedLayer.layer_data as RectObjLayerData).sizeLocked ||
          isCenterBasedShape(
            (selectedLayer.layer_data as RectObjLayerData).type
          ) ||
          pressedKey === "shift"),
      [selectedLayer, pressedKey]
    );
    const rotatorCanvas = useMemo(() => {
      if (!icon) {
        return null;
      }
      const canvas = document.createElement("canvas");
      canvas.width = anchorSize;
      canvas.height = anchorSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(icon, 0, 0, canvas.width, canvas.height);

      return canvas;
    }, [anchorSize, icon]);

    const centeredScaling = useMemo(() => pressedKey === "alt", [pressedKey]);

    const checkNode = useCallback(() => {
      if (!rotatorCanvas) {
        return;
      }

      if (selectedLayer && trRef.current) {
        const tr = trRef.current;
        const stage = tr.getStage();

        if (!stage) return;

        const selectedNode = stage.findOne("." + selectedLayer.id);

        if (selectedNode) {
          tr.nodes([selectedNode]);
        } else {
          tr.detach();
        }

        const rotater = tr.findOne(".rotater");
        (rotater as Image)?.fillPriority("pattern");
        (rotater as Image)?.fillPatternImage(
          (rotatorCanvas as unknown) as HTMLImageElement
        );

        tr.getLayer()?.batchDraw();
      }
    }, [selectedLayer, trRef, rotatorCanvas]);

    useEffect(() => {
      checkNode();
    }, [checkNode]);

    const boundBoxFunc = useCallback(
      (oldBoundBox, newBoundBox) => {
        const closesSnap = getSnapRotation(newBoundBox.rotation);
        const diff = closesSnap - oldBoundBox.rotation;
        if (pressedKey === "shift") {
          if (newBoundBox.rotation - oldBoundBox.rotation === 0) {
            return newBoundBox;
          }
          if (Math.abs(diff) > 0) {
            return rotateAroundCenter(oldBoundBox, diff);
          }
          return oldBoundBox;
        }
        return newBoundBox;
      },
      [pressedKey]
    );

    if (
      selectedLayer &&
      ![LayerTypes.CAR, LayerTypes.BASE].includes(selectedLayer.layer_type)
    )
      return (
        <Transformer
          id="defaultTransformer"
          ref={trRef}
          keepRatio={keepRatio}
          enabledAnchors={
            hoveredTransform || pressedKey === "h"
              ? []
              : keepRatio
              ? ["top-left", "top-right", "bottom-left", "bottom-right"]
              : [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]
          }
          borderEnabled={pressedKey !== "h"}
          rotateEnabled={!hoveredTransform && pressedKey !== "h"}
          boundBoxFunc={boundBoxFunc}
          borderStroke={hoveredTransform ? "red" : "rgb(77, 158, 224)"}
          borderStrokeWidth={3}
          centeredScaling={centeredScaling}
          anchorStroke="gray"
          anchorStrokeWidth={2}
          anchorFill="white"
          anchorSize={anchorSize}
          anchorCornerRadius={anchorSize}
        />
      );
    return <></>;
  }
);

export default TransformerComponent;
