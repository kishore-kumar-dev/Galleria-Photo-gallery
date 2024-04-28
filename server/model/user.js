const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  imgUrl: {
    type: String,
    required: true
  },
  cloudinary_id: {
    type: String,
  },
  isBin: {
    type: Boolean,
    default: false
  },
  filename: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
