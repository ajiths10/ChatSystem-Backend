const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const MessageController = require("./MessageControllers");

router.post(
  "/send",
  CommonMiddleware.Authentication,
  MessageController.sendMessage
);
router.post(
  "/usermessage",
  CommonMiddleware.Authentication,
  MessageController.userMessage
);

module.exports = router;
