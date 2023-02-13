import config from "config";
import CookieService from "services/cookieService";
import socketIOClient from "socket.io-client";

class SocketClient {
  static connect = () => {
    this.socket = socketIOClient(config.backendURL, {
      transports: ["websocket"],
      auth: {
        token: JSON.stringify(CookieService.getSiteLogin()),
      },
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
