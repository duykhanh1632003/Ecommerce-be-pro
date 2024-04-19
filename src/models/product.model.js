"use strict";
const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";
const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["electronic", "clothing", "furniture"],
    },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },

    //more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// document middleware: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
productSchema.index({ product_name: "text", product_description: "text" });
const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "clothing",
    timestamps: true,
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "electronic",
    timestamps: true,
  }
);
const furnitureSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop" },
  },
  {
    collection: "furniture",
    timestamps: true,
  }
);

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model("clothing", clothingSchema),
  electronic: mongoose.model("electronic", electronicSchema),
  furniture: mongoose.model("furniture", furnitureSchema),
};
