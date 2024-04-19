const { BadRequestError } = require("../core/error.response");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  publishProductByShop,
  queryProduct,
  searchProductByUser,
  unPublishProductByShop,
  findAllProducts,
  findProduct,
} = require("../models/repositories/product.repo");

class ProductFactory {
  static async createProductFactory(type, payload) {
    switch (type) {
      case "electronic":
        return new Electronics(payload).createElectronics();
      case "clothing":
        return new Clothings(payload).createClothing();
      case "furniture":
        return new Furniture(payload).createFurniture();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublishShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await queryProduct({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: [
        "product_name",
        "product_price",
        "product_image",
        "product_thumb",
      ],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
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
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock:this.product_quantity
      });
    } 
    return newProduct;
  }
}

class Clothings extends Product {
  async createClothing() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (newClothing === undefined)
      throw new BadRequestError("Cannot create clothing");
    const newProduct = await super.createProduct(newClothing._id);
    if (newProduct === undefined)
      throw new BadRequestError("Cannot create product");

    return newProduct;
  }
}

class Electronics extends Product {
  async createElectronics() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (newElectronic === undefined)
      throw new BadRequestError("Cannot create electronics");
    const newProduct = await super.createProduct(newElectronic._id);
    if (newProduct === undefined)
      throw new BadRequestError("Cannot create product");

    return newProduct;
  }
}

class Furniture extends Product {
  async createFurniture() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (newFurniture === undefined)
      throw new BadRequestError("Cannot create furniture");
    const newProduct = await super.createProduct(newFurniture._id);
    if (newProduct === undefined)
      throw new BadRequestError("Cannot create product");

    return newProduct;
  }
}

module.exports = {
  ProductFactory,
};
