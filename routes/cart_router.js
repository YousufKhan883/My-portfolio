const express = require("express");
const router = express.Router();
const isLoggedin = require("../middiewares/userLoggedin");

const {
  addToCart,
  reedProduct,
  removeProduct,
  checkOut,
} = require("../controllers/cart-controllers");
const { route } = require(".");

router.post("/product/add", addToCart);

router.get("/reed/product", isLoggedin, reedProduct);

router.post("/delete/product", isLoggedin, removeProduct)

router.get("/checkout", isLoggedin, checkOut);

module.exports = router;
