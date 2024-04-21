const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { authentication } = require("../../auth/authUtils");
const cartController = require("../../controllers/cart.controller");

const router = express.Router();

router.post("/", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.listToCart));
module.exports = router;
