const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const Message = require("../controllers/message");
const Group = require("../controllers/group");

router.use("/user", UserController);
router.use("/message", Message);
router.use("/group", Group);
module.exports = router;
