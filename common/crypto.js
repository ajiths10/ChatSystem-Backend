const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.CRYPTO_BCRYPT_SALT);
const jwt = require("jsonwebtoken");

//encrypt Password using bcrypt
exports.encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

//decrypt Password using bcrypt
exports.decryptPassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      // result == true
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

//Generate Token Secret Keys
exports.GenerateSecretKey = (id) => {
  return new Promise((resolve, reject) => {
    let secret_key = require("crypto").randomBytes(64).toString("hex");
    // console.log("key==> ", secret_key);
    resolve(secret_key);
  });
};

//Generate JWT Token for use Authentication
exports.GenerateJWTToken = (id) => {
  return new Promise((resolve, reject) => {
    let token = jwt.sign({ id: id }, process.env.TOKEN_SECRET, {
      expiresIn: "3600s",
    });
    resolve(token);
  });
};

//Generate JWT Token for use Authentication
exports.VerifyJWTToken = (token) => {
  return new Promise((resolve, reject) => {
    if (token == null) return reject();

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return reject();
      resolve(user);
    });
  });
};
