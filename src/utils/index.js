"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
// ['a', 'b'] => {a:1 , b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((element) => {
    if (obj[element] === null) {
      delete obj[element];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      // "Object" -> "object"
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a]; // "res[a]" -> "response[a]"
      });
    } else {
      final[k] = obj[k]; // Bổ sung trường hợp khi không phải là object để giữ nguyên giá trị
    }
  });
  return final;
};
const convertToObjectIdMongodb = (id) => Types.ObjectId(id);
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
