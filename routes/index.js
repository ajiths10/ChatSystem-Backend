const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const Message = require("../controllers/message");
const Group = require("../controllers/group");
const stripe = require("../controllers/payment/stripe");

router.use("/user", UserController);
router.use("/message", Message);
router.use("/group", Group);
router.use("/stripe", stripe);
module.exports = router;
