const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  name: {
    type: String,
  },
  nation: {
    type: String,
  },
  comment: {
    type: String,
  },
  date: {
    type: Date,
    require,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("comments", commentSchema);
