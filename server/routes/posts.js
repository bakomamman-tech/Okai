// server/routes/posts.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  toggleLike,
  addComment
} = require("../controllers/postController");

// Create a post
router.post("/", authMiddleware, createPost);

// Get all posts (feed)
router.get("/", authMiddleware, getPosts);

// Like/Unlike a post
router.put("/:postId/like", authMiddleware, toggleLike);

// Add a comment
router.post("/:postId/comment", authMiddleware, addComment);

module.exports = router;
