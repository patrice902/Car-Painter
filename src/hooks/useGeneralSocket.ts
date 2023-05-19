import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteListItem as deleteSchemeListItem,
  updateListItem as updateSchemeListItem,
} from "src/redux/reducers/schemeReducer";
import { BuilderScheme } from "src/types/model";
import socketClient from "src/utils/socketClient";

export const useGeneralSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket.io Stuffs
    socketClient.connect();

    socketClient.on("connect", () => {
      socketClient.emit("room", "general"); // Join General room
    });

    socketClient.on("connect_error", () => {
      setTimeout(() => {
        socketClient.connect();
      }, 1000);
    });

    socketClient.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socketClient.connect();
      }
      // else the socket will automatically try to reconnect
    });

    socketClient.on("client-update-scheme", (response) => {
      dispatch(
        updateSchemeListItem((response as { data: BuilderScheme }).data)
      );
    });

    socketClient.on("client-delete-scheme", (response) => {
      dispatch(
        deleteSchemeListItem((response as { data: { id: number } }).data.id)
      );
    });

    return () => {
      socketClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
