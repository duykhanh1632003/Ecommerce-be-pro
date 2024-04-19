"use strict";
const DOCUMENT_NAME = "apikey";
const COLLECTION_NAME = "apikeys";
const mongoose = require("mongoose"); // Erase if already required

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Tạo mô hình từ schema đã định nghĩa và xuất nó
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);
