import WebSocket, { WebSocketServer } from "ws";
import { gameManger } from "./gameManger";

const gm = new gameManger();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  console.log("user connected");

  gm.addUser(socket);
  socket.on("disconnect", () => {
    gm.removeuser(socket);
  });
});
