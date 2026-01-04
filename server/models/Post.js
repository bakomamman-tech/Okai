// server/models/Post.js
const mongoose = require("mongoose");

/* ================== COMMENT SCHEMA ================== */
const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

/* ================== POST SCHEMA ================== */
const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema]
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

/* ================== EXPORT ================== */
module.exports = mongoose.model("Post", PostSchema);
