const SqlRunner = require("../../common/SqlRunner");
const moment = require("moment");
const Secure = require("../../common/crypto");
const { GenerateSecretKey } = Secure;
const io = require("../../common/socket");
const { getAllUsermessages } = require("../common/dataBaseHandle");

exports.sendMessage = async (req, res) => {
  let body = req.body;
  let user = req.user;
  const querry_one = `SELECT * FROM user_message WHERE (user_one = ${body.recipientId} AND user_two =  ${user.id}) OR (user_one = ${user.id} AND user_two =  ${body.recipientId} )`;
  const input_querry = `INSERT INTO messages (from_userid, to_userid, message, common_key,status, created_at) VALUES (?, ?,?, ?, ?, ?);`;
  try {
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
    let user_select = await SqlRunner(querry_one);
    if (user_select) {
      await SqlRunner(input_querry, [
        user.id,
        body.recipientId,
        body.message,
        user_select[0].common_key,
        "sent",
        current_dateTime,
      ]);
    }
    res.json({ message: "Message send successfull", status: 1 });
  } catch (error) {
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};

exports.userMessage = async (req, res) => {
  let body = req.body;
  let user = req.user;

  const querry_two = `SELECT * FROM user_message WHERE (user_one = ${body.recipientId} AND user_two =  ${user.id}) OR (user_one = ${user.id} AND user_two =  ${body.recipientId} )`;
  const querry_three = `INSERT INTO user_message (user_one, user_two, common_key, created_at) VALUES (?, ?, ?, ?);`;

  let token_key;

  // io.on("connection", (socket) => {
  //   console.log(`User Connected 02: ${socket.id}`);
  //   socket.on("join_room", (data) => {
  //     console.log("data02=>", data);
  //     socket.join(data);
  //   });
  // });

  try {
    let user_select = await SqlRunner(querry_two);

    if (!user_select.length) {
      let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
      key_generate = await GenerateSecretKey();

      await SqlRunner(querry_three, [
        user.id,
        body.recipientId,
        key_generate,
        current_dateTime,
      ]);
      token_key = {
        common_key: key_generate,
        user_one: user.id,
        user_two: body.recipientId,
      };
    } else {
      token_key = user_select[0];
    }
    let response = await getAllUsermessages(
      user.id,
      body.recipientId,
      body.limit
    );

    res.json({
      message: "Message send successfull",
      status: 1,
      data: response,
      userData: token_key,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
