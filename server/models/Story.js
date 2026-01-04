// server/models/Story.js
const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Stories expire after 24 hours
StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Story", StorySchema);
