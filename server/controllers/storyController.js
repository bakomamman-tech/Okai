const Story = require("../models/Story");
const User = require("../models/User");
const { serializeStory } = require("../utils/serializers");

const userProjection =
  "name username avatar bio headline location website cover role followers following";

exports.createStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image?.trim();

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const story = await Story.create({ userId, image });
    await story.populate("userId", userProjection);

    res.status(201).json({
      message: "Story created successfully",
      story: serializeStory(story),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create story" });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("userId", userProjection).sort({ createdAt: -1 });

    res.json({
      stories: stories.map((story) => serializeStory(story)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};
