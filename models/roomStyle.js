const mongoose = require('mongoose');
const Schema = mongoose.Schema

const roomStyleSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        bed: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        image: {
            type: Buffer
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String
        }

    }
)

module.exports = mongoose.model("roomStyles", roomStyleSchema)
