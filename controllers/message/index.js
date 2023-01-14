const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const MessageController = require("./MessageControllers");

router.post(
  "/send",
  CommonMiddleware.Authentication,
  MessageController.sendMessage
);

module.exports = router;
