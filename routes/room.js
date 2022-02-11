const express = require('express');
const multer = require('multer');
const router = express.Router()
let RoomStyle = require('../models/roomStyle')
const path = require('path');
const upload = multer(
    {
        limits: {
            fileSize: 10000000
        },
        fileFilter(req, file, cb) {
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);
            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Error: File upload only supports the following filetypes - " + filetypes);
        }
    })

router.post("/add", upload.single('image'), async (req, res) => {
    try {
        const name = req.body.name;
        const max = req.body.max
        const bed = req.body.bed
        const description = req.body.description
        const createdBy = 'author' // edit later
        const image = req.file.buffer

        const newRoomStyleData = {
            name,
            max,
            bed,
            description,
            createdBy,
            image
        }
        console.log(newRoomStyleData);

        const newRoomStyle = new RoomStyle(newRoomStyleData)

        newRoomStyle
            .save()
            .then(() => {
                res.json({
                    status: true,
                    message: "New Room Style added successfully!"
                })
            })
    } catch (error) {
        res
            .status(400)
            .json({
                success: false,
                message: error.message
            })
    }

})

module.exports = router