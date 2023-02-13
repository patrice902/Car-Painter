import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import authReducer from "./authReducer";
import basePaintReducer from "./basePaintReducer";
import boardReducer from "./boardReducer";
import carMakeReducer from "./carMakeReducer";
import carPinReducer from "./carPinReducer";
import carReducer from "./carReducer";
import downloaderReducer from "./downloaderReducer";
import fontReducer from "./fontReducer";
import layerReducer from "./layerReducer";
import leagueSeriesReducer from "./leagueSeriesReducer";
import logoReducer from "./logoReducer";
import messageReducer from "./messageReducer";
import overlayReducer from "./overlayReducer";
import schemeReducer from "./schemeReducer";
import teamReducer from "./teamReducer";
import themeReducer from "./themeReducer";
import uploadReducer from "./uploadReducer";

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    boardReducer,
    messageReducer,
    themeReducer,
    schemeReducer,
    carReducer,
    carMakeReducer,
    basePaintReducer,
    layerReducer,
    overlayReducer,
    logoReducer,
    uploadReducer,
    fontReducer,
    teamReducer,
    carPinReducer,
    downloaderReducer,
    leagueSeriesReducer,
  });

export default reducers;
