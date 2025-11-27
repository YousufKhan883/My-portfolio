const jwt = require("jsonwebtoken");
const ownerModel = require("../models/admin-model");

module.exports = async (req, res, next) => {
  if (!req.cookies.admintoken) {
    console.log("sorry");
    return res.redirect("/admin/login");
  }

  let decode = jwt.verify(req.cookies.admintoken, process.env.JWT_KEY);

  if (decode.userType == "admin") {
    try {
      let decode = jwt.verify(req.cookies.admintoken, process.env.JWT_KEY);
      let owner = await ownerModel
        .findOne({ email: decode.email })
        .select("-password");
      req.owner = owner;
      next();
    } catch (err) {
      console.log(err);
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
};
