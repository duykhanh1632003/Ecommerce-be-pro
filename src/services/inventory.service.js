"use strict";

const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "1234 , Tran Phu, HCM",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exist!");

    const query = { invent_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }

    static async getOrdersByUser() { }
    static async getOneOrderByUser() { }
    
    static async cancelOrderByUser() { }
    static async updateOrderStatusByShop() {}
}

module.exports = InventoryService;
