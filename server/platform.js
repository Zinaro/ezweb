const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema({
  platformName: {
    type: String,
    required: true,
    unique: true,
  },
  platformImage: {
    type: String,
  },
});

module.exports = mongoose.model("Platform", platformSchema);