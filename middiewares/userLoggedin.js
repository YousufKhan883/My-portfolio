const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    try {
    if (!req.cookies.token) {
      return res.redirect("/users/login");
    } else {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
      let user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");
      req.user = user;
      next();
    }
  } catch (error) {
    console.log("error", error);
    res.redirect("/users/login");
  }
};
