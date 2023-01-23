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
    let userIds = [user.id, ...body.userids];
    const input_querry = `INSERT INTO groups (name, created_user, users, common_key, created_at) VALUES (?, ?, ?, ?, ?);`;
    let response_one = await SqlRunner(input_querry, [
      body.name,
      user.id,
      userIds
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

exports.getUserGroup = async (req, res) => {
  let user = req.user;

  try {
    const sql_querry = `SELECT * FROM groups WHERE users LIKE '%${user.id}%';`;
    let response_one = await SqlRunner(sql_querry);
    res.json({ message: "Data Fetchted", status: 1, data: response_one });
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
