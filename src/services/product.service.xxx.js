"use strict";
const { BadRequestError } = require("../core/error.response");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const { updateProductById } = require("../models/repositories/product.repo");
const { removeUndefineObject, updateNestedObjectParser } = require("../utils");
const productConfig = require("./product.config");

class ProductFactory2 {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory2.productRegistry[type] = classRef;
  }

  static async createProductFactory(type, payload) {
    const productClass = ProductFactory2.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory2.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");
    return new productClass(payload).updateProduct(productId);
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    return newProduct;
  }
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById(productId, bodyUpdate, {
      new: true,
    });
  }
}

class Clothings extends Product {
  async createProduct() {
    console.log("Check product_shop", this.product_shop);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Cannot create clothing");
    const newProduct = super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Cannot create product");

    return newProduct;
  }
  async updateProduct(productId) {
    const objectParams = removeUndefineObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Cannot create clothing");
    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Cannot create product");

    return newProduct;
  }
  async updateProduct(productId) {
    const objectParams = removeUndefineObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newElectronic = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Cannot create clothing");
    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Cannot create product");

    return newProduct;
  }
  async updateProduct(productId) {
    const objectParams = removeUndefineObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

ProductFactory2.registerProductType("clothing", Clothings);
ProductFactory2.registerProductType("electronic", Electronics);
ProductFactory2.registerProductType("furniture", Furniture);

module.exports = {
  ProductFactory2,
};
