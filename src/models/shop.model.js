"use strict";
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "shop";
const COLLECTION_NAME = "shops";

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["isActive", "isInactive"],
      default: "isInactive",
    },
    verify: {
      type: Schema.Types.Boolean, // Sử dụng Schema.Types.Boolean thay vì Types.Boolean
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Xuất model
module.exports = model(DOCUMENT_NAME, shopSchema);
