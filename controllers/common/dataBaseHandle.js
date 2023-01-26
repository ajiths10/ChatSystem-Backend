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
      resolve(response ? response.reverse() : []);
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

exports.getUserGroupMessages = (groupId, limit) => {
  let querry_one = `SELECT group_message.id, group_message.message, group_message.status, group_message.created_at, group_message.to_groupid, group_message.from_userid, group_message.common_key, users.id AS userid, users.email, users.name
  FROM group_message
  INNER JOIN users
  ON group_message.from_userid = users.id 
  WHERE group_message.to_groupid = '${groupId}'
  ORDER BY group_message.id DESC LIMIT ${limit};`;

  return new Promise(async (resolve, reject) => {
    try {
      let response = await SqlRunner(querry_one);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateGroupmessages = (key) => {
  const querry_one = `UPDATE group_message SET status = 'delivered' WHERE common_key = '${key}'`;

  return new Promise(async (resolve, reject) => {
    try {
      let response = await SqlRunner(querry_one);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
