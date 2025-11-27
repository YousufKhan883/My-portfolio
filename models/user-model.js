const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
  fristname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});


module.exports = mongoose.model("users", userSchema);