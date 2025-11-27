const express = require("express");
const router = express.Router();
const userLoggedin = require("../middiewares/userLoggedin");

const { registureUser, loginUser } = require("../controllers/auth-controllers");

router.get("/registure", (req, res) => {
  res.render("users/registure");
});

router.get("/login", (req, res) => {
  res.render("users/login-user");
});

router.get("/logout", userLoggedin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

router.post("/registure", registureUser);

router.post("/login", loginUser);

module.exports = router;
