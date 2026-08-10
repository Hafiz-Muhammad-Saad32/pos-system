require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../src/app");
const { connectDB } = require("../src/config/db");

module.exports = async (req, res) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB(process.env.MONGO_URI);
  }
  return app(req, res);
};