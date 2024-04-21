"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response.js");
const { DiscountService } = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Success discount",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }).send(res),
    });
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountAmount({
        ...req.body,
        shopId: req.user.userId,
      }).send(res),
    });
  };
  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.body,
        shopId: req.user.userId,
      }).send(res),
    });
  };
}

module.exports = new DiscountController();
