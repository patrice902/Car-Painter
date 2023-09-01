export enum THEMES {
  DEFAULT = "DEFAULT",
  DARK = "DARK",
  LIGHT = "LIGHT",
  BLUE = "BLUE",
  GREEN = "GREEN",
  INDIGO = "INDIGO",
}

export enum Browser {
  CHROME = "CHROME",
  FIREFOX = "FIREFOX",
  SAFARI = "SAFARI",
  OPERA = "OPERA",
  EDGE = "EDGE",
}

export enum LayerTypes {
  TEXT = 1,
  LOGO = 2,
  BASE = 3,
  OVERLAY = 4,
  UPLOAD = 5,
  CAR = 6,
  SHAPE = 7,
}

export enum PaintingGuides {
  CARMASK = "car-mask",
  WIREFRAME = "wireframe",
  SPONSORBLOCKS = "sponsor-blocks",
  NUMBERBLOCKS = "number-blocks",
  GRID = "grid",
}

export enum ViewModes {
  NORMAL_VIEW = "normal",
  SPEC_VIEW = "spec",
}

export enum Palette {
  red = "#ff0000",
  blue = "#0000ff",
  green = "#00ff00",
  yellow = "#FFFF00",
  cyan = "#00FFFF",
  lime = "#BFFF00",
  gray = "#808080",
  orange = "#FFA500",
  purple = "#800080",
  black = "#000000",
  white = "#FFFFFF",
  pink = "#FFC0CB",
  darkblue = "#00008b",
}

export enum DialogTypes {
  BASEPAINT = "BASEPAINT",
  SHAPE = "SHAPE",
  LOGO = "LOGO",
  UPLOAD = "UPLOAD",
  TEXT = "TEXT",
  DEFAULT_SHAPE_SETTINGS = "DEFAULT_SHAPE_SETTINGS",
  SHORTCUTS = "SHORTCUTS",
  SETTINGS = "SETTINGS",
  SHARING = "SHARING",
  RACE = "RACE",
  RACE_CONFIRM = "RACE_CONFIRM",
  SIM_PREVIEW_GUIDE = "SIM_PREVIEW_GUIDE",
}

export enum DrawingStatus {
  CLEAR_COMMAND = "CLEAR_COMMAND",
  ADD_TO_SHAPE = "ADD_TO_SHAPE",
  DRAWING_SHAPE = "DRAWING_SHAPE",
  TRANSFORMING_SHAPE = "TRANSFORMING_SHAPE",
}

export enum MouseModes {
  DEFAULT = "DEFAULT",
  RECT = "Rectangle",
  CIRCLE = "Circle",
  ELLIPSE = "Ellipse",
  REGULARPOLYGON = "Regular Polygon",
  ARROW = "Arrow",
  LINE = "Line",
  WEDGE = "Wedge",
  POLYGON = "Polygon",
  SOFTPOLYGON = "Soft Polygon",
  STAR = "Star",
  RING = "Ring",
  ARC = "Arc",
  PEN = "Pen",
}

export enum HistoryActions {
  SCHEME_CHANGE_ACTION = "SCHEME_CHANGE_ACTION",
  LAYER_ADD_ACTION = "LAYER_ADD_ACTION",
  LAYER_BULK_CHANGE_ACTION = "LAYER_BULK_CHANGE_ACTION",
  LAYER_CHANGE_ACTION = "LAYER_CHANGE_ACTION",
  LAYER_DELETE_ACTION = "LAYER_DELETE_ACTION",
  LAYER_LIST_ADD_ACTION = "LAYER_LIST_ADD_ACTION",
  LAYER_LIST_DELETE_ACTION = "LAYER_LIST_DELETE_ACTION",
}

export enum ConfigCatFlags {
  EMERGENCY_SHUT_DOWN = "emergencyShutDown",
  DISABLE_APP_LOGIN = "disableAppLogin",
  Initializer = "initializer",
}
