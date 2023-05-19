import { configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "connected-react-router";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import config from "src/config";
import history from "src/utils/history";

import createRootReducer from "./reducers";

const devMode = config.env === "development";

const rootReducer = createRootReducer(history);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      routerMiddleware(history),
      ...(devMode ? [logger] : []),
    ]),
});

export type GetState = typeof store.getState;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
