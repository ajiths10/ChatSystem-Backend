const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

router.use("/user", UserController);

module.exports = router;
