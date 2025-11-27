const userModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.registureUser = async (req, res) => {
  try {
    const { fristname, lastname, email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) return res.status(202).send("your account allredy registure");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.send(err);
        } else {
          // return res.send(req.body);
          let user = await userModel.create({
            fristname,
            lastname,
            email,
            password: hash,
          });
          let token = jwt.sign(
            { email: user.email, id: user._id, userType: "user" },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          res.redirect("/users/login");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
      console.log("User Not found!");
      return res.status(234).send("email or password incorect");
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { email: user.email, id: user._id, userType: "user" },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          res.redirect("/");
        } else {
          console.log("error", err);
        }
      });
    }
  } catch (err) {
    res.send(err.message);
  }
};
