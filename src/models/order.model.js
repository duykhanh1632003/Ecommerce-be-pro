"use strict";
const DOCUMENT_NAME = "order";
const COLLECTION_NAME = "orders";
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_payment: { type: Object, default: {} }, // Sửa thiếu dấu ngoặc vuông
    order_products: { type: Array, required: true },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME, // Sửa lại tên biến collection
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = { order: mongoose.model(DOCUMENT_NAME, orderSchema) };
