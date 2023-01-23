const SqlRunner = require("../../common/SqlRunner");
const moment = require("moment");
const Secure = require("../../common/crypto");
const { GenerateSecretKey } = Secure;

exports.addNewGroup = async (req, res) => {
  let body = req.body;
  let user = req.user;

  try {
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
    let key_generate = await GenerateSecretKey();
    const input_querry = `INSERT INTO groups (name, users, common_key, created_at) VALUES (?, ?, ?, ?);`;
    let response_one = await SqlRunner(input_querry, [
      body.name,
      body.userids
        .sort(function (a, b) {
          return a - b;
        })
        .toString(),
      key_generate,
      current_dateTime,
    ]);
    res.json({ message: "Group created", status: 1 });
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
