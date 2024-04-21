"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use("/v1/checkout", require("./checkout"));
router.use("/v1/discount", require("./discount"));
router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/inventory", require("./inventory"));

module.exports = router;
