import WebSocket from "ws";
import { Chess } from "chess.js";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;

  constructor(p1: WebSocket, p2: WebSocket) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: "init_game",
        payload: {
          color: "black",
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
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
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
      this.player2.send(
        JSON.stringify({
          type: "move",
          payload: {
            move: move,
          },
        })
      );
    } else {
      this.player1.send(
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
