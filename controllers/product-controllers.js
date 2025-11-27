const productModel = require("../models/product-model");

module.exports.productList = async (req, res) => {
  let product = await productModel.find();
  res.render("users/product", { product });
};