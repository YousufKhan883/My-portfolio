const express = require("express");
const router = express.Router();
const ownersModel = require("../models/admin-model");
const productModel = require("../models/product-model");
const upload = require("../config/multerconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ownerLoggedin = require("../middiewares/isLoggedin");

const createAdmin = async () => {
  try {
    let owners = await ownersModel.find();
    if (owners.length < 1) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("admin1234", salt);

      let admin = await ownersModel.create({
        fullname: "admin",
        email: "admin@gmail.com",
        password: hash,
        products: [],
      });

      console.log("Admin Created:", admin);
    } else {
      console.log("Admin already exists.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

createAdmin();

router.get("/login", (req, res) => {
  res.render("admin/auth-login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let owner = await ownersModel.findOne({ email });
  if (!owner) {
    return res.status(202).send("Email or password incorect");
  } else {
    bcrypt.compare(password, owner.password, (err, result) => {
      if (result) {
        let token = jwt.sign(
          { email: owner.email, id: owner._id, userType: "admin" },
          process.env.JWT_KEY
        );
        res.cookie("admintoken", token);
        res.redirect("/admin/dashboard");
      } else {
        console.log("error", err);
      }
    });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/admin/login");
});

router.get("/dashboard", ownerLoggedin, async (req, res) => {
  let product = await productModel.find();
  res.render("admin/index", { product });
});

router.get("/create/product", ownerLoggedin, (req, res) => {
  res.render("admin/create-product");
});

router.post(
  "/create/product",
  ownerLoggedin,
  upload.single("images"),
  async (req, res) => {
    let owner = await ownersModel.findOne({ email: req.owner.email });
    let { name, price, description } = req.body;
    let images = req.file.filename;
    let product = await productModel.create({
      name,
      price,
      description,
      images,
      owner: owner._id,
    });
    owner.products.push(product._id);
    await owner.save();
    res.redirect("/admin/product/list");
  }
);

router.get("/product/list", ownerLoggedin, async (req, res) => {
  let product = await productModel.find();
  res.render("admin/product-list", { product });
});

router.get("/edit/:productId", ownerLoggedin, async (req, res) => {
  let product = await productModel.findOne({ _id: req.params.productId });
  res.render("admin/edit", { product });
});

router.post(
  "/upload/:productId",
  upload.single("images"),
  ownerLoggedin,
  async (req, res) => {
    let updated_at = new Date();
    let { name, price, description } = req.body;
    let updateData = null;
    console.log(req.file);
    if (req.file) {
      let images = req.file.filename;
      updateData = { name, price, description, images, updated_at };
    } else {
      updateData = { name, price, description, updated_at };
    }
    let product = await productModel.findOneAndUpdate(
      { _id: req.params.productId },
      updateData,
      { new: true }
    );
    res.redirect("/admin/product/list");
  }
);

router.get("/delete/:productID", ownerLoggedin, async (req, res) => {
  let product = await productModel.findOneAndDelete({
    _id: req.params.productID,
  });
  res.redirect("/admin/product/list");
});

module.exports = router;
