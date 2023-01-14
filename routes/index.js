const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const Message = require("../controllers/message");

router.use("/user", UserController);
router.use("/message", Message);
module.exports = router;
