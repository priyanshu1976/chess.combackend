import WebSocket from "ws";
import { Game } from "./Game";

export class gameManger {
  private games: Game[];
  private pendingUsers: WebSocket | null;
  private Users: WebSocket[];
  constructor() {
    this.games = [];
    this.Users = [];
    this.pendingUsers = null;
  }

  addUser(socket: WebSocket) {
    this.Users.push(socket);
    this.addhandler(socket);
  }

  removeuser(socket: WebSocket) {
    this.Users = this.Users.filter((soc) => {
      return soc !== socket;
    });
  }

  private addhandler(socket: WebSocket) {
    socket.on("message", (ms) => {
      const message = JSON.parse(ms.toString());
      if (message.type === "init_game") {
        console.log("inti");

        if (this.pendingUsers != null) {
          //start the game
          const game = new Game(this.pendingUsers, socket);
          this.games.push(game);
          this.pendingUsers = null;
          console.log("game started");
        } else {
          this.pendingUsers = socket;
          console.log("pending user added");
        }
      }
      if (message.type === "move") {
        console.log("makemove");
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        // console.log(game);
        game?.makemove(socket, message.move);
        console.log("made move");
      }
    });
  }
}
