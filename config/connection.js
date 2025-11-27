const mongoose = require("mongoose");

require("dotenv").config();

function connectToMongoDB() {
  try {
    const dbURI = process.env.MONGODB_URI;
    mongoose.connect(dbURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
}

connectToMongoDB();
