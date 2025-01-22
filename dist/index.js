"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManger_1 = require("./gameManger");
const gm = new gameManger_1.gameManger();
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    console.log("user connected");
    gm.addUser(socket);
    socket.on("disconnect", () => {
        gm.removeuser(socket);
    });
});
