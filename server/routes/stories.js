// server/routes/stories.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const { createStory, getStories } = require("../controllers/storyController");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Create a story
router.post("/", authMiddleware, upload.single("image"), createStory);

// Get all active stories
router.get("/", authMiddleware, getStories);

module.exports = router;
