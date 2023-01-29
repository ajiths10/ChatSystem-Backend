const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const paymentController = require("./stripeController");

router.post(
  "/payment",
  CommonMiddleware.Authentication,
  paymentController.payment
);

module.exports = router;
