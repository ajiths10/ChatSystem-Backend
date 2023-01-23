const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const GroupContoller = require("./GroupContoller");

router.post(
  "/newgroup",
  CommonMiddleware.Authentication,
  GroupContoller.addNewGroup
);

module.exports = router;
