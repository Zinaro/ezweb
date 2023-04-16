const mongoose = require("mongoose");

const url = 'mongodb://localhost:27017/zinar_database';
async function connect() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(url, options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connect errorr:", error);
  }
}

const db = {
  connect,
};

module.exports = db;