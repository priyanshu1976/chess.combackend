"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const gameManger_1 = require("./gameManger");
const http_1 = __importDefault(require("http"));
const gm = new gameManger_1.gameManger();
// Create an HTTP server for CORS handling
const server = http_1.default.createServer((req, res) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }
    // Reject non-WebSocket requests
    res.writeHead(404);
    res.end();
});
// Create a WebSocket server attached to the HTTP server
const wss = new ws_1.WebSocketServer({ server });
// Handle WebSocket connections
wss.on("connection", (socket, req) => {
    // Check the origin for CORS
    const origin = req.headers.origin;
    if (origin !== "http://localhost:5173") {
        socket.close(1008, "Unauthorized origin");
        return;
    }
    console.log("User connected");
    // Add the user to the game manager
    gm.addUser(socket);
    // Handle disconnection
    socket.on("close", () => {
        console.log("User disconnected");
        gm.removeuser(socket);
    });
    // Handle messages from the client
    socket.on("message", (data) => {
        console.log("Message received:", data.toString());
        // Broadcast the message to all clients (optional)
        wss.clients.forEach((client) => {
            if (client !== socket && client.readyState === ws_1.default.OPEN) {
                client.send(data.toString());
            }
        });
    });
});
// Start the server
server.listen(8080, () => {
    console.log("WebSocket server is running on port 8080");
});
