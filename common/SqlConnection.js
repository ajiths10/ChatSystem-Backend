const mysql = require("mysql");

var db_con = mysql.createConnection({
  host: process.env.DATABASE_LOCALHOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_TABLE,
  port: 3306,
});
db_con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

module.exports = db_con;
