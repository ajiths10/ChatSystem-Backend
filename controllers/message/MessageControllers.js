const SqlRunner = require("../../common/SqlRunner");
const moment = require("moment");

exports.sendMessage = async (req, res) => {
  let body = req.body;
  let user = req.user;
  const input_querry = `INSERT INTO messages (from_userid, to_userid, message, created_at) VALUES (?, ?, ?, ?);`;
  try {
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
    let response = await SqlRunner(input_querry, [
      user.id,
      body.recipientId,
      body.message,
      current_dateTime,
    ]);
    res.json({ message: "Message send successfull", status: 1 });
  } catch (error) {
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};

exports.userMessage = async (req, res) => {
  let body = req.body;
  let user = req.user;
  const querry_one = `SELECT messages.id, messages.message, messages.created_at, users.id AS userid, users.email, users.name
  FROM messages
  INNER JOIN users
  ON messages.to_userid = users.id 
  WHERE (messages.to_userid = ${body.recipientId} AND messages.from_userid = ${user.id}) OR messages.to_userid = ${user.id} AND messages.from_userid = ${body.recipientId}
  ORDER BY messages.id ASC;`;

  try {
    let response = await SqlRunner(querry_one);

    // console.log("hiiiii==>", response);
    res.json({
      message: "Message send successfull",
      status: 1,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
