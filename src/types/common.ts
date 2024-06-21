import { BoxProps } from "@material-ui/core";

import { MouseModes } from "./enum";
import { BuilderLayer } from "./model";
import { BuilderLayerJSON } from "./query";

export type Position = {
  x: number;
  y: number;
};

export type FrameSize = {
  width: number;
  height: number;
};

export type ScrollPosition = {
  path: string;
  position: number;
};

export type BoundBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export interface DefaultLayerData {
  name: string;
  finish: string;
  finishBase: string;
}

export interface GuideData {
  defaultColor?: string;
  default_shape_color?: string;
  default_shape_scolor?: string;
  default_shape_stroke?: number;
  default_shape_opacity?: number;
  show_wireframe?: boolean;
  blend_wireframe?: boolean;
  show_numberBlocks?: boolean;
  show_sponsor?: boolean;
  show_grid?: boolean;
  show_sponsor_block_on_top?: boolean;
  show_number_block_on_top?: boolean;
  show_carparts_on_top?: boolean;
  carmask_color?: string;
  carmask_opacity?: number;
  wireframe_color?: string;
  wireframe_opacity?: number;
  sponsor_color?: string;
  sponsor_opacity?: number;
  numberblock_color?: string;
  numberblock_opacity?: number;
  grid_color?: string;
  grid_opacity?: number;
  grid_stroke?: number;
  grid_padding?: number;
  snap_grid?: boolean;
}

export interface MovableObjLayerData extends DefaultLayerData {
  left: number;
  top: number;
  skewX: number;
  skewY: number;
  rotation: number;
  flop: number;
  flip: number;
  stroke: number;
  scolor?: string;
  opacity: number;
  shadowColor?: string;
  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  width?: number;
  height?: number;
  editLock?: boolean;
  showOnTop?: boolean;
  ownerForGallery?: number;
}

export interface TextObjLayerData extends MovableObjLayerData {
  text: string;
  color: string;
  scaleX: number;
  scaleY: number;
  font: number;
  size: number;
  sizeLocked: boolean;
}

export interface LogoObjLayerData extends MovableObjLayerData {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  bgColor: string;
  bgCornerTopLeft: number;
  bgCornerTopRight: number;
  bgCornerBottomLeft: number;
  bgCornerBottomRight: number;
  source_file: string;
  preview_file: string;
  sizeLocked: boolean;
  legacy?: boolean;
  img?: string;
  fromCarParts?: boolean;
}

export interface UploadObjLayerData extends LogoObjLayerData {
  id: number;
  fromOldSource: boolean;
}

export interface OverlayObjLayerData extends MovableObjLayerData {
  width: number;
  height: number;
  color: string;
  sizeLocked: boolean;
  stroke: number;
  stroke_scale: number;
  legacy: boolean;
  source_file: string;
  preview_file: string;
}

export interface ShapeBaseObjLayerData extends MovableObjLayerData {
  type: MouseModes;
  sizeLocked: boolean;
  blendType: string;
}

export interface RectObjLayerData extends ShapeBaseObjLayerData {
  width: number;
  height: number;
  color: string;
  strokeType: string;
  cornerTopLeft: number;
  cornerTopRight: number;
  cornerBottomLeft: number;
  cornerBottomRight: number;
}

export interface CircleObjLayerData extends ShapeBaseObjLayerData {
  radius: number;
  strokeType: string;
  color: string;
}

export interface EllipseObjLayerData extends ShapeBaseObjLayerData {
  width: number;
  height: number;
  strokeType: string;
  color: string;
}

export interface StarObjLayerData extends ShapeBaseObjLayerData {
  innerRadius: number;
  outerRadius: number;
  numPoints: number;
  color: string;
}

export interface RingObjLayerData extends ShapeBaseObjLayerData {
  innerRadius: number;
  outerRadius: number;
  color: string;
  strokeType: string;
}

export interface RegularPolygonObjLayerData extends ShapeBaseObjLayerData {
  radius: number;
  numPoints: number;
  color: string;
  strokeType: string;
}

export interface WedgeObjLayerData extends ShapeBaseObjLayerData {
  radius: number;
  angle: number;
  color: string;
  strokeType: string;
}

export interface ArcObjLayerData extends ShapeBaseObjLayerData {
  innerRadius: number;
  outerRadius: number;
  angle: number;
  color: string;
  strokeType: string;
}

export interface LineObjLayerData extends ShapeBaseObjLayerData {
  points: number[];
  lineCap: string;
  lineJoin: string;
}

export type PolygonObjLayerData = LineObjLayerData;

export type PenObjLayerData = LineObjLayerData;

export interface ArrowObjLayerData extends LineObjLayerData {
  pointerLength: number;
  pointerWidth: number;
  color: string;
  strokeType: string;
}

export type ShapeObjLayerData =
  | RectObjLayerData
  | CircleObjLayerData
  | EllipseObjLayerData
  | StarObjLayerData
  | RingObjLayerData
  | RegularPolygonObjLayerData
  | WedgeObjLayerData
  | ArcObjLayerData
  | LineObjLayerData
  | PolygonObjLayerData
  | PenObjLayerData
  | ArrowObjLayerData;

export interface BaseObjLayerData extends DefaultLayerData {
  opacity: number;
  color: string;
}

export interface CarObjLayerData extends DefaultLayerData {
  color?: string;
  img: string;
  legacy?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  isFullUrl?: boolean;
}

export type PartialAllLayerData = Partial<
  TextObjLayerData &
    LogoObjLayerData &
    UploadObjLayerData &
    OverlayObjLayerData &
    RectObjLayerData &
    CircleObjLayerData &
    EllipseObjLayerData &
    StarObjLayerData &
    RingObjLayerData &
    RegularPolygonObjLayerData &
    WedgeObjLayerData &
    ArcObjLayerData &
    LineObjLayerData &
    ArrowObjLayerData
>;

export type BuilderLayerJSONParitalAll = Omit<BuilderLayer, "layer_data"> & {
  layer_data: PartialAllLayerData;
};

export interface CommonLayerProps {
  layer_visible: boolean;
  layer_locked: boolean;
  clone: boolean;
  delete: boolean;
}

export interface CSSStyleDeclarationWithMozTransform
  extends CSSStyleDeclaration {
  MozTransform: string;
}

export interface OffsetsFromStroke {
  x: number;
  y: number;
  height: number;
  width: number;
  radius: number;
  pointerLength: number;
  pointerWidth: number;
  innerRadius: number;
  outerRadius: number;
}

export type DrawingLayerJSON = Omit<
  BuilderLayerJSON<LineObjLayerData | ArrowObjLayerData>,
  "id" | "scheme_id"
>;

export type DraftShapeLayerJSON = Omit<
  BuilderLayerJSON<ShapeBaseObjLayerData>,
  "id" | "scheme_id"
>;

export type CustomTabPanelProps = BoxProps & {
  children?: React.ReactNode;
  value: number;
  index: number;
};

export type ValueMap = Record<
  string | number,
  string | number | boolean | undefined | null
>;
