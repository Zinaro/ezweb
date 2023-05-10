const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true,
  },
  postContent: {
    type: String,
    required: true,
  },
  postDate: {
    type: String,
    default: new Date().toLocaleString("tr-TR"),
  },
  postAutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postCategory: {
    type: String,
    required: true,
  },
  likes: [
    {
      likeId: {
        type: String,
      },
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  ],
  postApproved: {
    type: Boolean,
    default: false,
  },
  postImage: {
    type: String,
  },
  postUrl: {
    type: String,
    required: true,
    unique: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
