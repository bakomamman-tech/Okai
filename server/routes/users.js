// server/routes/users.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require("../controllers/userController");

/* ================== USER ROUTES ================== */

// Get a user's profile (requires authentication)
router.get("/:userId", authMiddleware, getUserProfile);

// Follow a user (requires authentication)
router.post("/:userId/follow", authMiddleware, followUser);

// Unfollow a user (requires authentication)
router.post("/:userId/unfollow", authMiddleware, unfollowUser);

// Get a user's followers list (requires authentication)
router.get("/:userId/followers", authMiddleware, getFollowers);

// Get a user's following list (requires authentication)
router.get("/:userId/following", authMiddleware, getFollowing);

module.exports = router;
