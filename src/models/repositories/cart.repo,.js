"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const { findById } = require("../keyToken.model");

const findCartById = async (cartId) => {
  return await cartId
    .findOne({
      _id: convertToObjectIdMongodb(cartId),
      cart_state: "active",
    })
    .lean();
};

module.exports = {
    findCartById,
};
