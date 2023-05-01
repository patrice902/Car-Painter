import { Node } from "konva/types/Node";
import { Circle } from "konva/types/shapes/Circle";
import { Ellipse } from "konva/types/shapes/Ellipse";
import { Image } from "konva/types/shapes/Image";
import { Star } from "konva/types/shapes/Star";
import { Text } from "konva/types/shapes/Text";
import _ from "lodash";
import { RefObject, useCallback, useMemo, useState } from "react";
import { AllowedLayerProps } from "src/constant";
import { mathRound2 } from "src/helper";
import {
  LineObjLayerData,
  LogoObjLayerData,
  MovableObjLayerData,
  OffsetsFromStroke,
  PartialAllLayerData,
  RectObjLayerData,
  ShapeBaseObjLayerData,
} from "src/types/common";
import { LayerTypes, MouseModes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

interface UseTransformProps {
  shapeRef: RefObject<Node>;
  imageshapeRef?: RefObject<Node>;
  layer?: BuilderLayerJSON<MovableObjLayerData>;
  offsetsFromStroke?: OffsetsFromStroke;
  applyCaching?: () => void;
  onSetTransformingLayer?: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onChange?: (data: PartialAllLayerData) => void;
}

export const useTransform = ({
  shapeRef,
  imageshapeRef,
  layer,
  offsetsFromStroke,
  onChange,
  onDragStart,
  onDragEnd,
  onSetTransformingLayer,
  applyCaching,
}: UseTransformProps) => {
  const [transforming, setTransforming] = useState(false);
  const AllowedLayerTypes = useMemo(
    () =>
      !layer || !layer.layer_type
        ? []
        : layer.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[layer.layer_type]
        : AllowedLayerProps[LayerTypes.SHAPE][
            (layer.layer_data as ShapeBaseObjLayerData)
              .type as keyof typeof AllowedLayerProps[LayerTypes.SHAPE]
          ],
    [layer]
  );

  // const getShapeClientRect = useCallback((node) => {
  //   return node.getClientRect({
  //     relativeTo: node.getParent().getParent(),
  //     skipShadow: true,
  //   });
  // }, []);

  const getTransformChange = useCallback(
    (shouldChange = false) => {
      let transform: PartialAllLayerData = {};
      const node = shapeRef.current;

      if (node && layer) {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        const ellipseNode = node as Ellipse;
        const width =
          (layer.layer_data as ShapeBaseObjLayerData).type !==
          MouseModes.ELLIPSE
            ? node.width()
            : ellipseNode.radiusX();
        const height =
          (layer.layer_data as ShapeBaseObjLayerData).type !==
          MouseModes.ELLIPSE
            ? node.height()
            : ellipseNode.radiusY();
        const xyScale = Math.abs(
          Math.abs(mathRound2(scaleY)) !== 1 ? scaleY : scaleX
        );

        transform = {
          left: mathRound2(
            node.x() - (offsetsFromStroke ? offsetsFromStroke.x : 0)
          ),
          top: mathRound2(
            node.y() - (offsetsFromStroke ? offsetsFromStroke.y : 0)
          ),
          rotation: mathRound2(node.rotation()) || 0,
          flop: scaleX > 0 ? 0 : 1,
          flip: scaleY > 0 ? 0 : 1,
        };

        if (imageshapeRef?.current) {
          transform.shadowBlur = mathRound2(
            (imageshapeRef.current as Image).shadowBlur() * xyScale
          );
        } else {
          transform.shadowBlur = mathRound2(
            (node as Image).shadowBlur() * xyScale
          );
        }

        const movableLayerData = layer.layer_data as MovableObjLayerData;
        if (movableLayerData.shadowOffsetX || movableLayerData.shadowOffsetY) {
          transform.shadowOffsetX = mathRound2(
            movableLayerData.shadowOffsetX * Math.abs(scaleX)
          );
          transform.shadowOffsetY = mathRound2(
            movableLayerData.shadowOffsetY * Math.abs(scaleY)
          );
        }

        const circleNode = node as Circle;
        if (circleNode.radius) {
          transform.radius = mathRound2(
            Math.max(1, circleNode.radius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.radius : 0)
          );
        }

        const starNode = node as Star;
        if (starNode.innerRadius) {
          transform.innerRadius = mathRound2(
            Math.max(1, starNode.innerRadius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.innerRadius : 0)
          );
        }

        if (starNode.outerRadius) {
          transform.outerRadius = mathRound2(
            Math.max(1, starNode.outerRadius() * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.outerRadius : 0)
          );
        }

        const rectLayerData = layer.layer_data as RectObjLayerData;
        if (
          rectLayerData.cornerTopLeft ||
          rectLayerData.cornerTopRight ||
          rectLayerData.cornerBottomLeft ||
          rectLayerData.cornerBottomRight
        ) {
          transform.cornerTopLeft = mathRound2(
            rectLayerData.cornerTopLeft * xyScale
          );
          transform.cornerTopRight = mathRound2(
            rectLayerData.cornerTopRight * xyScale
          );
          transform.cornerBottomLeft = mathRound2(
            rectLayerData.cornerBottomLeft * xyScale
          );
          transform.cornerBottomRight = mathRound2(
            rectLayerData.cornerBottomRight * xyScale
          );
        }

        const lineLayerData = layer.layer_data as LineObjLayerData;
        if (lineLayerData.points) {
          transform.points = lineLayerData.points.map((point, index) =>
            index % 2 === 0
              ? mathRound2(point * Math.abs(scaleX))
              : mathRound2(point * Math.abs(scaleY))
          );
        }

        const logoLayerData = layer.layer_data as LogoObjLayerData;
        if (logoLayerData.paddingX || logoLayerData.paddingY) {
          transform.paddingX = mathRound2(
            (logoLayerData.paddingX || 0) * Math.abs(scaleX)
          );
          transform.paddingY = mathRound2(
            (logoLayerData.paddingY || 0) * Math.abs(scaleY)
          );
        }

        const textNode = node as Text;
        if (layer.layer_type === LayerTypes.TEXT) {
          transform.scaleX = mathRound2(Math.max(0.01, Math.abs(scaleX)));
          transform.scaleY = mathRound2(Math.max(0.01, Math.abs(scaleY)));
          transform.width = mathRound2(Math.max(5, textNode.width()));
          transform.height = mathRound2(Math.max(5, textNode.height()));
        } else {
          // we will reset it back
          if (shouldChange) {
            textNode.scaleX(scaleX > 0 ? 1 : -1);
            textNode.scaleY(scaleY > 0 ? 1 : -1);
          }
          transform.width = mathRound2(
            Math.max(1, width * Math.abs(scaleX)) -
              (offsetsFromStroke ? offsetsFromStroke.width : 0)
          );
          transform.height = mathRound2(
            Math.max(1, height * Math.abs(scaleY)) -
              (offsetsFromStroke ? offsetsFromStroke.height : 0)
          );
          if (textNode.strokeWidth) {
            transform.stroke = mathRound2(textNode.strokeWidth() * xyScale);
          }
        }
      }

      return _.pick(
        transform,
        AllowedLayerTypes.filter((item) =>
          item.includes("layer_data.")
        ).map((item) => item.replaceAll("layer_data.", ""))
      );
    },
    [AllowedLayerTypes, imageshapeRef, layer, offsetsFromStroke, shapeRef]
  );

  const handleTransformStart = useCallback(() => {
    if (!layer) return;
    setTransforming(true);
    onSetTransformingLayer?.(layer);
    onDragStart?.();
  }, [layer, onDragStart, onSetTransformingLayer]);

  const handleTransformEnd = useCallback(() => {
    setTransforming(false);
    onSetTransformingLayer?.(null);
    // const opacity = layer ? layer.layer_data.opacity : 1;
    // e.target.opacity(opacity);
    if (onChange) {
      onChange(getTransformChange(true));
      applyCaching?.();
      onDragEnd?.();
    }
  }, [
    onSetTransformingLayer,
    onChange,
    getTransformChange,
    applyCaching,
    onDragEnd,
  ]);

  const handleTransform = useCallback(() => {
    // let opacity = layer ? layer.layer_data.opacity : 1;
    // var box = getShapeClientRect(e.target);
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
    if (!layer) return;

    onSetTransformingLayer?.({
      ...layer,
      layer_data: {
        ...layer.layer_data,
        ...getTransformChange(),
      },
    });
  }, [getTransformChange, layer, onSetTransformingLayer]);

  return {
    transforming,
    handleTransformStart,
    handleTransformEnd,
    handleTransform,
  };
};
