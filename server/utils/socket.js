const _ = require("lodash");
const socket = require("socket.io");
const LayerService = require("../services/layerService");
const SchemeService = require("../services/schemeService");
const UserService = require("../services/userService");

class SocketServer {
  constructor(server) {
    this.io = socket(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.use(async (socket, next) => {
      const tokenString = socket.handshake.auth.token;
      if (!tokenString) {
        next(new Error("No token"));
      } else {
        const token = JSON.parse(tokenString);
        if (token && token.usr && token.hash) {
          try {
            let user = await UserService.getMe(token.usr);
            if (user.password === token.hash) {
              next();
            } else {
              next(new Error("Invalid token"));
            }
          } catch (_err) {
            next(new Error("Invalid token"));
          }
        } else {
          next(new Error("Invalid token"));
        }
      }
    });

    this.io.on("connection", this.onConnection.bind(this));
    this.io.engine.on("connection_error", this.onConnectinError);
    global.io = this.io;
  }
  initClient(socket) {
    console.log("New client connected: ", socket.id);
  }
  onConnection(socket) {
    this.initClient(socket);
    socket.on("room", (room) => {
      socket.room = room;
      socket.join(room);
      console.log(socket.id, "joined", room, "rooms: ", socket.rooms);
    });
    socket.on("disconnect", (reason) => {
      console.log("Client Disconnected: ", socket.id, reason);
    });
    socket.on("client-create-layer", (data) =>
      this.onClientCreateLayer.bind(this)(socket, data)
    );
    socket.on("client-create-layer-list", (data) =>
      this.onClientCreateLayerList.bind(this)(socket, data)
    );
    socket.on("client-update-layer", (data) =>
      this.onClientUpdateLayer.bind(this)(socket, data)
    );
    socket.on("client-bulk-update-layer", (data) =>
      this.onClientBulkUpdateLayer.bind(this)(socket, data)
    );
    socket.on("client-delete-layer", (data) =>
      this.onClientDeleteLayer.bind(this)(socket, data)
    );
    socket.on("client-delete-layer-list", (data) =>
      this.onClientDeleteLayerList.bind(this)(socket, data)
    );
    socket.on("client-update-scheme", (data) =>
      this.onClientUpdateScheme.bind(this)(socket, data)
    );
    socket.on("client-delete-scheme", (data) =>
      this.onClientDeleteScheme.bind(this)(socket, data)
    );
  }

  onConnectinError(err) {
    console.log("----Connection Error----------");
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
    console.log("-----------------------------");
  }

  async checkEditableScheme(userID, schemeID) {
    const scheme = await SchemeService.getById(schemeID);

    const editable =
      userID === scheme.user_id ||
      scheme.sharedUsers.find(
        (shared) => shared.user_id === userID && shared.editable
      );

    if (!editable) {
      throw new Error("You are not authorized to access this resource.");
    }
  }

  async onClientUpdateLayer(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.to(socket.room).emit("client-update-layer", requestData);
        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });
        await LayerService.updateById(requestData.data.id, requestData.data);
        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientBulkUpdateLayer(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.broadcast
          .to(socket.room)
          .emit("client-bulk-update-layer", requestData);

        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });

        await LayerService.bulkUpdate(requestData.data);
        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientCreateLayer(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.to(socket.room).emit("client-create-layer", requestData);
        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });

        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientCreateLayerList(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.broadcast
          .to(socket.room)
          .emit("client-create-layer-list", requestData);
        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });

        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientDeleteLayer(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.to(socket.room).emit("client-delete-layer", requestData);

        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });

        await LayerService.deleteById(requestData.data.id);
        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientDeleteLayerList(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, socket.room);
        socket.broadcast
          .to(socket.room)
          .emit("client-delete-layer-list", requestData);

        const schemeUpdatePayload = {
          date_modified: Math.round(new Date().getTime() / 1000),
          last_modified_by: requestData.userID,
          thumbnail_updated: 0,
          race_updated: 0,
        };
        this.io.in(socket.room).emit("client-update-scheme", {
          ...requestData,
          data: { id: socket.room, ...schemeUpdatePayload },
        });

        for (let layer of requestData.data) {
          await LayerService.deleteById(layer.id);
        }
        await SchemeService.updateById(socket.room, schemeUpdatePayload);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("socket.room is empty");
    }
  }

  async onClientUpdateScheme(socket, requestData) {
    try {
      if (socket.room) {
        await this.checkEditableScheme(requestData.userID, requestData.data.id);
        socket.broadcast
          .to(socket.room)
          .emit("client-update-scheme", requestData);
        socket.broadcast
          .to("general")
          .emit("client-update-scheme", requestData); // Broadcast to General room

        await SchemeService.updateById(requestData.data.id, {
          ...requestData.data,
          last_modified_by: requestData.userID,
        });
      } else {
        console.log("socket.room is empty");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async onClientDeleteScheme(socket, requestData) {
    if (socket.room) {
      try {
        await this.checkEditableScheme(requestData.userID, requestData.data.id);
        socket.to(socket.room).emit("client-delete-scheme");
        socket.broadcast
          .to("general")
          .emit("client-delete-scheme", { data: { id: socket.room } }); // Broadcast to General room
        SchemeService.deleteById(requestData.data.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("socket.room is empty");
    }
  }
}

module.exports = SocketServer;
