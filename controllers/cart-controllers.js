const cartModel = require("../models/cart-model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const mongoose = require("mongoose");

module.exports.addToCart = async (req, res) => {
  if (!req.cookies.token) {
    return res.status(400).json({ message: "user not login" });
  }

  try {
    const { productId, quantity } = req.body;
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    const userId = user._id;

    let intquantity = parseInt(quantity);

    if (!userId || !productId || !intquantity) {
      return res
        .status(400)
        .json({ message: "user id product id and intquantity are required" });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        items: [{ product: productId, quantity: intquantity }],
      });
    } else {
      const existingitem = cart.items.find(
        (item) => item.product.toString() === productId.toString()
      );
      if (existingitem) {
        existingitem.quantity += intquantity;
      } else {
        cart.items.push({ product: productId, quantity: intquantity });
      }
    }
    await cart.save();

    const totalQuantity = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    res
      .status(200)
      .json({ message: "Item addToCart seccessfully", totalQuantity });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "sever error" });
  }
};

module.exports.reedProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty", cart: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.removeProduct = async (req, res) => {
    try {
     
      const {itemId} = req.body;
      console.log("recevd item id from data set", itemId);

      if(!itemId) {
        return res.status(400).json({success: false, message: "item id is required!"});
      }

      console.log("Rimoving item", itemId);

      const objectId = new mongoose.Types.ObjectId(itemId);


      const deletedItem = await cartModel.findOneAndDelete({ _id: objectId});
      console.log("delete item", deletedItem);
      

      if (!deletedItem) {
        return res.status(404).json({ success: false, message: "Item not found!" });
    }


    } catch (error) { 
      console.log("error rimoving item", error);
      res.status(500).json({success: false, message: "internal server error!"});
    }
};

module.exports.checkOut = async (req, res) => {
  res.render("users/purchase");
};
