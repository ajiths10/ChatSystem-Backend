const SqlRunner = require("../../common/SqlRunner");
const Secure = require("../../common/crypto");
const {
  encryptPassword,
  decryptPassword,
  GenerateJWTToken,
  GenerateSecretKey,
} = Secure;

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

exports.loginUser = async (req, res, next) => {
  let user = req.body;
  const select_querry = `SELECT * FROM users WHERE email = '${user.email}' ;`;

  if (user && user.email && user.password) {
    let response_one = await SqlRunner(select_querry);

    if (response_one && response_one.length) {
      let passwordCheker = await decryptPassword(
        user.password,
        response_one[0].password
      );

      if (passwordCheker) {
        // let token_key = await GenerateSecretKey();
        let token = await GenerateJWTToken(response_one[0].id);
        return res.json({
          message: "Successfully logedin",
          status: 1,
          token: token,
        });
      } else {
        return res.json({ message: "Invalid Password", status: 0 });
      }
    } else {
      return res.json({ message: "Invalid Email Id", status: 0 });
    }
  }
};
