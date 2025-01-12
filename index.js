const express = require("express");
const app = express();
const PORT = 4000;

// imports to add communication with client side
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// establish connection with React App
socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user connected!`);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello there!",
  });
});

http.listen(PORT, () => {
  console.log("Server is listening on: ", PORT);
});
