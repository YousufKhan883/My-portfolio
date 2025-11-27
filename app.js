require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin_router");
const userRouter = require("./routes/user_router");
const productRouter = require("./routes/product_router");
const cartRouter = require("./routes/cart_router");

const connectDB = require("./config/connection");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);


app.listen(PORT, () => {
  console.log(`Server Started at this ${PORT}`);
});
