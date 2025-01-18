import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "https://realtime-chatapp-frontend.netlify.app",
  },
});

let users = [];

// establish connection with React App
io.on("connection", (socket) => {
  console.log(`${socket.id} user connected!`);

  socket.emit("newUserResponse", users);

  socket.on("message", (data) => {
    console.log(`The message: ${JSON.stringify(data)}`);
    io.emit("messageResponse", data);
  });

  socket.on("newUser", (data) => {
    console.log(`New user available: ${JSON.stringify(data)}`);
    users.push(data);

    console.log(`Updated users array: ${JSON.stringify(users)}`);

    io.emit("newUserResponse", users);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("stopTyping", () => socket.broadcast.emit("typingResponse", ""));

  socket.on("disconnect", () => {
    console.log("User disconnected");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("newUserResponse", users);
    socket.disconnect();
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
