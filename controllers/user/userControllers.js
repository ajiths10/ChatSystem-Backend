const SqlRunner = require("../../common/SqlRunner");
const Secure = require("../../common/crypto");
const {
  encryptPassword,
  decryptPassword,
  GenerateJWTToken,
  GenerateSecretKey,
  VerifyJWTToken,
} = Secure;

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
      res.json({ message: "User Verified", status: 1 });
    } else {
      res.json({ message: "Something went wrong ", status: 0 });
    }
  } catch (err) {
    res.json({ message: "Soemthing went wrong", status: 0, error: err });
  }
};
