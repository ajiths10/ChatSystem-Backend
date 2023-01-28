const express = require("express");
const router = express.Router();

const UserController = require("./userControllers");
const CommonMiddleware = require("../common");

router.post("/register", UserController.regiserUser);
router.post("/login", UserController.loginUser);
router.post("/verify", UserController.verifyUser);
router.post(
  "/allusers",
  CommonMiddleware.Authentication,
  UserController.getAllUsers
);
router.post(
  "/update",
  CommonMiddleware.Authentication,
  UserController.updateUser
);

module.exports = router;
