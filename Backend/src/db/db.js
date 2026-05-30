const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}


module.exports = connectDB;