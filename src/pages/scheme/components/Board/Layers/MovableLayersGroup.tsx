import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, { RefObject, useMemo } from "react";
import { useSelector } from "react-redux";
import { sortLayers } from "src/helper";
import { useLayer } from "src/hooks";
import { RootState } from "src/redux";
import {
  LogoObjLayerData,
  MovableObjLayerData,
  OverlayObjLayerData,
  ShapeBaseObjLayerData,
  TextObjLayerData,
} from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import { DrawingShapeLayer } from "./DrawingShapeLayer";
import { LogoLayer } from "./LogoLayer";
import { OverlayLayer } from "./OverlayLayer";
import { ShapeLayer } from "./ShapeLayer";
import { TextLayer } from "./TextLayer";

export enum AdditionalFilter {
  ALL = "ALL",
  INCLUDE_SHOW_ON_TOP_ONLY = "INCLUDE_SHOW_ON_TOP_ONLY",
  EXCLUDE_SHOW_ON_TOP = "EXCLUDE_SHOW_ON_TOP",
}

type MovableLayersGroupProps = {
  stageRef: RefObject<Stage>;
  allowedLayerTypes: LayerTypes[];
  editable?: boolean;
  virtual?: boolean;
  specMode?: boolean;
  drawingLayer?: BuilderLayerJSON<ShapeBaseObjLayerData> | null;
  additionalFilterOption?: AdditionalFilter;
  isMerged?: boolean;
  onSetTransformingLayer?: (
    layer: BuilderLayerJSON<MovableObjLayerData> | null
  ) => void;
  onHover?: (
    layer: BuilderLayerJSON<MovableObjLayerData>,
    flag: boolean
  ) => void;
  onLayerDragStart?: (layer?: BuilderLayerJSON<MovableObjLayerData>) => void;
  onLayerDragEnd?: () => void;
};

const filterByAdditional = (
  item: BuilderLayerJSON<MovableObjLayerData>,
  option?: AdditionalFilter
) => {
  if (option === AdditionalFilter.INCLUDE_SHOW_ON_TOP_ONLY) {
    if (item.layer_data?.showOnTop) {
      return true;
    } else {
      return false;
    }
  }

  if (option === AdditionalFilter.EXCLUDE_SHOW_ON_TOP) {
    if (item.layer_data?.showOnTop) {
      return false;
    } else {
      return true;
    }
  }

  return true;
};

export const MovableLayersGroup = React.memo(
  ({
    drawingLayer,
    allowedLayerTypes,
    additionalFilterOption,
    isMerged,
    ...props
  }: MovableLayersGroupProps) => {
    const { layerList, cloningLayer, cloningQueue } = useLayer();
    const owner = useSelector((state: RootState) => state.schemeReducer.owner);

    const filteredLayers = useMemo(
      () =>
        sortLayers(
          layerList.filter(
            (item) =>
              allowedLayerTypes.includes(item.layer_type) &&
              filterByAdditional(
                item as BuilderLayerJSON<MovableObjLayerData>,
                additionalFilterOption
              )
          ),
          owner?.id,
          true,
          isMerged
        ),
      [
        layerList,
        owner?.id,
        isMerged,
        allowedLayerTypes,
        additionalFilterOption,
      ]
    );

    const resultLayers = useMemo(() => {
      let newLayers = [...filteredLayers];
      if (cloningLayer) {
        newLayers = [...newLayers, cloningLayer];
      }
      if (cloningQueue.length) {
        newLayers = [...newLayers, ...cloningQueue];
      }
      return newLayers as BuilderLayerJSON<MovableObjLayerData>[];
    }, [cloningLayer, cloningQueue, filteredLayers]);

    return (
      <>
        {resultLayers.map((layer) => {
          switch (layer.layer_type) {
            case LayerTypes.SHAPE:
              return (
                <ShapeLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<ShapeBaseObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.LOGO:
            case LayerTypes.UPLOAD:
              return (
                <LogoLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<LogoObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.OVERLAY:
              return (
                <OverlayLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<OverlayObjLayerData>}
                  {...props}
                />
              );
            case LayerTypes.TEXT:
              return (
                <TextLayer
                  key={layer.id}
                  layer={layer as BuilderLayerJSON<TextObjLayerData>}
                  {...props}
                />
              );
            default:
              return <></>;
          }
        })}
        {drawingLayer ? <DrawingShapeLayer layer={drawingLayer} /> : <></>}
      </>
    );
  }
);
