const { Server } = require("socket.io");
const {
  getAllUsermessages,
  updateUsermessages,
  groupUserChecker,
  getUserGroupMessages,
  updateGroupmessages,
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
    // console.log(`Socket ${socket.id} disconnect ${data.key}`);
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
    let newResponse = await getAllUsermessages("", "", data.limit, data.key);

    let newResponseObj = {
      newData: newResponse,
      key: data.key,
      message: "hello world",
    };

    console.log("==>", newResponseObj);
    socket.to(data.key).emit("ACKNOWLEDGEMENT_RESPONSE", newResponseObj);
  });

  socket.on("GROUP_MESSAGE_ACTION", async (data) => {
    let response;
    let checker = await groupUserChecker(data.userId, data.recipientId);
    if (checker.status) {
      response = await getUserGroupMessages(data.recipientId, data.limit);
    }
    let response_object = {
      data: response.reverse(),
      userData: checker.data,
      key: data.commonUserKey,
      recipientId: data.recipientId,
      userId: data.userId,
      limit: data.limit,
    };
    // //console.log(`Community key ==> ${data.commonUserKey}`);
    socket
      .to(data.commonUserKey)
      .emit("RECEIVE_GROUP_MESSAGES", response_object);
  });

  socket.on("GROUP_ACKNOWLEDGEMENT", async (data) => {
    let response;
    await updateGroupmessages(data.key);
    let checker = await groupUserChecker(data.userId, data.recipientId);
    if (checker.status) {
      response = await getUserGroupMessages(data.recipientId, data.limit);
    }

    let response_object = {
      data: response.reverse(),
      userData: checker.data,
      key: data.commonUserKey,
      recipientId: data.recipientId,
      userId: data.userId,
      limit: data.limit,
    };
    socket.to(data.key).emit("ACKNOWLEDGEMENT_GROUP_RESPONSE", response_object);
  });
});

module.exports = io;
