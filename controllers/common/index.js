const SqlRunner = require("../../common/SqlRunner");
const Secure = require("../../common/crypto");
const { VerifyJWTToken } = Secure;

exports.Authentication = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization.replace("Bearer ", "");

      let tokenVerify = await VerifyJWTToken(authHeader);
      const select_querry = `SELECT * FROM users WHERE id = '${tokenVerify.id}' ;`;
      let response_one = await SqlRunner(select_querry);

      if (response_one[0]) {
        req.user = response_one[0];
        next();
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
