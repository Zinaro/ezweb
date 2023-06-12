const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);