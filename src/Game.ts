import WebSocket from "ws";
import { Chess } from "chess.js";
import { Player } from "./gameManger";

export class Game {
  public gameid: string;
  public player1: Player;
  public player2: Player;
  public board: Chess;
  private startTime: Date;

  constructor(p1: Player, p2: Player) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.startTime = new Date();
    this.gameid = "random string";
    this.player1.websocket.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "white",
          photoURL: p2.photoURL,
          displayName: p2.displayName,
        },
      })
    );
    this.player2.websocket.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "black",
          photoURL: p1.photoURL,
          displayName: p1.displayName,
        },
      })
    );
  }

  makemove(
    player: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    try {
      this.board.move(move);
      console.log("this happened succesfully");
    } catch (error: any) {
      console.log(error.message);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.websocket.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.websocket.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    if (this.board.turn() === "b") {
      this.player2.websocket.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: move,
          },
        })
      );
    } else {
      this.player1.websocket.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: move,
          },
        })
      );
    }
  }
}
