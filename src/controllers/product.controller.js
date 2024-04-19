"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const { ProductFactory } = require("../services/product.service.js");
const { ProductFactory2 } = require("../services/product.service.xxx.js");

class ProductController {
  productFactory = async (req, res, next) => {
    const data = await ProductFactory.createProductFactory(
      req.body.product_type,
      { ...req.body, product_shop: req.user.userId }
    );
    new SuccessResponse({ metadata: data }).send(res);
  };

  pubLishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success ",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPubLishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success ",
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllDraftsForShop = async (req, res, next) => {
    console.log("get userId", req.user.userId);

    new SuccessResponse({
      message: "Get list success ",
      metadata: await ProductFactory.findAllDraftShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishedForShop = async (req, res, next) => {
    console.log("get userId", req.user.userId);

    new SuccessResponse({
      message: "Get listAllPublished success ",
      metadata: await ProductFactory.findAllPublishShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    console.log("get userId", req.user.userId);

    new SuccessResponse({
      message: "Get search success ",
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    console.log("get userId", req.user.userId);

    new SuccessResponse({
      message: "Get findAllProducts success ",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    console.log("get userId", req.user.userId);

    new SuccessResponse({
      message: "Get findAllProducts success ",
      metadata: await ProductFactory.findProduct({
        product_id: req.params._id,
      }),
    }).send(res);
  };
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductFactory2.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
