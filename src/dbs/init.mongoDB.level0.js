"use strict";
const mongoose = require("mongoose");
const connectString = `mongodb://localhost:27017/crud`;
mongoose.connect(
  connectString
    .then((_) => console.log(`Connected MongoDB Success`))
    .catch((err) => console.log("Error connect"))
);
module.exports = mongoose;
