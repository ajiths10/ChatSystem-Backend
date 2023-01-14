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
