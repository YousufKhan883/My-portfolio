const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String },
  // category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: String }],
  // sizes: [{ type: String }],
  // colors: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owner" },
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Products", productSchema);
