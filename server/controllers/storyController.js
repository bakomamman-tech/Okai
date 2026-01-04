// server/controllers/storyController.js
const Story = require("../models/Story");
const User = require("../models/User");

// Create a story
exports.createStory = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file ? "/uploads/" + req.file.filename : null;

    if (!image) return res.status(400).json({ message: "Image required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const story = await Story.create({ userId, image });
    res.json(story);
  } catch (e) {
    res.status(500).json({ message: "Failed to create story" });
  }
};

// Get all active stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "name username avatar")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};
