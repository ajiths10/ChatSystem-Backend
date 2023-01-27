const SqlRunner = require("../../common/SqlRunner");
const moment = require("moment");
const Secure = require("../../common/crypto");
const { GenerateSecretKey } = Secure;
const { getUserGroupMessages } = require("../common/dataBaseHandle");
const { groupUserChecker, groupAdminChecker } = require("../common");

exports.addNewGroup = async (req, res) => {
  let body = req.body;
  let user = req.user;

  try {
    let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
    let key_generate = await GenerateSecretKey();
    let userIds = [user.id, ...body.userids];
    let admins = [user.id, ...body.admins];
    const input_querry = `INSERT INTO groups (name, created_user, users, admins, common_key, created_at) VALUES (?, ?, ?, ?, ?, ?);`;
    await SqlRunner(input_querry, [
      body.name,
      user.id,
      userIds
        .sort(function (a, b) {
          return a - b;
        })
        .toString(),
      admins
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

exports.groupmessage = async (req, res) => {
  let user = req.user;
  let body = req.body;

  try {
    let checker = await groupUserChecker(user.id, body.recipientId);
    if (checker.status) {
      let response_one = await getUserGroupMessages(
        body.recipientId,
        body.limit
      );
      res.json({
        message: "Data Fetchted",
        status: 1,
        data: response_one ? response_one.reverse() : [],
        userData: checker.data,
      });
    } else {
      new Error("Unautherized user");
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};

exports.getSingleGroup = async (req, res) => {
  let user = req.user;
  let body = req.body;
  const querry = `SELECT * FROM groups WHERE id = ${body.id}`;

  try {
    let checker = await groupAdminChecker(user.id, body.id);
    if (checker.status) {
      let response = await SqlRunner(querry);
      res.json({
        message: "Data Fetchted",
        status: 1,
        data: response,
      });
    } else {
      throw new Error("Unautherized user");
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};

exports.updateGroup = async (req, res) => {
  const user = req.user;
  const body = req.body;
  let querry = `UPDATE groups SET ? WHERE id = ?`;

  try {
    let checker = await groupAdminChecker(user.id, body.id);
    if (checker.status) {
      let current_dateTime = moment().format("YYYY-MM-DD hh:mm:ss ");
      let userIds = [user.id, ...body.userids].toString();
      let admins = [user.id, ...body.admins].toString();
      let response = await SqlRunner(querry, [
        {
          name: body.name,
          users: userIds,
          admins: admins,
          updated_at: current_dateTime,
        },
        body.id,
      ]);
      res.json({
        message: "Group updated",
        status: 1,
        data: response,
      });
    } else {
      throw new Error("Unautherized access");
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Soemthing went wrong", status: 0, error: error });
  }
};
