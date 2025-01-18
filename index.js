import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = 3000;

const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// establish connection with React App
io.on("connection", (socket) => {
  console.log(`${socket.id} user connected!`);

  socket.on("message", (data) => {
    console.log(`The message: ${JSON.stringify(data)}`);
    io.emit("messageResponse", data);
  });

  io.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello there!",
  });
});

httpServer.listen(PORT, () => {
  console.log("Server is listening on: ", PORT);
});
