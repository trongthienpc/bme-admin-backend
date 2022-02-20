const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const router = express.Router();
let BlogModel = require("../models/blog");
const messages = require("../middleware/const");

// upload image
const upload = multer(
  // {
  //   storage: multer.diskStorage({
  //     destination(req, file, cb) {
  //       cb(null, './files');
  //     },
  //     filename(req, file, cb) {
  //       cb(null, `${new Date().getTime()}_${file.originalname}`);
  //     }
  //   }),
  // },
  {
    limits: {
      fieldSize: 3 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      );
    },
  }
);

// get all
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log("call get all blogs");
    const response = await BlogModel.find({});
    if (response) {
      res.send(response);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// get by id
router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const response = await BlogModel.findById(id);
      if (response) res.json({ success: true, response });
      else
        res.status(401).json({
          success: false,
          message: messages.MESSAGE_401,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// delete by id
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      console.log("call delete blog at id: ", id);
      const result = await BlogModel.findOneAndDelete(id);
      if (!result)
        res.status(401).json({
          success: false,
          message: messages.MESSAGE_401,
        });
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// add new
router.post("/add", upload.single("sex"), verifyToken, async (req, res) => {
  try {
    const name = req.body.name;
    const avatar = req.body.avatar;
    const content = req.body.content;
    const quotes = req.body.quotes;
    const createdBy = "admin";
    const newEntity = { name, avatar, content, quotes, createdBy };
    const newEntityModel = new BlogModel(newEntity);
    await newEntityModel.save().then(() => {
      res.json({ success: true, message: messages.ADD_SUCC });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// update by id
router.put("/:id", upload.single("well"), verifyToken, async (req, res) => {
  try {
    console.log("call update blog");
    const id = req.params.id;
    const name = req.body.name;
    const avatar = req.body.avatar;
    const quotes = req.body.quotes;
    const content = req.body.content;

    let newEntity = {};
    newEntity.name = name;

    newEntity.avatar = avatar;
    newEntity.content = content;
    newEntity.quotes = quotes;
    newEntity.createdAt = Date.now();

    const result = await BlogModel.findByIdAndUpdate(id, newEntity);

    if (result) res.json({ success: true, message: messages.UPDATE_SUCC });
    else req.json({ success: false, message: messages.MESSAGE_401 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
