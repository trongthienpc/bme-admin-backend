const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth");
const roomRoute = require("./routes/room");
const blogRoute = require("./routes/blog");
const commentRoute = require("./routes/comment");
const foodRoute = require("./routes/food");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bme-admin.5yuf9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
    console.log("Mongoose connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/comments", commentRoute);
app.use("/api/foods", foodRoute);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
