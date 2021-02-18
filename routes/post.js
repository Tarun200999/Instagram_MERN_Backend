const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Posts = mongoose.model("Posts");
const requireLogin = require("../middleware/requireLogin");

router.get("/mypost", requireLogin, (req, res) => {
  Posts.find({ postBy: req.user._id })
    .populate("postBy", "_id name")
    .then((myposts) => {
      res.json({ post: myposts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/showposts", (req, res) => {
  Posts.find()
    .populate("postBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((allpost) => {
      res.json({ posts: allpost });
    })
    .catch((error) => {
      console.log(error);
    });
});
router.post("/create", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    return res.status(422).json({ error: "Please add title and Body" });
  }
  req.user.password = undefined;
  const newpost = new Posts({
    title: title,
    body: body,
    photo: photo,
    postBy: req.user,
  });
  newpost
    .save()
    .then((savedPost) => {
      res.json({ post: savedPost });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put("/like", requireLogin, (req, res) => {
  const { postid } = req.body;
  if (!postid) {
    return res.json({ error: "Please Provide Post_id" });
  }
  Posts.findByIdAndUpdate(
    postid,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  const { postid } = req.body;
  if (!postid) {
    return res.json({ error: "Please Provide Post_id" });
  }
  Posts.findByIdAndUpdate(
    postid,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/addcomment", requireLogin, (req, res) => {
  const { comment, postid } = req.body;
  Posts.findByIdAndUpdate(
    postid,
    {
      $push: { comments: { text: comment, postedBy: req.user._id } },
    },
    { new: true }
  )
    .populate("postBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
});
module.exports = router;
