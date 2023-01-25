const SqlRunner = require("../../common/SqlRunner");
const Secure = require("../../common/crypto");
const { VerifyJWTToken } = Secure;

exports.getAllUsermessages = (userId, recipientId, limit, common_key) => {
  let querry_one;
  if (common_key) {
    querry_one = `SELECT messages.id, messages.message, messages.status, messages.created_at, users.id AS userid, users.email, users.name
    FROM messages
    INNER JOIN users
    ON messages.from_userid = users.id 
    WHERE messages.common_key = '${common_key}'
    ORDER BY messages.id DESC LIMIT ${limit};`;
  } else {
    querry_one = `SELECT messages.id, messages.message, messages.status, messages.created_at, users.id AS userid, users.email, users.name
    FROM messages
    INNER JOIN users
    ON messages.from_userid = users.id 
    WHERE (messages.to_userid = ${recipientId} AND messages.from_userid = ${userId}) OR messages.to_userid = ${userId} AND messages.from_userid = ${recipientId}
    ORDER BY messages.id DESC LIMIT ${limit};`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      let response = await SqlRunner(querry_one);
      resolve(response.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateUsermessages = (key) => {
  const querry_one = `UPDATE messages SET status = 'delivered' WHERE messages.common_key = '${key}'`;

  return new Promise(async (resolve, reject) => {
    try {
      let response = await SqlRunner(querry_one);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

exports.groupUserChecker = (userId, groupId) => {
  const querry_one = `SELECT * FROM groups WHERE id = ${groupId}`;

  return new Promise(async (resolve, reject) => {
    try {
      let response = await SqlRunner(querry_one);

      if (response && response[0]) {
        if (response[0].users.split(",").includes(userId.toString())) {
          resolve({ status: true, data: response[0] });
        } else {
          resolve({ status: false, data: [] });
        }
      } else {
        resolve({ status: false, data: [] });
      }
    } catch (error) {
      reject(error);
    }
  });
};
