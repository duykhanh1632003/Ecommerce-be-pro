"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .select(unGetSelectData(unselect))
    .skip(skip)
    .limit(limit)
    .lean();
  return products;
};

const findDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .select(getSelectData(select))
    .skip(skip)
    .limit(limit)
    .lean();
  return products;
};

const checkDiscountExists = async (model, filter) => {
  return await model.findOne(filter).lean(); // Sửa "finOne" thành "findOne"
};

module.exports = { // Sửa "module.export" thành "module.exports"
  findDiscountCodesUnselect,
  findDiscountCodesSelect,
  checkDiscountExists,
};
