import WebSocket from "ws";
import { Game } from "./Game";

// first make for random user

export interface Player {
  websocket: WebSocket;
  playerid: string;
  gameid?: string | null;
}

function generateRandomString(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class gameManger {
  private games: Game[];
  private pendingUsers: Player[];
  private Users: Player[];
  constructor() {
    this.games = [];
    this.Users = [];
    this.pendingUsers = [];
  }

  addUser(socket: WebSocket) {
    this.Users.push({ websocket: socket, playerid: "hello", gameid: "string" });
    this.addhandler(socket);
  }

  removeuser(socket: WebSocket) {
    this.Users = this.Users.filter((soc) => {
      return soc.websocket !== socket;
    });
  }

  private addhandler(socket: WebSocket) {
    socket.on("message", (ms) => {
      const message = JSON.parse(ms.toString());
      if (message.type === "init_game") {
        console.log("inti");
        if (this.pendingUsers.length > 0) {
          const randomUser: Player = this.pendingUsers[0];
          //start the game
          const game = new Game(randomUser, {
            websocket: socket,
            playerid: "lol",
          });
          // console.log(randomUser);

          this.games.push(game);

          // update the player array and remove the random user
          this.pendingUsers = this.pendingUsers.filter((player) => {
            return player === randomUser;
          });

          console.log("game started");
        } else {
          this.pendingUsers.push({ websocket: socket, playerid: "hello" });
          console.log("pending user added");
        }
      }
      if (message.type === "move") {
        console.log("makemove");
        console.log(message);

        const game = this.games.find(
          (game) =>
            game.player1.websocket === socket ||
            game.player2.websocket === socket
        );
        // console.log(game);
        game?.makemove(socket, message.move);
        console.log("made move");
      }
    });
  }
}
