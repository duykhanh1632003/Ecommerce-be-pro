"use strict";

const mongoose = require("mongoose");
const { product } = require("../product.model");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongodb,
} = require("../../utils");

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: mongoose.Types.ObjectId(product_shop),
    _id: mongoose.Types.ObjectId(product_id), // Fixed syntax error here
  });
  if (!shop) {
    return null;
  }
  shop.isDraft = false;
  shop.isPublished = true;
  const { modifiedCount } = await shop.updateOne(shop); // khong update : 0 , update duoc la 1
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: mongoose.Types.ObjectId(product_shop),
    _id: mongoose.Types.ObjectId(product_id), // Fixed syntax error here
  });
  if (!shop) {
    return null;
  }
  shop.isDraft = true;
  shop.isPublished = false;
  const { modifiedCount } = await shop.updateOne(shop); // khong update : 0 , update duoc la 1
  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i"); // 'i' để không phân biệt chữ hoa chữ thường
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } }.lean());

  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .select(getSelectData(select))
    .skip(skip)
    .limit(limit)
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate({
    productId,
    bodyUpdate,
    model: product,
  });
};

const getProductById = async (productId) => {
  return await product
    .findById({ _id: convertToObjectIdMongodb(productId) })
    .lean();
};

const checkProductByServer = async (product) => {
  return await Promise.all(
    product.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (!foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  publishProductByShop,
  queryProduct,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  getProductById,
  updateProductById,
  checkProductByServer,
};
