"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameManger = void 0;
const Game_1 = require("./Game");
class gameManger {
    constructor() {
        this.games = [];
        this.Users = [];
        this.pendingUsers = null;
    }
    addUser(socket) {
        this.Users.push(socket);
        this.addhandler(socket);
    }
    removeuser(socket) {
        this.Users = this.Users.filter((soc) => {
            return soc !== socket;
        });
    }
    addhandler(socket) {
        socket.on("message", (ms) => {
            const message = JSON.parse(ms.toString());
            if (message.type === "init_game") {
                console.log("inti");
                if (this.pendingUsers != null) {
                    //start the game
                    const game = new Game_1.Game(this.pendingUsers, socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                    console.log("game started");
                }
                else {
                    this.pendingUsers = socket;
                    console.log("pending user added");
                }
            }
            if (message.type === "move") {
                console.log("makemove");
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                // console.log(game);
                game === null || game === void 0 ? void 0 : game.makemove(socket, message.move);
                console.log("made move");
            }
        });
    }
}
exports.gameManger = gameManger;
