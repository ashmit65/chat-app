const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("views")); // change to your folder name if needed

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const users = {};

io.on("connection", (socket) => {
  console.log("⚡ New connection");

  socket.on("user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("new-user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      name: users[socket.id],
      message,
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("user-left", name);
  });
});
