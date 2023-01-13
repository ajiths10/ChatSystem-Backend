const express = require("express");
const router = express.Router();

const UserController = require("./userControllers");

router.post("/register", UserController.regiserUser);
router.post("/login", UserController.loginUser);
router.post("/verify", UserController.verifyUser);

module.exports = router;
