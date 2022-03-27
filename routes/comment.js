const express = require("express");
const router = express.Router();
const commentModel = require("../models/comment");
const message = require("../middleware/const");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
// get all comments
router.get("/", verifyToken, async (req, res) => {
  try {
    const comments = await commentModel.find({});
    if (comments) {
      res.send(comments);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// get comment by id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await commentModel.findById(id);
    if (comment) {
      res.json({ success: true, comment });
    } else {
      res.status(401).json({ success: false, message: message.MESSAGE_401 });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// delete comment by id
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const id = req.params.id;
      const result = await commentModel.findByIdAndDelete(id);
      if (!result)
        res.status(401).json({
          success: false,
          message: message.MESSAGE_401,
        });
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// add new comment
router.post("/add", multer().none(), verifyToken, async (req, res) => {
  try {
    const name = req.body.name;
    const nation = req.body.nation;
    const comment = req.body.comment;
    const date = req.body.date;
    const createdBy = "admin";
    const newEntity = { name, nation, comment, date, createdBy };
    const newEntityModel = new commentModel(newEntity);
    await newEntityModel
      .save()
      .then((result) => {
        res.json({ success: true, message: message.ADD_SUCC });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: err.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//update comment by id
router.put("/:id", multer().none(), verifyToken, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    let newEntity = {};
    newEntity.name = req.body.name;
    newEntity.nation = req.body.nation;
    newEntity.comment = req.body.comment;
    newEntity.date = req.body.date;
    newEntity.createdAt = Date.now();
    console.log(newEntity);

    const result = await commentModel.findByIdAndUpdate(id, newEntity);
    if (result)
      res.json({
        success: true,
        message: message.UPDATE_SUCC,
        data: newEntity,
      });
    else res.json({ success: false, message: message.MESSAGE_401 });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
