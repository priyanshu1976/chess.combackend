import WebSocket, { WebSocketServer } from "ws";
import { gameManger } from "./gameManger";
import http from "http";

const gm = new gameManger();

// Create an HTTP server for CORS handling
const server = http.createServer((req, res) => {
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
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", (socket: WebSocket, req) => {
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
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });
});

// Start the server
server.listen(8080, () => {
  console.log("WebSocket server is running on port 8080");
});
