const { Server } = require("socket.io");
const { getAllUsermessages } = require("../controllers/common");

let io = new Server(global.server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    //  console.log(`Socket ${socket.id} joining ${data.key}`);
    socket.join(data.key);
  });

  socket.on("MESSAGE_ACTION", async (data) => {
    let response = await getAllUsermessages(data.userId, data.recipientId);
    socket.to(data.commonUserKey).emit("RECEIVE_MESSAGE", response);
  });
});

module.exports = io;
