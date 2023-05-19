import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  concatList as concatToLayerList,
  deleteListItem as deleteLayerListItem,
  deleteListItems as deleteLayerListItems,
  insertToList as insertToLayerList,
  mergeListItem as mergeLayerListItem,
  mergeListItems as mergeLayerListItems,
} from "src/redux/reducers/layerReducer";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  setCurrent as setCurrentScheme,
  setSocketConnected,
  updateListItem as updateSchemeListItem,
} from "src/redux/reducers/schemeReducer";
import { BuilderLayer, BuilderScheme } from "src/types/model";
import socketClient from "src/utils/socketClient";

export const useBoardSocket = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();

  // Socket.io Stuffs
  useEffect(() => {
    socketClient.connect();

    socketClient.on("connect", () => {
      dispatch(setSocketConnected(true));
      socketClient.emit("room", params.id);
    });

    socketClient.on("connect_error", (err) => {
      console.log("WebSocket Error: ", err);
      dispatch(setSocketConnected(false));
      setTimeout(() => {
        socketClient.connect();
      }, 1000);
    });

    socketClient.on("disconnect", (reason) => {
      dispatch(setSocketConnected(false));
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socketClient.connect();
      }
      // else the socket will automatically try to reconnect
    });

    socketClient.ioOn("reconnect", () => {
      window.location.reload();
    });

    socketClient.on("client-create-layer", (response) => {
      dispatch(insertToLayerList((response as { data: BuilderLayer }).data));
    });

    socketClient.on("client-create-layer-list", (response) => {
      dispatch(concatToLayerList((response as { data: BuilderLayer[] }).data));
    });

    socketClient.on("client-update-layer", (response) => {
      dispatch(mergeLayerListItem((response as { data: BuilderLayer }).data));
    });

    socketClient.on("client-bulk-update-layer", (response) => {
      dispatch(
        mergeLayerListItems((response as { data: BuilderLayer[] }).data)
      );
    });

    socketClient.on("client-delete-layer", (response) => {
      dispatch(deleteLayerListItem((response as { data: BuilderLayer }).data));
    });

    socketClient.on("client-delete-layer-list", (response) => {
      dispatch(
        deleteLayerListItems((response as { data: BuilderLayer[] }).data)
      );
    });

    socketClient.on("client-update-scheme", (response) => {
      dispatch(
        updateSchemeListItem((response as { data: BuilderScheme }).data)
      );
      dispatch(setCurrentScheme((response as { data: BuilderScheme }).data));
    });

    socketClient.on("client-renew-carmake-layers", () => {
      document.location.reload();
    });

    socketClient.on("client-delete-scheme", () => {
      dispatch(setMessage({ message: "The Project has been deleted!" }));
      history.push("/");
    });

    return () => {
      socketClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
