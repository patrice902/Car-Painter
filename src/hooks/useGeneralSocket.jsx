import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteListItem as deleteSchemeListItem,
  updateListItem as updateSchemeListItem,
} from "redux/reducers/schemeReducer";
import SocketClient from "utils/socketClient";

export const useGeneralSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket.io Stuffs
    SocketClient.connect();

    SocketClient.on("connect", () => {
      SocketClient.emit("room", "general"); // Join General room
    });

    SocketClient.on("connect_error", () => {
      setTimeout(() => {
        SocketClient.connect();
      }, 1000);
    });

    SocketClient.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        SocketClient.connect();
      }
      // else the socket will automatically try to reconnect
    });

    SocketClient.on("client-update-scheme", (response) => {
      dispatch(updateSchemeListItem(response.data));
    });

    SocketClient.on("client-delete-scheme", (response) => {
      dispatch(deleteSchemeListItem(response.data.id));
    });

    return () => {
      SocketClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
