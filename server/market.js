const mongoose = require("mongoose");
const Platform = require("./platform.js");

const marketSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  platforms: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Platform",
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Market", marketSchema);