const { Server } = require("socket.io");
const {
  getAllUsermessages,
  updateUsermessages,
} = require("../controllers/common/dataBaseHandle");

let io = new Server(global.server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    // console.log(`Socket ${socket.id} joining ${data.key}`);
    socket.join(data.key);
  });

  socket.on("disconnect_room", (data) => {
    //console.log(`Socket ${socket.id} disconnect ${data.key}`);
    socket.leave(data.key);
  });

  socket.on("MESSAGE_ACTION", async (data) => {
    let response = await getAllUsermessages(
      data.userId,
      data.recipientId,
      data.limit
    );
    let response_object = {
      response: response,
      key: data.commonUserKey,
    };
    //console.log(`Community key ==> ${data.commonUserKey}`);
    socket.to(data.commonUserKey).emit("RECEIVE_MESSAGE", response_object);
  });

  socket.on("ACKNOWLEDGEMENT", async (data) => {
    await updateUsermessages(data.key);
    let response = await getAllUsermessages("", "", data.limit, data.key);

    let response_object = {
      response: response,
      key: data.key,
    };

    socket.to(data.key).emit("RECEIVE_MESSAGE", response_object);
  });
});

module.exports = io;
