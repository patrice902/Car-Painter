import socketIOClient, { Socket } from "socket.io-client";
import config from "src/config";
import CookieService from "src/services/cookieService";

class SocketClient {
  socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  connect = () => {
    this.socket = socketIOClient(config.backendURL, {
      transports: ["websocket"],
      auth: {
        token: JSON.stringify(CookieService.getSiteLogin()),
      },
    });
  };

  disconnect = () => {
    this.socket?.disconnect();
  };

  emit = (event: string, data: unknown) => {
    this.socket?.emit(event, data);
  };

  on = (event: string, handler: (..._: unknown[]) => void) => {
    this.socket?.on(event, handler);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ioOn = (event: any, handler: (..._: unknown[]) => void) => {
    this.socket?.io.on(event, handler);
  };
}

const socketClient = new SocketClient();

export default socketClient;
