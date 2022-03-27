const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const message = require("../middleware/const");
const foodModel = require("../models/foods");

// get all
// get by id
// post new
// put by id
// delete by id

router.get("/", verifyToken, async (req, res) => {
  try {
    const foods = await foodModel.find({});
    if (foods) res.send(foods);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodModel.findById(id);
    if (food) res.send(food);
    else res.status(401).json({ success: false, message: message.MESSAGE_401 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/add", multer().none(), verifyToken, async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const discount = req.body.discount;
  const createdBy = req.body.createdBy || "admin";
  const newEntity = { name, image, price, discount, createdBy };
  const newEntityModel = new foodModel(newEntity);
  try {
    await newEntityModel
      .save()
      .then((result) => {
        res.json({ success: true, message: message.ADD_SUCC });
      })
      .catch((error) =>
        res.status(400).json({ success: false, message: error.message })
      );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", multer().none(), verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await foodModel.findByIdAndDelete(id);
    if (result) res.json({ success: true, message: message.DEL_SUCC });
    else res.status(401).json({ success: false, message: message.MESSAGE_401 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id", multer().none(), verifyToken, async (req, res) => {
  const id = req.params.id;
  let newEntity = {};
  newEntity.name = req.body.name;
  newEntity.image = req.body.image;
  newEntity.price = req.body.price;
  newEntity.discount = req.body.discount;
  newEntity.createdBy = req.body.createdBy || "admin";
  newEntity.createdAt = Date.now();

  try {
    const result = await foodModel.findByIdAndUpdate(id, newEntity);
    if (result) res.json({ success: true, message: message.UPDATE_SUCC });
    else res.status(401).json({ success: false, message: message.MESSAGE_401 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
