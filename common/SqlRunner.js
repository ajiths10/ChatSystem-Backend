const db_con = require("./SqlConnection");

const SqlRunner = async (querry, data) => {
  return new Promise((resolve, reject) => {
    db_con.query(querry, data, (err, result, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
      // console.log("result==>", result);
    });
  });
};

module.exports = SqlRunner;
