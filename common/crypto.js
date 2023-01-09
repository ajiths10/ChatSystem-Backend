const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.CRYPTO_BCRYPT_SALT);

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
