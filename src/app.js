const express = require("express");
const app = express();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
require("dotenv").config();
// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("../helpers/check.connect");
// checkOverload();
//init routes
app.use("", require("./routes/index"));
// app.get("/", (req, res, next) => {
//   const strCompress = "hello Fanjpt";
//   return res
//     .status(200)
//     .json({ message: "hello", metadata: strCompress.repeat(1000) });
// });

//handling error

// app.use((req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });

// app.use((err, req, res, next) => {
//   const status = err.status || 500;

//   return res.status(status).json({
//     status: "error",
//     code: err.statusCode,
//     message: err.message || "Internal Server Error",
//   });
// });

module.exports = app;
