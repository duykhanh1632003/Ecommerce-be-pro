"use strict";
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2, authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

router.use(authentication);

///

router.post("", asyncHandler(productController.productFactory));
router.patch("/:productId", asyncHandler(productController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.pubLishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPubLishProductByShop)
);

//query//
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
