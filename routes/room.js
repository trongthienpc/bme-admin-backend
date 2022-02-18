const express = require("express");
const multer = require("multer");
const router = express.Router();
let RoomStyle = require("../models/roomStyle");
const path = require("path");
const verifyToken = require("../middleware/auth");

// upload image using multer
const upload = multer(
  {
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "./files");
      },
      filename(req, file, cb) {
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      },
    }),
  },
  {
    limits: {
      fieldSize: 2 * 1024 * 1024,
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

// list all room style
router.get("/all", verifyToken, async (req, res) => {
  try {
    console.log("calling room api");
    let response = await RoomStyle.find({});

    // console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

// get room by id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id:", id);
    const room = await RoomStyle.findById(id);
    if (!room) {
      return res.status(401).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({ success: true, room: room });
  } catch (error) {
    res.status(500).json({ success: false, message: "have a error in server" });
  }
});

// add new room style
router.post("/add", upload.single("image"), verifyToken, async (req, res) => {
  try {
    // console.log(req.body);

    const name = req.body.name;
    const max = req.body.max;
    const bed = req.body.bed;
    const size = req.body.size;
    const view = req.body.view;
    const description = req.body.description;
    const createdBy = "author"; // edit later
    const image = req.body.image;
    // const listImages = JSON.stringify(req.body.images);
    // console.log(listImages);
    console.log(req.body.images);
    const images = req.body.images;
    const newRoomStyleData = {
      name,
      max,
      bed,
      size,
      view,
      description,
      createdBy,
      image,
      images,
    };
    // // console.log(newRoomStyleData);

    const newRoomStyle = new RoomStyle(newRoomStyleData);

    newRoomStyle.save().then(() => {
      res.json({
        success: true,
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

// delete room
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const roomDeleteCondition = { _id: req.params.id };
    const deleteRoom = await RoomStyle.findOneAndDelete(roomDeleteCondition);

    if (!deleteRoom) {
      return res.status(401).json({
        success: false,
        message: "Room Style not found or user not authorized",
      });
    }

    res.json({ success: true, room: deleteRoom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// update room
router.put("/:id", verifyToken, upload.single("zip"), async (req, res) => {
  const name = req.body.name;
  const max = req.body.max;
  const bed = req.body.bed;
  const size = req.body.size;
  const view = req.body.view;
  const description = req.body.description;
  const createdBy = "author"; // edit later
  const image = req.body.image;
  const images = req.body.images;
  console.log(req.body.name);
  if (!name || !max || !bed || !description || !image)
    return res.status(400).json({
      success: false,
      message:
        "Please input information for all max, size, description, name and image",
    });

  try {
    const newRoom = {};
    newRoom.name = name;
    newRoom.max = max;
    newRoom.bed = bed;
    newRoom.size = size;
    newRoom.view = view;
    newRoom.description = description;
    newRoom.image = image;
    newRoom.images = images;
    newRoom.createdBy = "new author";

    const id = req.params.id;
    console.log(id);

    const update = await RoomStyle.updateOne({ _id: req.params.id }, newRoom, {
      new: true,
    });

    if (!update)
      res.status(401).json({ success: false, message: "Room not found" });

    res.json({
      success: true,
      message: "Updated successfully!",
      data: newRoom,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});
module.exports = router;
