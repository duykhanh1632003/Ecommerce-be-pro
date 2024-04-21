const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const inventoryController = require("../../controllers/inventory.controller");

const router = express.Router();


router.use(authentication);
router.post('',asyncHandler(inventoryController.addToStockToInventory))

module.exports = router;    
