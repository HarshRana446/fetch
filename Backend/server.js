import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import routes from "./routes/index.js";
import { WebSocketServer } from "ws";
import http from "http";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/v1", routes);

const server = http.createServer(app);

export const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("client connected", ws._socket.remoteAddress);
  ws.on("message", (message) => {
    console.log("message", message.toString());
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});