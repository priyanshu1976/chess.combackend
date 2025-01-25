"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameManger = void 0;
const Game_1 = require("./Game");
function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
class gameManger {
    constructor() {
        this.games = [];
        this.Users = [];
        this.pendingUsers = [];
    }
    addUser(socket) {
        this.Users.push({ websocket: socket, playerid: "hello", gameid: "string" });
        this.addhandler(socket);
    }
    removeuser(socket) {
        this.Users = this.Users.filter((soc) => {
            return soc.websocket !== socket;
        });
    }
    addhandler(socket) {
        socket.on("message", (ms) => {
            const message = JSON.parse(ms.toString());
            if (message.type === "init_game") {
                console.log("inti");
                if (this.pendingUsers.length > 0) {
                    const randomUser = this.pendingUsers[0];
                    //start the game
                    const game = new Game_1.Game(randomUser, {
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
                }
                else {
                    this.pendingUsers.push({ websocket: socket, playerid: "hello" });
                    console.log("pending user added");
                }
            }
            if (message.type === "move") {
                console.log("makemove");
                console.log(message);
                const game = this.games.find((game) => game.player1.websocket === socket ||
                    game.player2.websocket === socket);
                // console.log(game);
                game === null || game === void 0 ? void 0 : game.makemove(socket, message.move);
                console.log("made move");
            }
        });
    }
}
exports.gameManger = gameManger;
