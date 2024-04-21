"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addToStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "create new Cart service",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();