const express = require("express");
const router = express.Router();

const CommonMiddleware = require("../common");
const paymentController = require("./stripeController");

router.post(
  "/payment",
  CommonMiddleware.Authentication,
  paymentController.payment
);

router.post(
  "/confirm",
  CommonMiddleware.Authentication,
  paymentController.confirm
);

module.exports = router;
