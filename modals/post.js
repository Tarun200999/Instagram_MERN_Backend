const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const newPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  likes: [{ type: ObjectId, ref: "Users" }],
  comments: [
    {
      text: String,
      postedBy: {
        type: ObjectId,
        ref: "Users",
      },
    },
  ],
  postBy: {
    type: ObjectId,
    ref: "Users",
  },
});

mongoose.model("Posts", newPostSchema);
