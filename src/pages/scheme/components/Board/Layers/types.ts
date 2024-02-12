import { Stage } from "konva/types/Stage";
import { RefObject } from "react";
import { MovableObjLayerData } from "src/types/common";
import { BuilderLayerJSON } from "src/types/query";

export type MovableLayerProps<T extends MovableObjLayerData> = {
  stageRef: RefObject<Stage>;
  editable?: boolean;
  virtual?: boolean;
  specMode?: boolean;
  layer: BuilderLayerJSON<T>;
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
