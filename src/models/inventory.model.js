"use strict";
const DOCUMENT_NAME = "inventory";
const COLLECTION_NAME = "inventories";
const mongoose = require("mongoose"); // Erase if already required

const inventorySchema = new mongoose.Schema(
  {
    inven_productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    inven_local: { type: String, default: "unKnow" },
    inven_stock: { type: Number, require: true },
    inven_shopId: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
    inven_reservations: { type: Array, default: {} },
  },  
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Tạo mô hình từ schema đã định nghĩa và xuất nó
module.exports = { inventory: mongoose.model(DOCUMENT_NAME, inventorySchema) };
