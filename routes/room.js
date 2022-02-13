const express = require("express");
const multer = require("multer");
const router = express.Router();
let RoomStyle = require("../models/roomStyle");
const path = require("path");
const verifyToken = require("../middleware/auth");

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
      fieldSize: 2 * 1024 * 1024
    },
    fileFilter(req, file, cb) {
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        "Error: File upload only supports the following filetypes - " + filetypes
      );
    },
  });

// list all room style
router.get("/all", verifyToken, async (req, res) => {
  try {
    console.log("calling room api");
    let response = await RoomStyle.find({});

    // console.log(response);
    res.send(response)
  } catch (error) {
    console.log(error);
  }
});

// add new room style
router.post("/add", upload.single('sex'), async (req, res) => {
  try {
    // console.log(req.body);

    const name = req.body.name;
    const max = req.body.max;
    const bed = req.body.bed;
    const description = req.body.description;
    const createdBy = "author"; // edit later
    const image = req.body.image;

    const newRoomStyleData = {
      name,
      max,
      bed,
      description,
      createdBy,
      image,
    };
    // // console.log(newRoomStyleData);

    const newRoomStyle = new RoomStyle(newRoomStyleData);

    newRoomStyle.save().then(() => {
      res.json({
        status: true,
        message: "New Room Style added successfully!",
      });
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const roomDeleteCondition = { _id: req.params.id }
    const deleteRoom = await RoomStyle.findOneAndDelete(roomDeleteCondition)

    if (!deleteRoom) {
      return res.status(401).json({
        success: false,
        message: 'Room Style not found or user not authorized'
      })
    }

    res.json({ success: true, room: deleteRoom })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})
module.exports = router;
