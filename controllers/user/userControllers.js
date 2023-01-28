const SqlRunner = require("../../common/SqlRunner");
const Secure = require("../../common/crypto");
const {
  encryptPassword,
  decryptPassword,
  GenerateJWTToken,
  GenerateSecretKey,
  VerifyJWTToken,
} = Secure;
const moment = require("moment");

exports.regiserUser = async (req, res, next) => {
  let user = req.body;
  try {
    const input_querry = `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
    const select_querry = `SELECT * FROM users WHERE email = '${user.email}' ;`;

    let response_one = await SqlRunner(select_querry);

    if (response_one && response_one.length) {
      return res.json({ message: "Email already exist", status: 0 });
    } else {
      let hash = await encryptPassword(user.password);
      let response = await SqlRunner(input_querry, [
        user.name,
        user.email,
        hash,
      ]);
    }
    res.json({
      message: "User Registered, Please Login to continue",
      status: 1,
    });
  } catch (err) {
    res.json({ message: "Soemthing went wrong", status: 0, error: err });
  }
};

exports.loginUser = async (req, res, next) => {
  let user = req.body;
  try {
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
  } catch (err) {
    res.json({ message: "Soemthing went wrong", status: 0, error: err });
  }
};

exports.verifyUser = async (req, res, next) => {
  let user = req.body;
  try {
    let tokenId = await VerifyJWTToken(user.userId);
    const select_querry = `SELECT * FROM users WHERE id = '${tokenId.id}' ;`;
    let response_one = await SqlRunner(select_querry);
    if (response_one && response_one[0].id) {
      delete response_one[0].password;
      res.json({ message: "User Verified", status: 1, data: response_one[0] });
    } else {
      res.json({ message: "Something went wrong ", status: 0 });
    }
  } catch (err) {
    res.json({ message: "Soemthing went wrong", status: 0, error: err });
  }
};

exports.getAllUsers = async (req, res, next) => {
  let body = req.body;
  try {
    const select_querry = `SELECT * FROM users WHERE id != ${req.user.id};`;
    let response_one = await SqlRunner(select_querry);

    if (response_one) {
      res.json({ message: "Users fetched", status: 1, data: response_one });
    } else {
      throw new Error("response not found!!");
    }
  } catch (err) {
    res.json({ message: "Soemthing went wrong", status: 0, error: err });
  }
};

exports.updateUser = async (req, res, next) => {
  let user = req.user;
  let body = req.body;
  try {
    const querry = `UPDATE users SET ? WHERE id = ?`;
    const select_querry = `SELECT * FROM users WHERE id = ? ;`;
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");

    await SqlRunner(querry, [
      { name: body.name, avatar: body.avatar, updated_at: current_dateTime },
      user.id,
    ]);
    let response = await SqlRunner(select_querry, [user.id]);

    delete response[0].password;
    res.json({ message: "Updated", status: 1, data: response[0] });
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
