const express = require("express");
const router = express.Router();

const { productList } = require("../controllers/product-controllers");

router.get("/list", productList );

module.exports = router;

