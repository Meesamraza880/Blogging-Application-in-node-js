const mongoose = require("mongoose");

const connectDB = async (DB_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "bloggingAppDB",
    };
    await mongoose.connect(DB_URL, DB_OPTIONS);
    console.log("db connted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
