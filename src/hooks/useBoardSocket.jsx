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
} from "redux/reducers/layerReducer";
import { setMessage } from "redux/reducers/messageReducer";
import {
  setCurrent as setCurrentScheme,
  setSocketConnected,
  updateListItem as updateSchemeListItem,
} from "redux/reducers/schemeReducer";
import SocketClient from "utils/socketClient";

export const useBoardSocket = () => {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  // Socket.io Stuffs
  useEffect(() => {
    SocketClient.connect();

    SocketClient.on("connect", () => {
      dispatch(setSocketConnected(true));
      SocketClient.emit("room", params.id);
    });

    SocketClient.on("connect_error", (err) => {
      console.log("WebSocket Error: ", err);
      dispatch(setSocketConnected(false));
      setTimeout(() => {
        SocketClient.connect();
      }, 1000);
    });

    SocketClient.on("disconnect", (reason) => {
      dispatch(setSocketConnected(false));
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        SocketClient.connect();
      }
      // else the socket will automatically try to reconnect
    });

    SocketClient.ioOn("reconnect", () => {
      document.location.reload(true);
    });

    SocketClient.on("client-create-layer", (response) => {
      dispatch(insertToLayerList(response.data));
    });

    SocketClient.on("client-create-layer-list", (response) => {
      dispatch(concatToLayerList(response.data));
    });

    SocketClient.on("client-update-layer", (response) => {
      dispatch(mergeLayerListItem(response.data));
    });

    SocketClient.on("client-bulk-update-layer", (response) => {
      dispatch(mergeLayerListItems(response.data));
    });

    SocketClient.on("client-delete-layer", (response) => {
      dispatch(deleteLayerListItem(response.data));
    });

    SocketClient.on("client-delete-layer-list", (response) => {
      dispatch(deleteLayerListItems(response.data));
    });

    SocketClient.on("client-update-scheme", (response) => {
      dispatch(updateSchemeListItem(response.data));
      dispatch(setCurrentScheme(response.data));
    });

    SocketClient.on("client-renew-carmake-layers", () => {
      document.location.reload(true);
    });

    SocketClient.on("client-delete-scheme", () => {
      dispatch(setMessage({ message: "The Project has been deleted!" }));
      history.push("/");
    });

    return () => {
      SocketClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
