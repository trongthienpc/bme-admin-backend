const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodModel = new Schema({
  name: {
    type: String,
    require,
  },
  image: {
    type: String,
    require,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("foods", FoodModel);
