"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(p1, p2) {
        this.player1 = p1;
        this.player2 = p2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.gameid = "random string";
        this.player1.websocket.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "white",
            },
        }));
        this.player2.websocket.send(JSON.stringify({
            type: "init_game",
            payload: {
                color: "black",
            },
        }));
    }
    makemove(player, move) {
        try {
            this.board.move(move);
            console.log("this happened succesfully");
        }
        catch (error) {
            console.log(error.message);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.websocket.send(JSON.stringify({
                type: "game_over",
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.websocket.send(JSON.stringify({
                type: "game_over",
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.board.turn() === "b") {
            this.player2.websocket.send(JSON.stringify({
                type: "move",
                payload: {
                    move: move,
                },
            }));
        }
        else {
            this.player1.websocket.send(JSON.stringify({
                type: "move",
                payload: {
                    move: move,
                },
            }));
        }
    }
}
exports.Game = Game;
