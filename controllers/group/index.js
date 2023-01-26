const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const GroupContoller = require("./GroupContoller");

router.post(
  "/newgroup",
  CommonMiddleware.Authentication,
  GroupContoller.addNewGroup
);
router.post(
  "/usergroup",
  CommonMiddleware.Authentication,
  GroupContoller.getUserGroup
);
router.post(
  "/groupmessage",
  CommonMiddleware.Authentication,
  GroupContoller.groupmessage
);
router.post(
  "/getsinglegroup",
  CommonMiddleware.Authentication,
  GroupContoller.getSingleGroup
);

module.exports = router;
