import socketIOClient from "socket.io-client";
import config from "config";

class SocketClient {
  static connect = () => {
    this.socket = socketIOClient(config.backendURL, {
      transports: ["websocket"],
    });
  };

  static disconnect = () => {
    this.socket.disconnect();
  };

  static emit = (event, data) => {
    this.socket.emit(event, data);
  };

  static on = (event, handler) => {
    this.socket.on(event, handler);
  };

  static ioOn = (event, handler) => {
    this.socket.io.on(event, handler);
  };
}

export default SocketClient;
