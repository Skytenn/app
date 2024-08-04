const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = {};
let roomCounter = 1;

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", () => {
    let assignedRoom = null;

    // Find an existing room with less than 2 users
    for (const room in rooms) {
      if (rooms[room].length < 2) {
        assignedRoom = room;
        break;
      }
    }

    // If no available room is found, create a new room
    if (!assignedRoom) {
      assignedRoom = `room_${roomCounter}`;
      rooms[assignedRoom] = [];
      roomCounter++;
    }

    rooms[assignedRoom].push(socket.id);
    socket.join(assignedRoom);
    console.log(`User with ID: ${socket.id} joined room: ${assignedRoom}`);
    socket.emit("room_joined", { success: true, room: assignedRoom });
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    }
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
