const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing. Create a .env file.");
  await mongoose.connect(uri);
  console.log("MongoDB connected successfully");
};
