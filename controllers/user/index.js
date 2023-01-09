const SqlRunner = require("../../common/SqlRunner");
const db_con = require("../../common/SqlConnection");
const Secure = require("../../common/crypto");
const { encryptPassword } = Secure;

exports.regiserUser = async (req, res, next) => {
  let user = req.body;

  const input_querry = `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
  const select_querry = `SELECT * FROM users WHERE email = '${user.email}' ;`;

  let response_one = await SqlRunner(select_querry);

  if (response_one && response_one.length) {
    return res.json({ message: "Email already exist", status: 0 });
  } else {
    let hash = await encryptPassword(user.password);
    let response = await SqlRunner(input_querry, [user.name, user.email, hash]);
  }

  res.json({ message: "User Registered", status: 1 });
};
