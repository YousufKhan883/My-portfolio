const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");

router.get("/", async (req, res) => {
  let product = await productModel.find();
  res.render("users/index", { product });
});

module.exports = router;
