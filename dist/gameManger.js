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
        this.privateUsers = []; // * Initialize privateUsers
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
                        playerid: message.uid,
                        photoURL: message.photoURL,
                        displayName: message.displayName,
                    });
                    this.games.push(game);
                    // update the player array and remove the random user
                    this.pendingUsers = this.pendingUsers.filter((player) => {
                        return player.playerid !== randomUser.playerid;
                    });
                    console.log("game started");
                }
                else {
                    this.pendingUsers.push({
                        websocket: socket,
                        playerid: message.uid,
                        gameid: generateRandomString(),
                        photoURL: message.photoURL,
                        displayName: message.displayName,
                    });
                    console.log("pending user added");
                    console.log(this.pendingUsers);
                }
            }
            if (message.type === "create_game") {
                const { gameid } = message;
                console.log(gameid);
                console.log(message);
                const user = this.privateUsers.find((user) => user.gameid === gameid);
                if (user) {
                    const game = new Game_1.Game(user, {
                        websocket: socket,
                        playerid: message.uid,
                        photoURL: message.photoURL,
                        displayName: message.displayName,
                    });
                    socket.send(JSON.stringify({
                        type: "opp",
                        user: user,
                    }));
                    this.games.push(game);
                }
                this.privateUsers.push({
                    websocket: socket,
                    playerid: message.uid,
                    gameid: message.gameid,
                    photoURL: message.photoURL,
                    displayName: message.displayName,
                });
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
