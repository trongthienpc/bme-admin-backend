const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
  },
  quotes: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("blogs", BlogModel);
